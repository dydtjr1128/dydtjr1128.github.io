---
layout: post
title:  "스프링부트 + 리엑트 프로젝트 AWS EC2에 배포하기"
subtitle: "Release Spring boot&React project to AWS EC2"
date: 2019-05-26 19:20:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Spring
tags : Spring
lastmod :   2019-05-30 19:20:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

## Lixux에 올리기

- 개발 환경
  - AWS EC2 Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type
  - EC2 Free tier
- 이전 포스트인 Spring boot+React 프로젝트 배포를 기준
- SSH 접속

## 자바 버전 업데이트 및 구버전 제거

```SHELL
sudo yum install -y java-1.8.0-openjdk-devel.x86_64
sudo /usr/sbin/alternatives --config java
sudo yum remove java-1.7.0-openjdk
java -version
```

![Java version change](/img/EC2/java_change.png){:width="100%"}{:.center}
버전 변경 완료

## Git 설치

```shell
sudo yum install git
git --version
```

그 후, 본인의 레포지토리 클론
![Git repository clone](/img/EC2/git_clone.png){:width="100%"}{:.center}

```shell
git clone https://github.com/프로젝트주소.git
```

## Kafka 설치

```shell
wget https://www-us.apache.org/dist/kafka/2.2.0/kafka_2.12-2.2.0.tgz -O kafka.tgz
tar -xzvf kafka.tgz
cd kafka_2.12-2.2.0
nohup ./bin/zookeeper-server-start.sh config/zookeeper.properties &
nohup ./bin/kafka-server-start.sh config/server.properties &
```

여기서 `nohup`명령어는 표준 출력을 다른데로 돌려준는 일을 해준다.
간혹 메모리가 부족하거나 프리티어같은 적은 용량의 메모리를 사용하는경우 아래와 같은 명령어를 사용해야 한다.

```shell
export KAFKA_HEAP_OPTS="-Xmx256m -Xms256M"
```

## Spring boot mvn build & Release

```shell
cd 본인 git clone 폴더 경로
```

```shell
sudo mvn package spring-boot:repackage -Dmaven.test.skip=true
```

프로젝트 dependency등에 따라 시간이 오래 걸릴 수도 있다.
![Maven packaging](/img/EC2/mvn_package_success.png){:width="100%"}{:.center}

같은 폴더 target에 들어가면 아래와 같이 패키징이 완료 된 .jar파일이 존재한다. 
실행 명령어를 입력한다.

![Maven build](/img/EC2/jar.png){:width="100%"}{:.center}

```shell
 nohup java -jar {생성된 jar 파일 이름}
```

## React Release

### Node js 설치

```shell
sudo yum install nodejs
```

### 오류 발생시 설치 방법

```shell
sudo yum makecache
sudo yum install gcc-c++ make
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum install -y nodejs
```

만약 설치가 되지 않는다면 아래 처럼 설치를 진행한다.

그 후 clone 받은 폴더로 들어가 실행한다.

### Run

```shell
sudo npm install
sudo npm start
```

만약 install 중 에러가 발생한다면 아래 명령어를 입력해 준다.

```shell
npm config set registry http://registry.npmjs.org/  
```

## SSH 종료 후 프로그램 실행 유지

```shell
disown -h
```

ssh 연결을 종료해도 프로그램을 돌려놓고 싶다면 위 명령어를 치면 된다.