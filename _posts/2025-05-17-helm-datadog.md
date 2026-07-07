---
layout: post
title: Datadog helm으로 설치하기기
subtitle: Datadog helm으로 설치하기기
date: 2025-05-17 16:51 +0900
lastmod: 2025-05-17 16:51 +0900
background: /img/posts/07.jpg
comments: true
catalog: true
categories: datadog, monitoring
tags:
- datadog
- monitoring
---
# Datadog

Datadog은 클라우드 규모의 애플리케이션을 위한 모니터링 및 분석 플랫폼입니다. 서버, 데이터베이스, 도구 및 서비스에서 데이터를 수집하여 전체 스택에 대한 통합된 뷰를 제공하며, 이를 통해 개발팀과 운영팀이 문제를 신속하게 해결하고 성능을 최적화할 수 있도록 지원합니다.

## helm 데이터독 설치

```
https://github.com/DataDog/helm-charts
```
해당 url의 차트를 추가해야 합니다.

### Key 셋팅
그 후에 Datadog 사이트에서  
1. Organization Settings > API Keys에서 키를 발급받아야 합니다.
2. Organization Settings > Application Keys에서 키를 발급받아야 합니다.

이 두가지 키를 이용해 secret에 저장합니다.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: datadog-secret
  namespace: datadog
data:
  api-key: <API-KEY>
  app-key: <APP-KEY>
type: Opaque
```


### 기본 설정 helm 셋팅
```yaml
registry: "gcr.io/datadoghq"
datadog:
  apiKeyExistingSecret: datadog-secret
  appKeyExistingSecret: datadog-secret
  clusterName: my-aks-stage # datadog에 표시될 클러스터 이름
  site: "us3.datadoghq.com" # datadog region 도메인인
  tags: # https://docs.datadoghq.com/ko/getting_started/tagging/ 다양한 태그 기능능
  containerExclude: containerExclude: "kube_namespace:^kube-.* kube_namespace:^default$ kube_namespace:^default-.* kube_namespace:gatekeeper-system kube_namespace:.*nginx.* kube_namespace:argocd kube_namespace:.*-stage$"
  containerInclude: "kube_namespace:*" # 제외한 네임스페이스 이외에 모두 수집
  resources: #필요하다면
    limits:
      cpu: 1000m
      memory: 2500Mi
    requests:
      cpu: 100m
      memory: 256Mi
  criSocketPath: /var/run/containerd/containerd.sock # aks에서 github.com/DataDog/datadog-agent/pkg/collector/corechecks/containers/containerd.(*ContainerdCheck).computeEvents 에러발생하는경우
  apm:
    enabled: true
    socketEnabled: true
    instrumentation:
        enabled: false # apm 자동 삽입 기능(어노테이션없이도 다들어감 문제생길여지 있음)
  logs:
    enabled: true
    containerCollectAll: true
    autoMultiLineDetection: true # 멀티라인로그 자동 인식식(ex springboot) 자동 적용용
  networkMonitoring:
    enabled: true
  processAgent:
    enabled: true
    processCollection: true
  kubelet: #https://docs.datadoghq.com/ko/containers/kubernetes/distributions/?tab=helm
    coreCheckEnabled: false # kubelet을 안쓸경우
    tlsVerify: false # aks에서 필수
    host:
      valueFrom:
        fieldRef:
          fieldPath: spec.nodeName
    hostCAPath: /etc/kubernetes/certs/kubeletserver.crt
clusterAgent:
  containerExclude: "kube_namespace:^kube-.* kube_namespace:^default$ kube_namespace:^default-.* kube_namespace:gatekeeper-system kube_namespace:.*nginx.* kube_namespace:argocd kube_namespace:.*-stage$"
  containerInclude: "kube_namespace:*"
providers:
  aks:
    enabled: true

clusterAgent:
  nodeSelector:
    agentpool: commonpool # 등록안된 모든 nodeselector에 설정(안하면 다른풀도 모니터링)
  metricsProvider:
    enabled: true # Datadog Cluster Agent가 Kubernetes API 서버에 외부 메트릭 공급자(External Metrics Provider)로 등록됩니다. 이걸 한다면 hpa등에 datadog값에 따라 스케일링 설정도 가능합니다.
