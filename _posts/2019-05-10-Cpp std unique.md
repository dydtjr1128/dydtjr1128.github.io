---
layout: post
title:  "스마트 포인터(Smart Pointer) 란?"
subtitle: "What is Smart Pointer?"
date: 2019-05-10 18:17:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-05-10 18:17:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Smart pointer
</div>

## Smart pointer(C++11)

스마트 포인터에는 크게 다음 3가지의 포인터가 존재한다.

- unique_ptr
- shared_ptr
- weak_ptr

C++03의 `auto_ptr`은 `unique_ptr`을 만들려던 시도의 실패작이므로 사용해선 안된다.

### 1. unique_ptr

![unique_ptr](/img/Cpp/unique_ptr.png){:width="50%"}{:.center}

`unique_ptr`는 모던 C++에 속한 스마트 포인터 3가지 중 하나로서 `std` 네임스페이스에 속해있고 `memory` 헤더파일에 속한 표준 포인터이다.
다수의 인스턴스가 하나의 객체를 가르키는것은 프로그램 구조상 복잡해 지기 때문에 하나의 소유자만을 허용하기 위한 용도이다.

#### unique_ptr 사용법

```cpp
#include <memory>

```

### 2.shared_ptr

### 3.weak_ptr


### References

<pre>
<a href="https://docs.microsoft.com/ko-kr/cpp/cpp/how-to-create-and-use-unique-ptr-instances?view=vs-2019">https://docs.microsoft.com/ko-kr/cpp/cpp/how-to-create-and-use-unique-ptr-instances?view=vs-2019</a>
</pre>
