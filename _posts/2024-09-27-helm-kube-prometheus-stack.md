---
layout: post
title: kube-prometheus-stack helm으로 설치하기
subtitle: kube-prometheus-stack helm으로 설치하기
date: 2024-09-27 16:51 +0900
lastmod: 2024-09-27 16:51 +0900
background: /img/posts/07.jpg
comments: true
catalog: true
categories:  prometheus, grafana, monitoring
tags:
- prometheus
- grafana
- monitoring
---
# kube-prometheus-stack

`kube-prometheus-stack`은 Kubernetes 환경에서 모니터링 및 경고 시스템을 쉽게 설정할 수 있도록 설계된 Helm 차트입니다.  이 스택은 Prometheus, Alertmanager, Grafana와 같은 오픈 소스 프로젝트를 이용해 k8s 클러스터 및 애플리케이션의 성능 및 상태를 모니터링하고 알림을 받을 수 있게 모아둔 차트입니다.

이번엔 간단하게 prometeus및 grafana정도를 설치할예정입니다.

## 주요 구성 요소:

1. **Prometheus**: Kubernetes 클러스터에서 메트릭 데이터를 수집하고 쿼리하는 역할. Pod, Node, Service등의 성능 데이터를 모니터링 가능.
2. **Alertmanager**: Prometheus에서 설정된 경고 규칙에 따라 특정 조건이 발생하면 경고를 관리하고 알림 발송. 슬랙, 이메일, azure 팀즈 등 다양한 서비스 지원.
3. **Grafana**: 수집된 메트릭 데이터를 시각화하고 대시보드를 통해 사용자에게 제공하는 도구로 Prometheus를 데이터소스로 연결해 실시간 모니터링이 가능.
4. **Node Exporter**: 각 노드별로 daemonSet으로 떠있으며 하드웨어 및 운영 체제 수준의 메트릭을 수집.
5. **Kube State Metrics**: Kubernetes API를 통해 클러스터 상태(Pod, Deployment 상태 등)를 수집해 Prometheus에 전달


## 프로메테우스(prmetheus) 설정

참고로 aks에 helm을 이용해 설치하는내용을 기준으로 작성했습니다.

```yaml
prometheus:
  enabled: true
  prometheusSpec:    
    storageSpec:
    ## Using PersistentVolumeClaim
      volumeClaimTemplate:
        spec:
          storageClassName: azurefile-csi
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 25Gi
```

```yaml
prometheus:
  enabled: true
  ingress:
      enabled: true

      ingressClassName: azure-application-gateway

      hosts:
        - aks-prometheus-dev.my-domain.com
      tls:
      - hosts:
        - aks-prometheus-dev.my-domain.com
        secretName: my-domain-com-secret
```


## grafana 설정
`azure application gateway`를 사용중이고 기본으로 AGIC(Azure Gateway Ingress Controller)를 사용중입니다.
아래는 ingress 및 persistance 설정이며 기본적으로 grafana설정에 ingress 및 도메인 설정을 해주었습니다.

```yaml
  ingress:
    enabled: true
    ingressClassName: azure-application-gateway
    annotations: 
      - appgw.ingress.kubernetes.io/ssl-redirect: "true"
    labels: {}
    hosts: 
      - aks-grafana-dev.my-domain.com
    path: /
    tls: []
      - secretName: grafana-general-tls
        hosts:
        - aks-grafana-dev.my-domain.com

  # # To make Grafana persistent (Using Statefulset)
  # #
  persistence:
    enabled: true
    type: pvc
    storageClassName: "azurefile-csi"
    accessModes:
      - ReadWriteOnce
    size: 20Gi
    finalizers:
      - kubernetes.io/pvc-protection
  assertNoLeakedSecrets: false
  grafana.ini:
   database:
    type: mysql
    host: host
    name: aks_grafana
    user: dev-grafana
    password: password
  serviceAccount:
    create: true
    autoMount: true
```


### loki 설치
```yaml
loki:  
  schemaConfig:
    configs:
      - from: 2024-04-01
        store: tsdb
        object_store: s3
        schema: v13
        index:
          prefix: loki_index_
          period: 24h
  useTestSchema: false
  ingester:
    chunk_encoding: snappy
```