```


## Datadog deployment.yaml 설정 예시
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "deployment.name" . }}
  namespace: {{ .Values.namespace }}
  labels:
    app: {{ include "common.name" . }}
    chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}
    {{- if .Values.datadog.enabled }}
    tags.datadoghq.com/env: "{{ .Values.springProfileActive | default "develop" }}"
    tags.datadoghq.com/service: "{{ include "common.name" . }}"
    tags.datadoghq.com/version: "{{ .Values.image.tag | default .Chart.AppVersion }}"
    {{- end }}
spec:
  revisionHistoryLimit: 3
  replicas: {{ .Values.replicaCount }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: {{ include "common.name" . }}
  template:
    metadata:
      {{- if .Values.datadog.enabled }}
      annotations:
        admission.datadoghq.com/java-lib.version: "latest" # 또는 특정 라이브러리 버전을 명시할 수 있습니다.
      {{- end }}
      labels:
        app: {{ include "common.name" . }}
        {{- if .Values.datadog.enabled }}
        tags.datadoghq.com/env: "{{ .Values.springProfileActive | default "develop" }}"
        tags.datadoghq.com/service: "{{ include "common.name" . }}"
        tags.datadoghq.com/version: "{{ .Values.image.tag | default .Chart.AppVersion }}"
        admission.datadoghq.com/enabled: "true" # Enable Datadog Admission Controller
        {{- end }}
    spec:
      nodeSelector:
        agentpool: {{ .Values.agentpool }}
      volumes:
        {{- if .Values.datadog.enabled }}
        - name: datadog-apm-agent
          emptyDir: {}
        {{- end }}
        {{- if .Values.configMap.enabled }}
        - name: application-configmap
          configMap:
            name: {{ include "configmap.name" . }}
        {{- end }}
      containers:
        - name: {{ include "deployment.name" . }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          ports:
            - containerPort: 8080
              protocol: TCP
            - containerPort: 8090
              protocol: TCP
          volumeMounts:
          {{- if .Values.datadog.enabled }}
            - name: datadog-apm-agent
              mountPath: /datadog/apm/agent
          {{- end }}
          {{- if .Values.configMap.enabled }}
            - name: application-configmap
              mountPath: /config
              readOnly: true
          {{- end }}
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: {{ .Values.springProfileActive | default "develop" }}{{- if .Values.configMap.enabled }},configmap{{- end }}
          {{- if .Values.datadog.enabled }}
            # --- Agent 기본 플래그 ---
            - name: DD_ENV
              valueFrom:
                fieldRef:
                  fieldPath: metadata.labels['tags.datadoghq.com/env']
            - name: DD_SERVICE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.labels['tags.datadoghq.com/service']
            - name: DD_VERSION
              valueFrom:
                fieldRef:
                  fieldPath: metadata.labels['tags.datadoghq.com/version']
            # --- Agent 행동 플래그 ---
            - name: DD_LOGS_INJECTION
              value: "true"  # 로그 삽입 활성화
            - name: DD_PROFILING_ENABLED
              value: "true"  # 프로파일링 활성화
            - name: DD_RUNTIME_METRICS_ENABLED
              value: "true"  # 런타임 메트릭 활성화
            - name: DD_TRACE_DEBUG
              value: "false"  # 디버깅 설정, 필요시 true로 설정
            - name: DD_TRACE_ANALYTICS_ENABLED
              value: "true"  # 트레이스 분석 활성화
            - name: DD_APM_ADAPTIVE_SAMPLING
              value: "true"  # 적응형 샘플링 활성화
            - name: DD_JMXFETCH_ENABLED # JMX 데이터 수집 활성화
              value: "true"
            - name: DD_TRACE_SAMPLING_RULES # 로그 샘플링 데이터 비율 조정(원격으로도 가능)
              value: '[
              {"resource":"GET /secure/actuator/health","sample_rate":0.1},
              {"resource":"GET /secure/actuator/health/**","sample_rate":0.1},
              {"resource":"kafka.poll","sample_rate":0.1},
              {"resource":"OperationHandler.handle","sample_rate":0.1},
              {"resource":"PING","sample_rate":0.1},
              {"resource":"EVAL","sample_rate":0.1}
              ]'
            - name: DD_TAGS # 기본지원 태그 layer,team은 설정시 할당되는 태그(datadog 지원 태그)
              value: "layer:api, team:업무혁신팀, framework:springboot"
          {{- end }}
          livenessProbe:
            httpGet:
              path: /secure/actuator/health/liveness
              port: 8090
            initialDelaySeconds: 60
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /secure/actuator/health/readiness
              port: 8090
            initialDelaySeconds: 60
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          imagePullPolicy: {{ .Values.image.pullPolicy }}
```

