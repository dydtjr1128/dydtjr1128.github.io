---
layout: post
title:  "Spring cloud와 MSA 이해하기"
subtitle: "Understanding Spring cloud with MSA(Micro Service Architecture)"
date: 2020-10-09 19:22:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Spring
tags : Spring
lastmod : 2020-10-09 19:22:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

## MSA(Micro Service Architecture)

MSA는 기존의 모놀리틱(Monolitic) 아키텍처의 대안으로 나왔으며 큰서비스에 적합한 구조입니다.
서비스가 큰 경우 하나의 서버로 처리하기에는 빌드시간이 오래걸리고, Scale-out 이 어려워 지는 등 다양한 문제점들이 발생하기 때문에 각각 의 기능을 나누어 독립 배포가 가능하도록 만듭니다.

이런 MSA 구조에서 각 마이크로 서비스들은 서로 로직 처리를 위해 데이터 송수신이 빈번하게 필요하게 되는데 이 때 서로의 IP등 각각의 마이크로 서비스에 대한 정보가 필요합니다.  
스프링 크레임 워크에서는 이러한 마이크로 서비스 아키텍처를 위해 `Spring Cloud`라는 기술을 제공합니다.

스프링 클라우드를 사용하면 보다 쉽게 서비스간의 연결을 보장 할 수 있습니다.

### 서비스 디스커버리(Service Discovery) - Eureka

![msa.png](./img/spring/msa.png)

| 이름 | 특징 | 단점 | 비고 |
| --- | --- | --- | --- |
| 컨설(Consul) | 1\. gossip \+ Raft 알고리즘<br>2\. Service discovery 시스템을 자체적으로 내장<br>3\. DNS\, HTTP 인터페이스 선택 사용<br>4\. key\-value 구조<br>5\. multiple datacenters 지원<br>6\. 쉬운 노드 추가<br>7\. 자체적인 UI 제공 | 짧은 역사 | 많이 쓰임<br>유료 라이선스에서 많은 기능들을 제공 |
| 주키퍼(Zookeeper) | 1\. Hadoop과 호환 잘됨<br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="0551e8fec2e0439fa3e81d30204c5cf4"><span data-offset-key="0551e8fec2e0439fa3e81d30204c5cf4:0">2\. 가장 오래 된 프로젝트</span></span></span><br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="b1de23e9f2cb4699a662cbc45e855411"><span data-offset-key="b1de23e9f2cb4699a662cbc45e855411:0">3\. 가장 신뢰성 높음</span></span></span><br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="bf28c6843f2e4d738c1ec171908b7372"><span data-offset-key="bf28c6843f2e4d738c1ec171908b7372:0">4\. 기술적으로 완성도 높음</span></span></span> | <span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="74229d945163461995313db01e5709e8"><span data-offset-key="74229d945163461995313db01e5709e8:0">자바 기반으로 경쟁자들에 비해 무겁고 많은 자원을 필요로 함</span></span></span><br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="535187fb6b134efba7519ac61c660be3"><span data-offset-key="535187fb6b134efba7519ac61c660be3:0">복잡함</span></span></span><br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="1a04cebef88e4d50b3edc7718f0614e5"><span data-offset-key="1a04cebef88e4d50b3edc7718f0614e5:0">동적으로 노드를 확장하기 어려움</span></span></span><br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="d697a16d74534a3abd8a1df8b426677b"><span data-offset-key="d697a16d74534a3abd8a1df8b426677b:0">primitive 값만 저장 가능</span></span></span> |  |
| 유레카(Eureka) | 1\. REST API 제공<br>2\. Java client 라이브러리 | <span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="74229d945163461995313db01e5709e8"><span data-offset-key="74229d945163461995313db01e5709e8:0">자바 기반으로 경쟁자들에 비해 무겁고 많은 자원을 필요로 함</span></span></span><br><span class="text-4505230f--TextH400-3033861f--textContentFamily-49a318e1"><span data-key="535187fb6b134efba7519ac61c660be3"><span data-offset-key="535187fb6b134efba7519ac61c660be3:0">복잡함</span></span></span> |  |

`서비스 디스커버리(Service Discovery)`는 단어 그대로 마이크로 서비스를 찾는데 도움을 주는 라이브러리 입니다. 이러한 역할을 하는 라이브러리들 중 스프링클라우드에서 지원하는 `Eureka(유레카)`가 있습니다.

유레카는 서버-클라이언트 구조로 이루어져 있기 때문에 클라이언트가 서버에 자신의 정보를 보내는 형태로 구성되어 있습니다. 클라이언트들은 서버에 자신의 정보를 등록하여 관리되는 방식입니다. 유레카 서버는 주기적으로 받은 정보들을 가지고 헬스 체크하여 인스턴스들을 관리하게 됩니다.

이러한 서비스 디스커버리 방식은 MSA 구조에서 마이크로 서비스들의 IP, 도메인, 포트정보등이 변경 될 수 있는데 이 때 클라이언트들은 서버에 이러한 정보들을 보내기 때문에 서버의 IP만 관리한다면 Scale-out(수평 확장) 하더라도 다른 정보들을 신경 쓸 필요가 없게 됩니다. 서비스를 호출 할 때 단순히 유레카 서버에 등록된 인스턴스를 조회하여 호출 하면 됩니다.

### 클라이언트 사이드 로드밸런서(Client Side Load Balancer) - Ribbon

클라이언트 사이드 로드밸런서라는 용어에서 클라이언트는 실제 브라우저와 같은 클라이언트가 아닌 마이크로서비스 가 호출하는 다른 각각의 인스턴스를 클라이언트를 뜻합니다.

서비스 디스커버리는 여러 인스턴스들 앞단에서 인스턴스들의 정보를 관리하는 역할을 한다면 클라이언트 사이드 로드밸런서는 마이크로서비스 인스턴스간 부하를 분배하기 위한 로드밸런서 입니다.

Eureka와 연동되는 Ribbon, Zookeeper와 연동되는 Curator등이 있습니다.

## API-GATEWAY

API GateWay를 이용해 최 앞단에서 로드밸런싱, 인증, 보안 등의 기능을 구축 할 수 있습니다.

API Gateway 또한 Zuul, KONG,Tyk, APIGee등 다양한 라이브러리들이 있습니다.

## Circuit Breaker

특정 서비스에서 오류 발생시 해당 서비스를 차단하여 연쇄적인 장애를 방지할수 있도록 해줍니다.
오류가 발생한 서비스가 자동 복구 가능한경우, 재 연결 가능하도록 도와줍니다.

Netflix Hystrix등이 이에 속합니다.

1. eureka-server : 유레카 서버는 각 클라이언트들의 정보를 싱크하여 맞춰주는 서버 입니다.
2. eureka-client : 유레카 클라이언트는 주기적으로 서버에 하트비트를 보내 생존 확인을 하고 관련 정보들을 싱크합니다.
3.zuul 


## Sample Image
![image](https://user-images.githubusercontent.com/19161231/95181641-863a7e00-07fe-11eb-8334-ea501ed2d5da.png)


### 참조

https://www.nginx.com/blog/service-discovery-in-a-microservices-architecture/
https://www.slideshare.net/ssuserdaac8e/ss-78875129
