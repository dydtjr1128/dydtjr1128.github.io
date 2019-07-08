---
layout: post
title:  "static_cast란?"
subtitle: "What is static_cast"
date: 2019-07-08 20:23:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-07-08 20:23:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
static_cast
</div>

### Intro

기본형태

- static_cast<new_type>(expression)  
- static_cast<바꾸려는타입>(대상)

### static_cast는 컴파일 타임에 형 변환을 해 주기 때문에 컴파일 시 타입에 대한 오류를 잡아 준다는 장점이 있다.

```cpp
double d = 12.34;
int tmp = static_cast<int>(d);

int arr[5] = {1, 2, 3, 4, 5};
int *ptr;
ptr = static_cast<int *>(arr);
```

### static_cast의 사용 이유?

```cpp
double a = 12.34;
int b = (int)a;
```

```cpp
double a = 12.34;
int b = static_cast<int>(a);
```

위의 c 스타일의 캐스팅 방법에서 c++만의 캐스팅을 사용함으로써 다양한 장점이 생긴다.

1. 컴파일단에서 타입 오류를 측정
2. 업캐스팅, 다운캐스팅을 제외한 포인터의 형 변환 불가(c는 가능)

### References

<pre>
<a href="https://blockdmask.tistory.com/236">https://blockdmask.tistory.com/236</a>
</pre>
