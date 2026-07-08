---
layout: post
title: "AKS에서 Key Vault와 ExternalSecret 연동하기"
subtitle: "External Secrets Operator로 애플리케이션 Secret을 관리한 방식"
date: 2026-07-09 10:00:00 +0900
lastmod: 2026-07-09 10:00:00 +0900
background: /img/posts/07.jpg
comments: true
catalog: true
categories: kubernetes, AKS, Azure
tags:
- kubernetes
- AKS
- Azure
- KeyVault
- ExternalSecret
- SecretManagement
---

# AKS에서 Key Vault Secret을 관리하는 방법

회사에서 서비스를 AKS에 구성하면서 런타임 Secret을 어떻게 관리할지 정해야 했다. DB 계정, JWT secret, 외부 API key, Redis password처럼 민감한 값이 많았고, 이 값을 Kubernetes Secret manifest나 Helm values에 직접 넣는 방식이나 부트 yaml에 관리하는 방식은 노출될 수 있어 피하고 싶었다.

AKS에 Secret 생성 방식을 Key Vault와 연동하는 방법을 찾다보니, Azure뿐만 아니라 다양한 플랫폼에서 사용할 수 있는 ExternalSecret 방식이 있어 해당 방식을 적용하기로 했다.

External Secrets Operator를 사용하면 Azure Key Vault 값을 Kubernetes Secret으로 동기화할 수 있고, 애플리케이션은 기존 Spring 환경 변수 방식 그대로 Secret을 읽을 수 있다.

## 적용 대상

GitOps 기준으로는 애플리케이션 chart에서 Secret 관련 리소스를 함께 관리하는 방식으로 잡았다. 글에서는 특정 chart 이름보다 어떤 리소스를 어떤 역할로 나눴는지 중심으로 정리한다.

구성은 다음 흐름이다.

1. Azure Portal에서 환경별 Key Vault를 만든다.
2. Azure Portal에서 애플리케이션용 Managed Identity를 만들고 Key Vault 접근 권한을 준다.
3. AKS ServiceAccount와 Managed Identity를 federated credential로 연결한다.
4. 클러스터 관리 UI에서 External Secrets Operator를 설치한다.
5. GitOps에서는 `ServiceAccount`, `SecretStore`, `ExternalSecret`을 Helm chart로 관리한다.
6. Deployment는 `ConfigMap`과 Kubernetes `Secret`을 `envFrom`으로 읽는다.

비민감 설정은 `ConfigMap`, 민감 값은 Key Vault와 ExternalSecret으로 분리했다.

## GitOps 구성

애플리케이션 chart의 ServiceAccount는 Azure Workload Identity에 연결된다.

{% raw %}
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "app.serviceAccountName" . }}
  namespace: {{ .Values.namespace }}
  annotations:
    azure.workload.identity/client-id: {{ .Values.workloadIdentity.clientId | quote }}
```
{% endraw %}

`SecretStore`는 Azure Key Vault를 바라보도록 설정한다. 이 chart에서는 `tenantId`, `vaultUrl`, `serviceAccountRef`를 values에서 받아 렌더링한다.

{% raw %}
```yaml
apiVersion: external-secrets.io/v1
kind: SecretStore
metadata:
  name: {{ include "app.secretStoreName" . }}
  namespace: {{ .Values.namespace }}
spec:
  provider:
    azurekv:
      tenantId: {{ required "workloadIdentity.tenantId is required for Azure Key Vault SecretStore" .Values.workloadIdentity.tenantId | quote }}
      authType: WorkloadIdentity
      vaultUrl: {{ .Values.keyVault.vaultUrl | quote }}
      serviceAccountRef:
        name: {{ include "app.serviceAccountName" . }}
```
{% endraw %}

`ExternalSecret`은 Key Vault의 secret 이름과 Kubernetes Secret 안의 key 이름을 매핑한다.

{% raw %}
```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: {{ include "app.envName" . }}
  namespace: {{ .Values.namespace }}
