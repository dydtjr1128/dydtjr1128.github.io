---
layout: post
title:  "Mosquitto publisher/subscriber Test 하기"
subtitle: "Mosquitto publisher/subscriber Test"
date:   2018-01-18 17:26:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: MQTT
tags : MQTT
lastmod:   2019-04-11 14:49:15 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

## Ubuntu에서 Mosquitto(MQTT Broker) 설치하기  
<br>

![/img/Ch](/img/MQTT/mqtt-logo.png){:width="25%"}{:.center}

#### ※본 글은 Mosquitto1.4.14 버전 기준으로 작성되었습니다.


환경 설정  
- OS - Ubuntu 16.04.3-desktop-amd64  
- Source - mosquitto-1.4.14  

<br>  
Mosquitto를 이용하여 간단한 실행 테스트 코드를 작성할 수 있다.

● my_pub.c
```c
#include <errno.h>
#include <fcntl.h>
#include <stdlib.h>
#include <string.h>
#include <mosquitto.h>
#include <stdio.h>

#define MQTT_HOSTNAME "localhost"
#define MQTT_PORT 1883
#define MQTT_USERNAME "admin"
#define MQTT_PASSWORD "admin"
#define MQTT_TOPIC "myTopic"

/*
 * Start here
 */

int main(int argc, char **argv) {
   struct mosquitto *mosq = NULL;

   // 초기화
   mosquitto_lib_init();

   // 모스키토 런타임 객체와 클라이언트 랜덤 ID 생성
   mosq = mosquitto_new(NULL, true, NULL);
   if (!mosq) {
      printf("Cant initiallize mosquitto library\n");
      exit(-1);
   }

   mosquitto_username_pw_set(mosq, MQTT_USERNAME, MQTT_PASSWORD);

   // MQTT 서버 연결 설립, keep-alive 메시지 사용 안함
   int ret = mosquitto_connect(mosq, MQTT_HOSTNAME, MQTT_PORT, 0);
   if (ret) {
      printf("Cant connect to mosquitto server\n");
      exit(-1);
   }

   char text[20] = "Nice to meet u!\n";
   
   ret = mosquitto_publish(mosq, NULL, MQTT_TOPIC, strlen(text), text, 0, false);
   if (ret) {
      printf("Cant connect to mosquitto server\n");
      exit(-1);
   }

   // 네트워크 동작이 끝나기 전에 모스키토 동작을 막기위해 잠깐의 딜레이가 필요함
   //sleep(1);

   mosquitto_disconnect(mosq);
   mosquitto_destroy(mosq);
   mosquitto_lib_cleanup();

   return 0;
}
```

● my_sub.c
```c
#include <signal.h>
#include <stdio.h>
#include <stdint.h>
#include <string.h>

#include <mosquitto.h>

#define mqtt_host "localhost"
#define mqtt_port 1883
#define MQTT_TOPIC "myTopic"

static int run = 1;

void handle_signal(int s)
{
   run = 0;
}

void connect_callback(struct mosquitto *mosq, void *obj, int result)
{
   printf("connect callback, rc=%d\n", result);
}

void message_callback(struct mosquitto *mosq, void *obj, const struct mosquitto_message *message)
{
   bool match = 0;
   /*printf("got message '%.*s' for topic '%s'\n", message->payloadlen, (char*) message->payload, message->topic);*/
	printf("receive message(%s) : %s",message->topic, message->payload);
   //mosquitto_topic_matches_sub("/devices/wb-adc/controls/+", message->topic, &match);
   if (match) {
      printf("got message for ADC topic\n");
   }

}

int main(int argc, char *argv[])
{
   uint8_t reconnect = true;
   //char clientid[24];//id를 사용하는 경우
   struct mosquitto *mosq;
   int rc = 0;

   signal(SIGINT, handle_signal);
   signal(SIGTERM, handle_signal);

   mosquitto_lib_init();
   
   //메모리 초기화
   //memset(clientid, 0, 24);//맨 앞부터 0을 24개 삽입 (초기화)
   //snprintf(clientid, 23, "mysql_log_%d", getpid());//23길이의 clientid에 pid를 가진 문자열 삽입 
   // mosq = mosquitto_new(clientid, true, 0);//mosquitto 구조체 생성 <-
   mosq = mosquitto_new(NULL, true, 0);//mosquitto 구조체 생성

   if(mosq){
      mosquitto_connect_callback_set(mosq, connect_callback);
      mosquitto_message_callback_set(mosq, message_callback);

       rc = mosquitto_connect(mosq, mqtt_host, mqtt_port, 60);//mosqutiio 서버와 연결

      mosquitto_subscribe(mosq, NULL, MQTT_TOPIC, 0);//subscribe

      while(run){
         rc = mosquitto_loop(mosq, -1, 1);
         if(run && rc){
            printf("connection error!\n");
            sleep(10);
            mosquitto_reconnect(mosq);
         }
      }
      mosquitto_destroy(mosq);
   }

   mosquitto_lib_cleanup();

   return rc;
```

컴파일을 하다가 보면 아래와 같은 오류가 발생할 수 있다.

![/img/Ch](/img/MQTT/pubsub-compile-error.png){:width="90%"}{:.center}

왜냐하면 mosquitto library를 사용하지 않아 관련된 파일들을 찾을 수 없기 때문이다.

그렇기 때문에 컴파일 시에 -lmosquitto를 붙여 컴파일을 해야 mosquitto library를 이용하여 컴파일 할 수 있다.
```bash
gcc -o my_pub my_pub.c -lmosquitto
```

