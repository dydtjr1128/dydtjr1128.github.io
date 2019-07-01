---
layout: post
title:  "이미지 압축방식 이해하기(jpeg,jpg,png,svg)"
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

이미지 압축 방법에는 크게 손실압축(Lossy compression)과 비손실 압축(Lossless compression) 방법이 있다. 각각에 방법에는 용도에 따라, 속도 측면에 따라 장단점이 존재한다. 예를 들어 동영상의 경우 사람이 듣지못하는 부분의 소리 등을 버리고, 용량을 줄이기위해 화질을 포기하는 예로서 유튜브나 동영상 스트리밍, 오디오 스트리밍이다.
그러나 반대로 비손실 압축에는 각 프레임마다 변경된 부분이 크지않다는 점을 이용한 압축방식이 대다수로, 다음과 같은 형태가 존재한다.

- MPEG-1 Part.2: H.261
- MPEG-2 Part.2: H.262
- MPEG-4 Part.2: H.263
- MPEG-4 Part.10: H.264 (AVC)
- MPEG-H Part.2: H.265 (HEVC)
이처럼 손실 비손실에서도 다양한 압축 방식이 존재한다.
이미지에서의 압축방식은 어떨까?

### 2. JPG, JPEG(Joint Photographic Experts Group)

사실 jpg와 jpeg는 같은 의미이다.  
jpg는 3글자, jpeg는 4글자인데 도스(DOS)에서는 확장자를 4자리 이상 지정할 수 없었기 때문에 jpeg라는 글자를 jpg로 줄여 사용하게 되었다.
이러한 jpg는 손실 압축방법의 대표적인 예이다.  
jpg는 데이터가 손실되지만 용량이 작아 웹에서 널리 쓰인다.
하지만 JPG는 RGB색상 공간을 사용하기때문에 투명도(Apaque)를 사용할 수 없다.

### PNG(Portable Network Graphics)

손실 압축의 대표적인 포맷이 jpg라면 비손실 압축 방법의 대표적인 예는 png 가있다.  
무손실 압축으로 이미지 디테일 손실이 전혀없고 고품질 이미지를 생성하지만 파일 크기는 상대적으로 다른 포맷보다 커진다.

PNG 는 트루 컬러(8비트)를 지원하기 때문에 R,G,B 각각 8비트(1바이트)씩 할당하게 된다.
이러한 RGB를 배합해 1픽셀을 갖게된다.
즉, R(2^8) * G(2^8) * B(2^8) = 2^24(16,777,216)개의 색을 지원한다.

PNG에서는 이러한 개념을 바탕으로 PNG-8(256색)과 PNG-24(16,777,216색), PNG-32(16,777,216색)로 나뉘는데
PNG-8에서는 256개의 칸을가진 색 팔레트를 이용한 것으로 256색까지만 표현이 가능하다.
png-32 = 2의 24승 대략 1670만 컬러 (트루컬러) + alpha(8bit)가 할당이 된다.

> 이러한 비손실의 특성 때문에 PNG 파일은 배경이 투명해 없을 수 있지만 JPG는 배경이 투명 할 수 없다.


### Appendix

그밖에 `WoW.js`, `Headroom.js` 등의 라이브러리를 이용하여 애니메이션 효과를 줄 수 있다.

### References

<pre>
<a href="https://www.w3schools.com/cssref/pr_scroll-behavior.asp">https://www.w3schools.com/cssref/pr_scroll-behavior.asp</a>
<a href="https://api.jquery.com/animate/">https://api.jquery.com/animate/</a>
</pre>