spec:
  refreshInterval: {{ .Values.externalSecret.refreshInterval | quote }}
  secretStoreRef:
    kind: SecretStore
    name: {{ include "app.secretStoreName" . }}
  target:
    name: {{ include "app.secretName" . }}
    creationPolicy: {{ .Values.externalSecret.target.creationPolicy }}
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: app-db-password
    - secretKey: JWT_SECRET
      remoteRef:
        key: app-jwt-secret
```
{% endraw %}

실제 values에는 DB, JWT, 외부 API, Redis 관련 secret key들이 들어간다. 값 자체는 Key Vault에만 저장하고, GitOps에는 어떤 Key Vault secret을 어떤 환경 변수명으로 노출할지만 남긴다.

## Deployment 연결

Deployment는 `ConfigMap`과 Kubernetes `Secret`을 함께 읽는다.

{% raw %}
```yaml
envFrom:
  - configMapRef:
      name: {{ include "app.configMapName" . }}
  - secretRef:
      name: {{ include "app.secretName" . }}
```
{% endraw %}

Spring 애플리케이션에서는 기존처럼 `${DB_PASSWORD}`, `${JWT_SECRET}` 같은 환경 변수를 사용하면 된다. 애플리케이션 코드는 Key Vault나 ExternalSecret을 직접 알 필요가 없다.

이 구조 덕분에 비민감 설정은 GitOps에서 바로 리뷰할 수 있고, 민감 값은 Key Vault에서 버전 관리와 권한 관리를 할 수 있다.

## Azure Portal에서 맞춘 값

Azure Portal에서는 환경별 Key Vault를 만들고, 애플리케이션용 Managed Identity에 `Key Vault Secrets User` 권한을 부여했다.

그 다음 Managed Identity의 `Federated credentials`에서 앱별 ServiceAccount를 연결했다. 애플리케이션별 ServiceAccount를 분리하고 있기 때문에, 앱이 늘어나면 federated credential도 ServiceAccount 단위로 추가해야 한다.

subject는 다음 형식이다.

```text
system:serviceaccount:<namespace>:<service-account-name>
```

예를 들어 API 애플리케이션은 해당 namespace의 전용 ServiceAccount를 사용한다. 배치성 워크로드도 같은 패턴으로 `ServiceAccount`, `SecretStore`, `ExternalSecret`을 만든다.

## ExternalSecret을 선택한 이유

Key Vault를 AKS와 연결하는 방식은 CSI Driver처럼 파일 mount로 쓰는 방식도 있다. 하지만 이 애플리케이션은 이미 Spring 설정이 환경 변수 중심이고, GitOps chart에서도 Deployment가 `envFrom`으로 `ConfigMap`과 `Secret`을 읽는 구조였다.

이 경우 ExternalSecret 방식이 더 자연스러웠다.

1. 애플리케이션 코드를 바꾸지 않아도 된다.
2. Kubernetes Secret을 기준으로 기존 Deployment 구조를 유지할 수 있다.
3. GitOps에는 secret 값이 아니라 매핑 정보만 남길 수 있다.
4. Key Vault에서 secret 버전과 접근 권한을 관리할 수 있다.

## 정리

이번 ExternalSecret 구성은 “Key Vault를 앱이 직접 읽는다”가 아니라 “External Secrets Operator가 Key Vault 값을 Kubernetes Secret으로 동기화하고, 앱은 Kubernetes Secret을 환경 변수로 읽는다”에 가깝다.

정리하면 핵심은 다음 세 가지다.

1. Azure Portal에서 Key Vault, Managed Identity, federated credential, 권한을 설정한다.
2. GitOps에서는 `ServiceAccount`, `SecretStore`, `ExternalSecret`, `Deployment envFrom`만 관리한다.
3. 민감 값은 Key Vault에만 두고, Git에는 secret 이름과 매핑 정보만 남긴다.

## 문제점
ExternalSecret을 1h로 주었는데 이게 1시간마다 동기화된다고한다. KeyVault를 수정하고 서버 재 배포하더라도 바로 적용이 안되는 경우들이 있을것같아 이부분은 좀더 고민이 필요해 보인다.
