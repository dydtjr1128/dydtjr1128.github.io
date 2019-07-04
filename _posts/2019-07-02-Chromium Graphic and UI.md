---
layout: post
title:  "크로미움 Graphic & UI Architecture 이해하기"
subtitle: "Chromium Graphic & UI Architecture"
date: 2019-07-02 20:55:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Chromium
tags : Chromium
lastmod : 2019-07-04 21:00:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### 1. Chromium Graphic Architecture

![Chromium infrastructure](/img/Chromium/graphic/chromium_graphics_infrastructure.png){:width="60%"}{:.center}
위의 그림은 크로미움의 Graphic 구조이다.
여기서 각각 담당하는 기능이있다.

- Skia : OpenGL 기반 오픈소스 2D graphics library
- Aura : Window manager(창 관리, 크로스플랫폼)
- Blink : Webkit을 fork 떠서 새롭게 만든 엔진으로 웹 렌더링 엔진
- Compositor : 전체적인 액션을 관리하고 재 계산등을 담당한다.

![View_aura](/img/Chromium/graphic/view_aura.png){:width="70%"}{:.center}

여기서 aura는 크로스 플랫폼을 지원하기위해 위와 같은 구조를 가지고 있다.
이러한 구조 덕분에 다음과 같은 이벤트 플로우를 지원한다.
![Aura_eventflow](/img/Chromium/graphic/aura_eventflow.png){:width="30%"}{:.center}

### 2. Chromium View hierarchy

![View_hierarchy](/img/Chromium/graphic/view_hierarchy.jpg){:width="100%"}{:.center}

크로미움에서는 위와 같이 View 사이 의존성이 존재한다.

Widget은 창에 해당하는 객체로서 Cocoa의 NSWindow(Mac용), Win32 HWND역할을 한다. Widget은 운영체제에서 날라온 이벤트를 캡쳐 하는데 activation, 최소화, 최대화 등 과 같이 창 본연의 기능만 받고 나머지는 view tree를 타고 하위 뷰에서 처리한다.

![Widget_hierarchy](/img/Chromium/graphic/widget_hierarchy.png){:width="70%"}{:.center}

View는 크게 Widget으로 볼수 있으며 그 내부에 RootView 그 내부에 NonClientView 그 내부에 NonClientFrameView와 ClientView로 나눌 수 있다.

![clientview_nonclientview](/img/Chromium/graphic/clientview_nonclientview.png){:width="50%"}{:.center}

여기서 ClientView 와 NonClientView의 차이는 위와 같은데
Non Client View 부분은 OS에서 제공, 관리되는 영역이고 OS 자체의 기본 UI부분을 뜻한다.
그러나 커스터마이징이 가능하다.
ClientView는 OS의 API를 이용해 작성하는 부분으로 개발자가 자유롭게 디자인 가능하다는 점에서 둘은 다르다.

### References

<pre>
<a href="https://www.chromium.org/developers/design-documents/aura-desktop-window-manager">https://www.chromium.org/developers/design-documents/aura-desktop-window-manager</a>
<a href="https://www.chromium.org/developers/design-documents/compositor-thread-architecture">https://www.chromium.org/developers/design-documents/compositor-thread-architecture</a>
<a href="https://www.chromium.org/developers/design-documents/aura/aura-overview">https://www.chromium.org/developers/design-documents/aura/aura-overview</a>
