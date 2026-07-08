---
layout: post
title: "AKS에서 ADLS 연동하기"
subtitle: "Workload Identity로 ADLS Gen2에 연결한 방식"
date: 2026-07-08 09:00:00 +0900
lastmod: 2026-07-08 09:00:00 +0900
background: /img/posts/07.jpg
comments: true
catalog: true
categories: kubernetes, AKS, Azure
tags:
- kubernetes
- AKS
- Azure
- ADLS
- WorkloadIdentity
- DataCollection
---

# AKS에서 ADLS로 데이터 저장하기

회사에서 AKS에 구성한 애플리케이션에서 ADLS Gen2를 저장소로 사용해야 하는 일이 있었다. 장기 보관과 분석을 고려하면 ADLS에 직접 적재하는 구성이 필요했고, 애플리케이션은 컨테이너 환경에서 생성한 파일을 ADLS로 업로드해야 했다.

처음에는 스토리지 계정 키나 SAS 토큰을 Kubernetes Secret으로 주입하는 방식도 생각했지만, 장기간 운영해야 하는 환경에서 키를 직접 관리하는 방식은 교체와 노출 관리가 부담스러웠다. 그래서 AKS의 Workload Identity를 이용해 Pod가 Managed Identity로 ADLS에 접근하도록 구성하기로 했다.

## 적용 대상

GitOps 기준으로는 ADLS 접근이 필요한 애플리케이션 chart가 대상이다. 글에서는 특정 chart 이름보다 어떤 Kubernetes 리소스를 어떻게 연결했는지 중심으로 정리한다.

현재 구성은 다음 역할로 나뉜다.

1. Azure Portal에서 AKS OIDC Issuer와 Workload Identity를 활성화한다.
2. Azure Portal에서 애플리케이션용 Managed Identity를 만든다.
3. ADLS가 연결된 스토리지 계정에 Managed Identity 권한을 부여한다.
4. Managed Identity의 federated credential에 AKS namespace와 ServiceAccount를 연결한다.
5. GitOps에서는 ServiceAccount annotation, Pod label, ADLS 환경 변수를 Helm chart로 관리한다.
6. 애플리케이션에서는 Azure SDK의 `DefaultAzureCredential`을 사용한다.

인프라 리소스 자체는 UI에서 만들고, 애플리케이션 배포와 연결 정보는 GitOps에 남기는 방식으로 정리했다.

## GitOps 구성

Deployment에서는 Workload Identity webhook이 동작하도록 Pod label을 넣고, 별도 ServiceAccount를 사용한다.

{% raw %}
```yaml
spec:
  template:
    metadata:
      labels:
        app: {{ include "common.name" . }}
        {{- if .Values.workloadIdentity.enabled }}
        azure.workload.identity/use: "true"
        {{- end }}
    spec:
      serviceAccountName: {{ include "serviceaccount.workloadCredential.name" . }}
```
{% endraw %}

같은 Deployment에서 ADLS 계정과 filesystem 값도 환경 변수로 주입한다.

{% raw %}
```yaml
env:
  - name: DATA_ADLS_ACCOUNT
    value: {{ .Values.adls.account | quote }}
  - name: DATA_ADLS_FILESYSTEM
    value: {{ .Values.adls.filesystem | quote }}
  {{- if .Values.workloadIdentity.enabled }}
  - name: AZURE_CLIENT_ID
    value: {{ .Values.workloadIdentity.clientId | quote }}
  {{- end }}
```
{% endraw %}

ServiceAccount에는 Managed Identity의 Client ID를 annotation으로 넣는다.

{% raw %}
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "serviceaccount.workloadCredential.name" . }}
  namespace: {{ .Values.namespace }}
  annotations:
    {{- if .Values.workloadIdentity.enabled }}
    azure.workload.identity/use: "true"
    azure.workload.identity/client-id: {{ .Values.workloadIdentity.clientId | quote }}
    {{- end }}
```
{% endraw %}

prod values에서는 `workloadIdentity.enabled`를 켜고, ADLS account와 filesystem 값을 별도로 둔다. 실제 Client ID는 values에 들어가지만, 스토리지 계정 키나 SAS 토큰은 넣지 않는다.

## Azure Portal에서 맞춘 값

Azure 쪽에서는 모두 Portal UI에서 설정했다.

AKS 리소스에서는 OIDC Issuer와 Workload Identity가 활성화되어 있는지 확인했다. 여기서 확인한 OIDC Issuer URL은 Managed Identity의 federated credential을 만들 때 사용했다.

Managed Identity는 애플리케이션 전용으로 만들고, 스토리지 계정의 `액세스 제어 (IAM)`에서 `Storage Blob 데이터 Contributor` 역할을 부여했다. ADLS Gen2도 스토리지 계정 권한 모델을 사용하기 때문에, 파일 생성과 rename에 필요한 권한은 이 역할로 처리했다.

Federated credential에는 실제 GitOps에서 생성되는 namespace와 ServiceAccount 이름을 그대로 넣었다. 여기서 subject는 다음 형태가 된다.

```text
system:serviceaccount:<namespace>:<service-account-name>
```

이 값이 Helm chart의 ServiceAccount 이름과 다르면 Pod가 토큰을 받아도 Azure 토큰 교환이 실패한다.

## 애플리케이션 코드

애플리케이션 코드에서는 ADLS 계정명과 filesystem 값을 환경 변수로 읽어 ADLS endpoint를 정한다. 인증은 `DefaultAzureCredentialBuilder`를 사용한다.

```kotlin
private val service = DataLakeServiceClientBuilder()
    .endpoint("https://${Env.Adls.account}.dfs.core.windows.net")
    .credential(DefaultAzureCredentialBuilder().build())
    .buildClient()
```

AKS에서는 `AZURE_CLIENT_ID`와 ServiceAccount token이 주입되기 때문에, 별도 계정 키 없이 Managed Identity 인증 흐름으로 연결된다.

파일 적재는 바로 최종 경로에 쓰지 않고 stage 경로에 업로드한 뒤 최종 경로로 rename 하는 방식이다.

```kotlin
stageClient.uploadFromFile(tempFile.toString(), true)
stageClient.renameWithResponse(
    fs.fileSystemName,
    finalPath,
    null,
    null,
    Duration.ofMinutes(1),
    Context.NONE
)
```

이 방식으로 업로드 중인 임시 파일과 분석 대상이 되는 최종 파일을 분리했다. 최종 경로는 데이터 구분값과 날짜 기준의 파티션 구조로 정리된다.

## 정리

이번 구성은 스토리지 계정 키나 SAS 토큰을 Pod에 직접 넣지 않고, Workload Identity와 Managed Identity로 ADLS Gen2에 접근하는 방식이다.

이번 구성에서 핵심은 다음과 같다.

1. Azure Portal에서 AKS OIDC Issuer, Workload Identity, Managed Identity, federated credential을 설정한다.
2. GitOps에서는 ServiceAccount, Pod label, ADLS 환경 변수만 관리한다.
3. 애플리케이션은 `DefaultAzureCredential`로 인증하고, stage upload 후 final rename 방식으로 파일을 커밋한다.
