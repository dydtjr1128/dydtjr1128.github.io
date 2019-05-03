---
layout: post
title:  "크로미움(Chromium) 빌드하기"
subtitle: "Build Chromium"
date: 2019-05-03 13:33:30 +0900
background: '/img/Chromium/Chromium_bg.png'
comments: true
categories: Spring
tags : Spring
lastmod :   2019-05-03 13:33:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
크로미움(Chromium) 빌드하기
</div>


## 크로미움(Chromium)이란?

![Chromium logo](/img/Chromium/Chromium_logo.png){:width="25%"}{:.center}

크로미움은 2008년 9월 구글이 시작한 오픈 소스 웹 브라우저 프로젝트이다. 그로
많이 사용하는 구글 크롬은 크로미움을 기반으로 만들어진 브라우저이다.
크로미움은 크로미움 소스 코드에서 컴파일 된 브라우저를 뜻하고 크롬은 크로미움 소스코드에 어도비 플래시, 자동 업데이트 등 다양한 기능을 추가해 컴파일 한 브라우저이다.  
그밖에도 크로미움 소스코드는 엣지브라우저, 삼성 인터넷 브라우저, 오페라 브라우저에도 사용이 되었다.

## 크로미움(Chromium) 빌드하기

<hr>

### 목차

<a href="#no0">0. 환경설정</a><br>
<a href="#no1">1. </a><br>


<h3 id="no0">0. 환경설정</h3>

#### 필자의 노트북 환경

- OS : Windows 10 64bit
- CPU : i7-7200U
- RAM : 8GB
- SSD : 256GB


#### 권장 환경

- 64bit 운영체제
- 최소 8GB RAM, 16GB 이상의 RAM 권장
- NTFS포맷의 100GB의 SSD 여유공간, FAT32 는 동작X(GIT 파일이 4GB보다 크므로)
- 비쥬얼스튜디오 최신버전
- 윈도우7 이상(10 추천)

#### Visual studio
비쥬얼스튜디오는 2017 또는 2019 버전을 사용해야한다.

![Visual studio setting](/img/Chromium/Visual studio setting.png){:width="100%"}{:.center}


### References

<pre>
   <a href="https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md">https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md</a>
</pre>