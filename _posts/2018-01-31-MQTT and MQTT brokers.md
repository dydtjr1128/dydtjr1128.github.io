---
layout: post
title:  "MQTT 프로토콜과 MQTT 브로커들"
subtitle: "MQTT protocol & MQTT brokers"
date:   2018-01-31 16:14:30 +0900
background: '/img/posts/07.jpg'
comments: true
categories: MQTT
tags : MQTT
lastmod : 2019-04-11 17:31:33 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---
<br>

![/img/Ch](/img/MQTT/MQTT-Broker-structure.png){:width="60%"}{:.center}


<div class="contentTitle">
MQTT
</div>

MQTT는 Message Queuing Telemetry Transport의 약자로서 1999년 IBM과 Eurotech(Arcom)에 의해 최초로 개발되었다. 초창기에는 원격검침의 용도로 만들었다. 원격검침의 경우 대부분 저전력 배터리 등 제한적인 특정 환경에서 동작하기 때문에 낮은 전력, 낮은 대역폭 환경에서 사용할 수 있도록 설계되었다. 이러한 점 때문에 IoT에 사용하기 유용하다.

QOS(Quality Of Service)를 0,1,2로 나눈다.

- QOS 0 : 메시지는 한 번만 전달하며, 전달 여부를 확인하지 않는다. Fire and Forget(udp와 같이 한번 보내고 ACK를 받지 않는 것과 같이 전달 여부를 확인하지 않는다.) 타입이다.
- QOS 1 : 메시지는 반드시 한 번 이상 전달된다. 하지만 메시지의 핸드셰이킹 과정을 엄밀하게 추적하지 않기 때문에, 중복 전송될 수도 있다.
- QOS 2 : 메시지는 한 번만 전달된다. 메시지의 핸드셰이킹 과정을 추적한다. 높은 품질을 보장하지만 성능의 희생이 따른다.  
<br>

### MQTT 동작 원리
MQTT는 publish/subscribe/broker를 사용하는 프로토콜로서 subscriber는 토픽을 구독하기 위한 목적으로, publisher는 토픽을 발행하는 목적으로 broker와 연결하게 된다.

![/img/Ch](/img/MQTT/MQTT-structure.png){:width="60%"}{:.center}

토픽은 /로 구분 지어 계층으로 관리할 수 있기 때문에 다수의 센서를 관리하기 용이하다.

![/img/Ch](/img/MQTT/MQTT-topic-structure.png){:width="60%"}{:.center}

MQTT는 메시지 버스 시스템으로서 MQTT Broker가 메시지 버스를 만들고, 여기에 메시지를 흘려보내면, 버스에 붙은 애플리케이션들이 메시지를 읽어가는 방식이다. 메시지 버스에는 다양한 주제의 메시지들이 흐를 수 있는데, 메시지를 구분하기 위해서 “Topic”을 이름으로 하는 메시지 채널을 만든다.

![/img/Ch](/img/MQTT/MQTT-message-structure.png){:width="60%"}{:.center}

TCP/IP를 통해 실행되어 기본 네트워크 연결을 제공한다.


MQTT Broker : MQTT 서버라고 하지 않고 중개인이라고 하는 이유는 MQTT가 Pub(발행인)과 Sub(구독자)가 메시지를 주고받을 수 있도록 다리를 놔주는 역할만 하기 때문이다. 다양한 종류의 브로커들이 있다.
- mosquitto
- HiveMQ
- Rabbit MQ
- IBM MQ
- Vertx

MQTT Client : MQTT on Android, MQTT on Android, Eclipse Paho 등의 라이브러리를 
이용하여 다양한 운영체제를 지원한다.

![/img/Ch](/img/MQTT/MQTT-Broker-compare.png){:width="60%"}{:.center}
<pre>https://github.com/mqtt/mqtt.github.io/wiki/server-support</pre>

<br>
<div class="contentTitle">
Mosquitto
</div>
<div>
 <img src="/img/MQTT/mqtt-logo.png" width="20%" align="left" style="margin-right:5%"/>
 Mosquitto는 MQTT 프로토콜 버전 3.1 및 3.1.1을 사용하는 메시지 브로커 중 하나이다. 
MQTT는 공개 / 등록 모델을 사용하여 메시징을 수행하는 경량 메서드를 제공한다. 따라서 저전력 센서 나 전화, 임베디드 컴퓨터 또는 Arduino와 같은 마이크로 컨트롤러와 같은 모바일 장치와 같은 "Internet of Things"메시징에 적합하다.
</div>
<br clear="left">


### References

<pre>
https://github.com/mqtt/mqtt.github.io/wiki/tools
https://github.com/mqtt/mqtt.github.io/wiki/server-support
https://www.joinc.co.kr/w/man/12/MQTT/Tutorial
https://www.ibm.com/support/knowledgecenter/ko/SSFKSJ_7.5.0/com.ibm.mm.tc.doc/tc60340_.htm
http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Table_2.2_-
https://www.eclipse.org/paho/
https://mosquitto.org/
https://www.joinc.co.kr/w/man/12/MQTT/Cluster
</pre>