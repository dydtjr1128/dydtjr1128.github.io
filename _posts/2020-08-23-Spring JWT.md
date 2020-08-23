---
layout: post
title:  "Spring JWT(Json Web Token) 이해하기"
subtitle: "Understanding Spring JWT(Json Web Token)"
date: 2020-08-23 18:23:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Windows
tags : Windows
lastmod : 2020-08-23 18:23:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### JWT(Json Web Token)

`JWT`는 기존의 서버와 연결된 클라이언트들의 세션을 관리하지 않기 위해 만들어진 기술입니다.

세션은 서버에서 클라이언트들의 정보를 관리하고, 상황에 맞게 세션을 재연결, 연결 해제 하는 등에 대한 부분은 서버에 큰 부하를 줄 수 있습니다. 그에 비해 JWT 토큰은 클라이언트에서 각 클라이언트의 정보를 담고있으며, 이를 매 Request에 같이 실어 보내 서버에서 이 토큰값을 검증합니다.

JWT 토큰은 JSON 기반으로 구성되어 있어 가볍고 사용하기 쉬우며 정보를 안정성 있게 전달 할 수 있다는 장점이 있습니다. 이러한 장점 덕분에 다양한 언어들(C, C++, JAVA, JS, GO, Swift)에서 사용됩니다.

