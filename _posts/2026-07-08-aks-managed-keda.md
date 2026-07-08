---
layout: post
title: "AKS에서 Azure Managed KEDA 사용하기"
subtitle: "ScaledObject 기반 오토스케일링 구성"
date: 2026-07-08 09:20:00 +0900
lastmod: 2026-07-08 09:20:00 +0900
background: /img/posts/07.jpg
comments: true
catalog: true
categories: kubernetes, AKS, Azure
tags:
- kubernetes
- AKS
- Azure
- KEDA
- GitOps
- Autoscaling
---

# AKS에서 Azure Managed KEDA 사용하기

회사에서 데이터 수집 성격의 워크로드를 신규 AKS 환경에 구성하면서 오토스케일링 방식도 정리할 필요가 있었다. 기존에는 서비스별로 HPA, CronJob, KEDA가 섞여 있었는데, 운영 관점에서는 스케일링 기준이 흩어져 있는 것이 불편했다.

AKS에서 제공하는 Azure Managed KEDA를 사용하면 KEDA operator 설치와 관리는 클러스터 add-on에 맡기고, GitOps 저장소에는 애플리케이션별 `ScaledObject`만 남길 수 있다. 그래서 신규 구성에서는 Azure Portal에서 managed KEDA를 활성화하고, 실제 스케일링 정책은 Helm chart의 `ScaledObject`로 관리하기로 했다.

## 적용 대상

GitOps 기준으로는 요청을 받는 수집 API chart와, 메시지를 소비해 파일로 저장하는 워커 chart가 대상이다. 글에서는 특정 chart 이름보다 스케일링 기준과 Kubernetes 리소스 구성을 중심으로 정리한다.

두 서비스의 스케일링 기준은 다르게 잡았다.

1. 수집 API: 시간대 cron + CPU + memory 기준
2. 저장 워커: 메시지 backlog + CPU + memory 기준

수집 API는 사용량이 몰리는 시간대가 어느 정도 예측 가능하고, 저장 워커는 메시지 backlog가 실제 처리 압력을 더 잘 보여주기 때문에 기준을 분리했다.

## Managed KEDA와 GitOps 역할 분리

KEDA 자체는 Azure Portal에서 AKS add-on으로 활성화했다. 별도 Helm chart로 KEDA operator를 GitOps에 넣지 않았다.

GitOps에는 KEDA 관련 리소스만 설정했다.

```text
ScaledObject
TriggerAuthentication
KEDA trigger용 Secret
```

KEDA가 내부적으로 HPA를 생성해 Deployment replicas를 조정하기 때문에, KEDA 대상 Deployment에는 `replicas`를 명시하지 않도록 했다. manifest에 replicas가 남아 있으면 Argo CD sync 시점에 값이 되돌아가면서 KEDA가 계산한 replicas와 충돌할 수 있다.

## 저장 워커 ScaledObject

저장 워커는 메시징 계층의 데이터를 소비하는 서비스다. 따라서 메시지 backlog를 가장 중요한 스케일링 기준으로 잡았다.

{% raw %}
```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: {{ include "scaledobject.name" . }}
  namespace: {{ .Values.namespace }}
  annotations:
    argocd.argoproj.io/sync-wave: "5"
spec:
  scaleTargetRef:
    name: {{ include "deployment.name" . }}
  minReplicaCount: {{ .Values.keda.minReplicaCount | default 5 }}
  maxReplicaCount: {{ .Values.keda.maxReplicaCount | default 15 }}
  pollingInterval: {{ .Values.keda.pollingInterval | default 30 }}
  cooldownPeriod: {{ .Values.keda.cooldownPeriod | default 120 }}
  triggers:
    - type: kafka
      metadata:
        bootstrapServers: {{ .Values.keda.kafka.bootstrapServers | quote }}
        topic: {{ .Values.keda.kafka.topic | quote }}
        consumerGroup: {{ .Values.keda.kafka.consumerGroup | quote }}
        lagThreshold: {{ .Values.keda.kafka.lagThreshold | quote }}
        activationLagThreshold: {{ .Values.keda.kafka.activationLagThreshold | quote }}
        offsetResetPolicy: latest
      authenticationRef:
        name: {{ include "keda.kafkaAuth.name" . }}
    - type: cpu
      metricType: {{ .Values.keda.resourceTriggers.cpu.metricType | trim | default "Utilization" }}
      metadata:
        value: {{ .Values.keda.resourceTriggers.cpu.value | default "80" | trim | quote }}
    - type: memory
      metricType: {{ .Values.keda.resourceTriggers.memory.metricType | trim | default "Utilization" }}
      metadata:
        value: {{ .Values.keda.resourceTriggers.memory.value | default "80" | trim | quote }}
```
{% endraw %}

prod 기준으로는 최소 5개, 최대 15개 Pod 범위에서 backlog, CPU, memory 트리거를 같이 본다. KEDA는 여러 trigger 중 더 큰 desired replicas 값을 기준으로 scale target을 조정한다.

backlog 확인용 trigger 인증은 `TriggerAuthentication`으로 분리했다.

