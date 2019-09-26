---
layout: post
title:  "Polling & Long Polling & Streaming"
subtitle: "Polling & Long Polling & Streaming"
date: 2019-09-23 11:55:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: ETC
tags : ETC
lastmod : 2019-09-23 11:55:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

웹에서는 일반적으로 클라이언트에서 서버로 요청을 보내지만, 서버에서 클라이언트에게 데이터를 전달 해 주어야 하는 상황이 발생한다. 이러한 상황에서 사용되는 기술에 대해서 알아보려고 한다. 자바스크립트에서 사용되는 Ajax 등이 대표적인 예 이다.

### Polling

![Polling](/img/Etc/polling/polling.png){:width="50%"}{:.center}

`Polling`은 가장 기본적으로 사용되는 기법으로, 클라이언트가 서버에 주기적으로 request를 보내는 기법이다. 주기적으로 클라이언트가 자기가 처리해야할 이벤트가 있는지 없는지(혹은 받아올 데이터가 있는지 없는지)를 체크하는 것이다.

서버에 클라이언트가 보낸 폴링 요청이 들어올때 마다 이를 처리해야 하고, 다음 폴링이 이루어지기 전까지는 어떤 이벤트가 오는지를 모르기 때문에, 실시간 이벤트 처리가 불가능하다.

### Long polling

![Polling](/img/Etc/polling/long_polling.png){:width="50%"}{:.center}

`Long Polling`은 Polling과 비슷한 기법이나 실시간 처리가 가능하다. 클라이언트가 Request를 보내고 서버에서 클라이언트에게 response를 바로 보내는것이 아니라 이벤트가 발생하거나 보낼 데이터가 생길 때 response에 실어 보내고 Connection을 종료한다.

`Polling`과 비슷한 구조이지만 response가 오는 시간이 길기 때문에 `Long Polling`이라고 부른다.

`Long polling`은 서버에 클라이언트들이 response 수신을 위해 연결되어 있는 형태이기 때문에 서버의 가용 연결 수에 따라 가능 여부가 바뀐다.

Tomcat의 경우 쓰레드 풀을 사용하는데, 그 풀의 쓰레드 가용 갯수가 100개인 경우에는 하나의 Tomcat당 100개의 클라이언트가 Long Polling 연결이 가능하게 된다.

이러한 이유로 많은 커넥션이 유지 되기 때문에 실시간 채팅 등 많은 송수신이 필요한경우에는 비적합하며 연결이 많지 않은 경우에 적합하다.

### Streaming

![Polling](/img/Etc/polling/streaming.png){:width="50%"}{:.center}

`Streaming`은 일반적인 TCP Connection과 비슷한데, 클라이언트와 서버간에 연결 후 연결된 통로로 서버가 이벤트 및 데이터를 보내는 방식이다.
`Polling`과 `Long Polling`이 response를 받을때마다 연결을 끊고 다시 request를 보내면서 재연결을 하는 방식과 달리 Streaming 방식은 한번 연결되면  지속적으로 데이터를 수신하므로 재연결에 대한 부하가 없다는 장점이 있다.

### Reference 

<pre>
<a href="https://bcho.tistory.com/896">https://bcho.tistory.com/896</a>
</pre>
