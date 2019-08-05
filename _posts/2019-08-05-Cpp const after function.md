---
layout: post
title:  "C++ 함수 뒤에 const"
subtitle: "C++ const after function"
date: 2019-08-05 19:53:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-08-05 19:53:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Const after function

```cpp
class Number {
public:
   int GetNum() { return num; }
   bool IsNotZero() const {
      return num != 0;
   }
private:
   int num;
};
```

위의 함수가 존재한다고 할 때, `IsNotZero()`라는 함수 뒤의 const의 역할은 무엇일까?

바로 `이 함수 안에서는 어떤 변수도 바꿀 수 없음(mutable은 예외)`를 뜻한다.

함수가 클래스 멤버인 경우에만 const 키워드를 함수 뒤에 삽입 할 수 있으며 해당 함수가 속한 객체의 멤버 변수를 변경 할 수 없다는 뜻이다.

또한 const가 붙은 함수 내에서는 const가 붙은 다른 함수를 제외한 일반 함수는 호출하지 못한다.

```cpp
class Number {
public:
   int GetNum() { return num; }
   bool IsNotZero() const {
      int r = GetNum();// error! non-const function;
      SetZero()// ok! const function.
      return num != 0;
   }
   void SetZero() const {
      num = 0;
   }
private:
   int num;
};
```

요약하자면 const가 뒤에 붙은 함수에는 2가지 기능이 존재한다.

- 객체 내부 변수 변경 불가.
- const 함수만 호출 가능.

이러한 기능을 가지고 있어 `getter`나 `bool` 반환값에서 많이 사용되며 이로 인해 함수 내부의 변수 변경을 방지 할 수 있다.
