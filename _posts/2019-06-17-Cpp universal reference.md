---
layout: post
title:  "C++ Universal reference(&&)"
subtitle: "What is Universal reference(&&)?"
date: 2019-06-17 13:20:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-17 13:20:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Universal reference
</div>

### 1. Intro

Universal reference는 Effective c++을 쓰신걸로 유명한 Scott meyers라는 분이 붙인 이름이다.
우선 universal reference는 `&&`처럼 &를 2개붙쳐 표현한다

```cpp
void func(&&People p);
```

### References

<pre>
<a href="https://isocpp.org/blog/2012/11/universal-references-in-c11-scott-meyers">https://isocpp.org/blog/2012/11/universal-references-in-c11-scott-meyers</a>
</pre>
