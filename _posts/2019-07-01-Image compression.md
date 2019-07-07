---
layout: post
title:  "이미지 압축방식 이해하기(bmp, jpeg, jpg, png, svg)"
subtitle: "Understanding about image compression"
date: 2019-07-01 10:40:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Image
tags : Image
lastmod : 2019-07-01 10:40:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Image compression
</div>

### 1. Intro

이미지 압축 방식을 이해하기 앞서 이해해야 할 몇가지가 있다.

1. Lossy vs Lossless
2. Indexed color vs Direct color

#### 1.1 Lossy vs Lossless

압축 방법에는 크게 손실압축(Lossy compression)과 비손실 압축(Lossless compression) 방법이 있다. 각각에 방법에는 용도에 따라, 속도 측면에 따라 장단점이 존재한다. 예를 들어 동영상의 경우 사람이 듣지못하는 부분의 소리 등을 버리고, 용량을 줄이기위해 화질을 포기하는 예로서 유튜브나 동영상 스트리밍, 오디오 스트리밍이다.
그러나 반대로 비손실 압축에는 각 프레임마다 변경된 부분이 크지않다는 점을 이용한 압축방식이 대다수로, 동영상 압축 방식을 예로 들어 다음과 같은 형태가 존재한다.

무손실 압축 코덱

- HuffYUV
- Lagarith
- MSU
- MagicYUV

손실 압축 코덱

- MPEG-1 Part.2: H.261
- MPEG-2 Part.2: H.262
- MPEG-4 Part.2: H.263
- MPEG-4 Part.10: H.264 (AVC)
- MPEG-H Part.2: H.265 (HEVC)

이처럼 손실 비손실에서도 다양한 압축 방식이 존재한다.

#### 1.2 Indexed color vs Direct color

![Indexed color](/img/Etc/image_compression/indexed_color.png){:width="60%"}{:.center}

Indexed Color는 제작자에 의해 Color Map이라는 곳에 제한된 수의 색상(즉 256가지의 색상)을 가진 palette로만 저장할 수 있는 속성이다.

그에 비해 Direct Color는 제작자가 직접 선택하지 않은 수천가지의 컬러를 저장할 수 있는 속성이기 때문에 다양한 색을 표현할 수 있는 반면 그 다양한 색상의 정보를 저장해야 하기 때문에 Indexed Color에 비해 많은 용량이 필요 하다.

### 2. BMP(BitMaP) - Lossless / Indexed and Direct

BMP 파일 포맷은 비트맵 디지털 그림을 저장하는 데 쓰이는 그림 파일 포맷이다
BMP는 말그대로 Bit 들의 Map이고, 오래된 이미지 포맷이다.
압축을 전혀 하지 않기 때문에 BMP로 저장하면 매우 큰 사이즈로 저장이 된다.
BMP는 Indexed color, Direct color 속성을 가지고 있다.
그러나 파일 사이즈가 불필요하게 커서 이 포맷은 많이 사용되지 않지만 디코딩 할 것이 별로 없어 속도가 빠르다는 장점이 있다. 그렇기 때문에 윈도우 프로그래밍 등 운영체제 내부에서 널리 쓰있다. BMP파일의 헤더는 DDB, DIB 두 종류로 나뉘는데 이 부분은 차후에 포스트 하려고 한다.
좋은점: 실제 실무에서도 BMP를 한번도 사용해 본적이 없는데, 시니어 개발자님이 조언해 주신 이야기로는 디코딩할게 별로 없어서 속도가 매우 빠르고, 여러가지 masking 등의 작업에서 편하고 해서, 예전 윈도우 프로그래밍, 모바일 초기 프로그래밍에서는 bmp를 많이 썼다고 합니다. 웹에서는 bmp는 잘 사용되지 않지만, 내부적으로는 사용되고 있다고 합니다.

기본적으로 1~24비트의 색을 표현할 수 있다. 1비트는 2가지 색이며 24비트는 16777216가지 색이다. 알파 채널을 포함한 32비트 포맷이 윈도 XP에서 발표되었다. 일반적으로 데이터를 압축하지 않고 사용되지만, RLE 압축 방식도 지원한다.

### 3. JPG, JPEG(Joint Photographic Experts Group) - Lossy / Direct

사실 jpg와 jpeg는 같은 의미이다.  
jpg는 3글자, jpeg는 4글자인데 도스(DOS)에서는 확장자를 4자리 이상 지정할 수 없었기 때문에 jpeg라는 글자를 jpg로 줄여 사용하게 되었다.
이러한 jpg는 손실 압축방법의 대표적인 예이다.  
jpg는 데이터가 손실되지만 용량이 작아 웹에서 널리 쓰인다.
하지만 JPG는 RGB색상 공간을 사용하기때문에 투명도(Apaque)를 사용할 수 없다.

### 4. PNG(Portable Network Graphics) - Lossless / Indexed(PNG8), Lossless / Direct(PNG-24)

