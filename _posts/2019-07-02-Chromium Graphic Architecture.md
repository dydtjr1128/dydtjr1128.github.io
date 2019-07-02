---
layout: post
title:  "크로미움 Graphic Architecture 이해하기"
subtitle: "Chromium Graphic Architecture"
date: 2019-07-02 20:55:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Chromium
tags : Chromium
lastmod : 2019-07-02 20:55:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### 1. Chromium Graphic Architecture

![Chromium infrastructure](/img/Chromium/graphic/Chrome_Graphics_Infrastructure.png){:width="60%"}{:.center}
위의 그림은 크로미움의 Graphic 구조이다.
여기서 각각 담당하는 기능이있다.

- Skia : OpenGL 기반 오픈소스 2D graphics library
- Aura : Window manager(창 관리, 크로스플랫폼)
- Blink : WebKit의 fork를 기반으로한 웹 렌더링 엔진

### References

<pre>
<a href="https://www.chromium.org/developers/design-documents/aura-desktop-window-manager">https://www.chromium.org/developers/design-documents/aura-desktop-window-manager</a>
<a href="https://www.i18next.com/overview/supported-frameworks">https://www.i18next.com/overview/supported-frameworks</a>
</pre>
