---
layout: post
title:  "Ubuntu에 Mosquitto(MQTT Broker) 3분 설치"
subtitle: "Install Mosquitto (MQTT Broker) on Ubuntu in 3 minutes"
date:   2018-01-07 17:26:30 +0900
background: '/img/posts/07.jpg'
comments: true
categories: MQTT
tags : MQTT
lastmod :   2019-04-08 16:00:15 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

## Ubuntu에서 Mosquitto(MQTT Broker) 설치하기  
<br>
![/img/Ch](/img/MQTT/mqtt-logo.png){:width="25%"}{:.center}
#### ※본 글은 Mosquitto1.4.14 버전 기준으로 작성되었습니다.

0. 환경 설정  
OS - Ubuntu 16.04.3-desktop-amd64  
Source - mosquitto-1.4.14

1. 사전 설치 라이브러리
```bash
sudo apt-get install openssl build-essential libc-ares-dev uuid-dev libssl-dev libcurl4-openssl-dev libmysqlclient-dev
```

2. Mosquitto 설치
```bash
cd ~ 
wget http://mosquitto.org/files/source/mosquitto-1.4.14.tar.gz
tar xvf mosquitto-1.4.14.tar.gz
cd mosquitto-1.4.14 
make 
sudo make install
```

3. Mosquitto 실행
```bash
sudo mosquitto
```

4. Test
```bash
mosquitto_sub -h 127.0.0.1 -t 'topic'
mosquitto_pub -h 127.0.0.1 -t 'topic' -m "Hello Mosquitto!"
```
```bash
#유저 pw, name 설정 한 경우
mosquitto_pub -t 'topic' -u username -P password -m 'message' 
mosquitto_sub -t 'topic' -u username -P password
```

### ※ Mosquitto Command
-c, --config-file  
Load configuration from a file. If not given, the default values as described in mosquitto.conf(5) are used.  
-d, --daemon  
Run mosquitto in the background as a daemon. All other behaviour remains the same.  
-p, --port  
Listen on the port specified instead of the default 1883. This acts in addition to the port setting in the config file. May be specified multiple times to open multiple sockets listening on different ports. This socket will be bound to all network interfaces.  
-v, --verbose  
Use verbose logging. This is equivalent to setting log_type to all in the configuration file. This overrides and logging options given in the configuration file.  

### ※ Mosquitto 서비스 종료 시키는 방법
```bash
sudo /etc/init.d/mosquitto stop
```