{% raw %}
```yaml
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata:
  name: {{ include "keda.kafkaAuth.name" . }}
  namespace: {{ .Values.namespace }}
spec:
  secretTargetRef:
    - parameter: username
      name: {{ include "keda.kafkaAuthSecret.name" . }}
      key: username
    - parameter: password
      name: {{ include "keda.kafkaAuthSecret.name" . }}
      key: password
    - parameter: sasl
      name: {{ include "keda.kafkaAuthSecret.name" . }}
      key: sasl
    - parameter: tls
      name: {{ include "keda.kafkaAuthSecret.name" . }}
      key: tls
```
{% endraw %}

backlog 확인용 인증은 `TriggerAuthentication`으로 분리했다. 애플리케이션 런타임 인증과 KEDA trigger 인증은 동작 주체가 다르기 때문에 별도로 관리했다.

## 수집 API ScaledObject

수집 API는 외부 요청을 받아 메시징 계층으로 전달하는 stateless 서비스다. 기존에는 HPA와 CronJob으로 시간대별 min replicas를 조정하는 방식이 섞여 있었는데, 신규 구성에서는 KEDA cron trigger로 통일했다.

{% raw %}
```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: {{ include "scaledobject.name" . }}
  namespace: {{ .Values.namespace }}
  annotations:
    argocd.argoproj.io/sync-wave: "5"
spec:
  scaleTargetRef:
    name: {{ include "deployment.name" . }}
  minReplicaCount: {{ .Values.keda.autoscaling.minReplicas }}
  maxReplicaCount: {{ .Values.keda.autoscaling.maxReplicas }}
  triggers:
    - type: cron
      metadata:
        timezone: {{ .Values.keda.cron.timeZone | default "UTC" | quote }}
        start: {{ .Values.keda.cron.peak.startSchedule | quote }}
        end: {{ .Values.keda.cron.peak.endSchedule | quote }}
        desiredReplicas: {{ .Values.keda.cron.peak.desiredReplicas | quote }}
    - type: cpu
      metricType: Utilization
      metadata:
        value: {{ .Values.keda.autoscaling.cpuAverageUtilization | default 80 | quote }}
    - type: memory
      metricType: Utilization
      metadata:
        value: {{ .Values.keda.autoscaling.memoryAverageUtilization | default 80 | quote }}
```
{% endraw %}

prod values에서는 `Asia/Seoul` timezone 기준으로 피크 시간대를 잡고, 해당 시간대에는 desired replicas를 보장한다. 시간대 밖에서는 min replicas로 내려가되, CPU나 memory 사용률이 높으면 다시 scale out 된다.

## 기존 HPA/CronJob과 다른 점

기존 방식에서는 HPA가 CPU와 memory를 보고, 별도 CronJob이 특정 시간에 HPA의 min replicas를 patch 하는 구조가 가능했다. 하지만 이 방식은 CronJob, ServiceAccount, Role, RoleBinding까지 추가로 필요하고, Argo CD 관점에서도 변경 주체가 많아진다.

KEDA cron trigger로 바꾸면 같은 목적을 `ScaledObject` 하나 안에 넣을 수 있다.

1. 시간대 기준 desired replicas
2. CPU 사용률 기준 scale out
3. memory 사용률 기준 scale out
4. scale down 안정화 정책

수집 API chart에는 기존 HPA behavior도 KEDA의 `advanced.horizontalPodAutoscalerConfig.behavior`로 이관했다. 결과적으로 KEDA가 만든 내부 HPA가 기존 scale up/down 정책을 이어받는다.

## 운영 시 주의한 부분

KEDA를 쓰는 Deployment에는 `replicas`를 넣지 않는 것이 중요하다. GitOps manifest가 replicas를 계속 선언하면, KEDA가 조정한 replicas와 Argo CD가 원하는 replicas가 계속 어긋날 수 있다.

또한 KEDA가 직접 Deployment를 scale 하는 것이 아니라 내부 HPA를 만든다는 점도 이해해야 한다. 따라서 운영 화면에서는 `ScaledObject` 상태와 함께 KEDA가 만든 HPA도 같이 확인해야 한다.

Managed KEDA를 사용하면 operator 설치 관리는 AKS가 맡지만, ScaledObject 설계는 여전히 애플리케이션 특성을 알아야 한다. 수집 API처럼 요청량 시간 패턴이 중요한 서비스와 저장 워커처럼 backlog가 중요한 서비스는 같은 KEDA라도 trigger 구성이 달라야 한다.

## 정리

Azure Managed KEDA를 사용하면서 KEDA operator 관리는 AKS add-on에 맡기고, GitOps에는 서비스별 ScaledObject만 남겼다.

이번 구성에서는 다음 기준으로 나눴다.

1. 수집 API는 cron, CPU, memory trigger로 요청 피크 시간과 리소스 사용량을 함께 본다.
2. 저장 워커는 backlog, CPU, memory trigger로 적체량과 처리 리소스를 함께 본다.
3. KEDA가 내부 HPA를 관리하므로 Deployment replicas와 기존 HPA/CronJob patch 방식은 제거하는 방향으로 정리한다.
