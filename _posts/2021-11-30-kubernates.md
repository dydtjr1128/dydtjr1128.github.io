---
layout: post
title:  "Kubernates(k8s) 이해하기"
subtitle: "Understanding kubernates(k8s)"
date: 2021-11-30 16:00:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Kubernates
tags : Kubernates
lastmod : 2021-11-30 16:00:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

## kubctl 커맨드

```bash
kubectl get nodes # 쿠버네티스 클러스터링 된 노드들을 확인
kubectl get nodes -o wide # 좀 더 상세히 보여주는 옵션

kubectl get pods # 파드 목록 표시
kubectl get pods -o wide # 좀 더 상세히 보여주는 옵션

# describe : 상세한 정보를 표시
kubectl describe node node1
kubectl describe pod webserver
```


## Kubernates에서 pod 생성하기

### kubectl run

단순히 하나의 컨테이너를 쿠버네티스가 관리하기 위해 실행하는 커맨드 입니다.

`kubectl run webserver --image=nginx:1.14 --port 80`

위와 같이 하나의 컨테이너를 띄우는 역할을 합니다.

#### dry-run

`webserver`라는 이름의 컨테이너가 이미 떠 있는경우 같은 명령을 치면 이미 떠 있기 때문에 실행되지않습니다.

`kubectl run webserver --image nginx:1.15 --port 80 --dry-run=client` 명령으로 실행가능한지 확인이 가능하고 뒤에 -o yaml 명령을 붙여 파일로 따로 빼올수도 있습니다.


### kubectl create

같은 이미지를 하나 혹은 여러개를 띄우기 위해서 사용합니다.

`kubectl create deployment mainui --image=httpd --replicas=3`

위와 같이 아파치를 컨테이너 3개로 띄울 수 있습니다.

`kubectl get deployment.app`라는 커맨드로 3개의 `mainui`라는 이름을 가진 컨테이너가 디플로이먼트로 떠있음을 확인 할 수 있습니다.
또한 `kubectl get pods`로 실제 컨테이너가 3개 떠있는것을 알 수 있습니다.

### kubectl delete

`kubectl delete pod webserver`, `kubectl delete deploy mainui`와 같은 커맨드로 떠있는 컨테이너를 내릴 수 있습니다.


