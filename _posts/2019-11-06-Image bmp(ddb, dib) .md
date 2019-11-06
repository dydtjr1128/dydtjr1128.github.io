---
layout: post
title:  "비트맵에 대한 이해와 비트맵의 종류(DDB, DIB)"
subtitle: "Types of bitmaps (DDB, DIB)"
date: 2019-11-06 14:31:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Java
tags : Java
lastmod :   2019-11-06 14:31:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### 1. Intro

비트맵(Bitmap)은 이미지의 기본적인 포맷 형태로 래스터 그래픽스(점 방식)라고 한다. 각 픽셀 별로 정보를 저장하고 있어 용량이 굉장히 크다는 문제점이 있어 JPEG, PNG등의 이미지 압축 포맷들이 개발되어있다. 쉽게 이야기 하자면 1920x1080 해상도의 비트맵 이미지가 존재한다면 1920X1080=2,073,600개의 픽셀이 존재한다는 것이고, 각 픽셀별로 RED, GREEN, BLUE 색 정보를 1바이트씩 총 3바이트(R,G,B)를 할당한다면 2,073,600*3 = 6,075KB 즉 6MB에 해당하는 거대한 용량을 가진 이미지가 되는 것이다.

![Bitmap image sample](/img/Etc/bmp/bmp_sample.bmp){:width="40%"}{:.center}

위와 같은 R,G,B 컬러로 채워진 비트맵 이미지가 존재할때, BMP 파일의 구조는 다음과 같다.

![Bitmap structure](/img/Etc/bmp/bmp_structure.png){:width="100%"}{:.center}