손실 압축의 대표적인 포맷이 jpg라면 비손실 압축 방법의 대표적인 예는 png 가있다.  
무손실 압축으로 이미지 디테일 손실이 전혀없고 고품질 이미지를 생성하지만 파일 크기는 상대적으로 다른 포맷보다 커진다.

PNG 는 트루 컬러(8비트)를 지원하기 때문에 R,G,B 각각 8비트(1바이트)씩 할당하게 된다.
이러한 RGB를 배합해 1픽셀을 갖게된다.
즉, R(2^8) * G(2^8) * B(2^8) = 2^24(16,777,216)개의 색을 지원한다.

PNG에서는 이러한 개념을 바탕으로 PNG-8(256색)과 PNG-24(16,777,216색), PNG-32(16,777,216색)로 나뉘는데
PNG-8에서는 256개의 칸을가진 색 팔레트를 이용한 것으로 256색까지만 표현이 가능하다.
png-32 = 2의 24승 대략 1670만 컬러 (트루컬러) + alpha(8bit)가 할당이 된다.

> 이러한 비손실의 특성 때문에 PNG 파일은 배경이 투명해 없을 수 있지만 JPG는 배경이 투명 할 수 없다.

### SVG(Scalable Vector Graphics) -  Lossless / Vector

![Chromium infrastructure](/img/Etc/image_compression/svg_png.png){:width="70%"}{:.center}

2차원 벡터 그래픽을 표현하기 위한 XML 기반의 파일 형식으로, 1999년 W3C(World Wide Web Consortium)의 주도하에 개발된 오픈 표준의 벡터 그래픽 파일 형식이다. SVG 형식의 이미지와 그 작동은 XML 텍스트 파일들로 정의 되어 검색화·목록화·스크립트화가 가능하며 필요하다면 압축도 가능하다.

SVG 형식의 파일은 어도비 일러스트레이터와 같은 벡터 드로잉 프로그램을 사용하여 편집이 가능하다. 물론 XML 형식으로 되어 있으므로 메모장과 같은 문서 편집기로도 편집이 가능하다.

현재 마이크로소프트의 인터넷 익스플로러 8 및 이전 버전을 제외한 대부분의 주요 웹 브라우저들은 SVG를 지원한다. 인터넷 익스플로러 8 및 이전 버전에서는 SVG 파일을 보기 위해 별도의 플러그인을 수동으로 설치하여야 하며, 그렇지 않은 경우에는 웹 페이지 제작자가 구글 코드에서 개발중인 자바스크립트 라이브러리, SVG Web 을 웹 페이지 코드에 포함시켜야 한다.

Vector 파일 포맷은 실제로 픽셀 대신에 라인과 곡선들로 이루어져 있기 때문에 이미지를 확대, 축소 하더라도 깨짐 현상이 없다. 그렇기 때문에 모든 스크린 화면에서 선명한 이미지를 보여 줄 필요가 있는 로고 등에 적절한 포맷이다.

이러한 SVG는 사이즈도 작은 편에 속하는데, 모양이 복잡할 수록 벡터 계산이 많이 필요해 계산이 많이 필요 해 질 수 있다.

### Summary

![Image difference](/img/Etc/image_compression/logo.jpeg){:width="70%"}{:.center}

![Image difference](/img/Etc/image_compression/image_difference.png){:width="70%"}{:.center}

### References

<pre>
<a href="https://ko.wikipedia.org/wiki/%EC%86%90%EC%8B%A4_%EC%95%95%EC%B6%95">https://ko.wikipedia.org/wiki/%EC%86%90%EC%8B%A4_%EC%95%95%EC%B6%95</a>
<a href="https://ko.wikipedia.org/wiki/BMP_%ED%8C%8C%EC%9D%BC_%ED%8F%AC%EB%A7%B7">https://ko.wikipedia.org/wiki/BMP_%ED%8C%8C%EC%9D%BC_%ED%8F%AC%EB%A7%B7</a>
<a href="https://en.wikipedia.org/wiki/Portable_Network_Graphics#Pixel_format">https://en.wikipedia.org/wiki/Portable_Network_Graphics#Pixel_format</a>
<a href="https://medium.com/@soeunlee/web%EC%97%90%EC%84%9C-png-gif-jpeg-svg-%EC%A4%91-%EC%96%B4%EB%96%A4-%EA%B2%83%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%A9%B4-%EC%A2%8B%EC%9D%84%EA%B9%8C%EC%9A%94-6937300e776e">https://medium.com/@soeunlee/web%EC%97%90%EC%84%9C-png-gif-jpeg-svg-%EC%A4%91-%EC%96%B4%EB%96%A4-%EA%B2%83%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%A9%B4-%EC%A2%8B%EC%9D%84%EA%B9%8C%EC%9A%94-6937300e776e</a>
</pre>
