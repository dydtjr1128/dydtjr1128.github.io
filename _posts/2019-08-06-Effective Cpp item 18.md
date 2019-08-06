---
layout: post
title:  "C++ 인터페이스 설계는 제대로 쓰기엔 쉽게, 엉터리로 쓰기엔 어렵게 하자."
subtitle: "Make interface design easy to use properly and difficult to use poorly."
date: 2019-08-06 19:57:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: EffectiveC++
tags : EffectiveC++
lastmod : 2019-08-06 19:57:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Make interface design easy to use properly and difficult to use poorly

C++을 개발하면서 크로미움과 같은 큰 프로젝트 뿐만아니라 개인이 만드는 작은 프로젝트까지 모든 분야에서는 쉽게 볼 수 있는것이 인터페이스이다.
함수도 인터페이스고, 클래스, 템플릿 또한 인터페이스이다.

이처럼 쉽게 찾아 볼 수 있는 인터페이스는 객체 지향 관점에서 똑바로 사용하는것이 중요하다. 잘못 코드를 작성하면 컴파일 되지 않아야 하고, 코드를 잘 작성하면 컴파일 되는것이 정상이다.

즉, '사용자가 제대로 쓰기 쉽지만 엉터리로 쓰긴 어려운 인터페이스' 개발하려면 실수 할 만한 종류를 잘 알고 있어야 한다.

다음과 같은 코드가 존재 한다고 하자.

```cpp
class Date {
public:
   Date(int month, int day, int year);
};
```

위의 코드는 정상적인 코드이다. 그러나 매개변수가 잘못 전달 될 수 있다는 점을 유의해야 한다.

```cpp
int main(){
   Date d(28, 11, 1994); //1994년 28월 11일이 되어 버린다.
   Date d2(2, 41, 1994); //1994년 2월 41일이 되어 버린다.
}
```

이처럼 손쉽게 사용자는 실수를 범할 수 있다는 점을 유의하고 이를 막는 `랩퍼(Wrapper)` 클래스를 구현해 주는것이 좋다.

```cpp
class Day {
public:
   explicit Day(int d) : val(d) {}
   int val;
};
class Month {
public:
   explicit Month(int m) : val(m) {}
   int val;
};
class Day {
public:
   explicit Day(int y) : val(y) {}
   int val;
};

class Date {
public:
   Date(const Month& m, const Day& d, const Year& y);
}
```

위의 코드처럼 구현되어 있다면 사용자는 실수할 일이 줄어들게 된다.

```cpp
int main(){
   Date(28, 11, 1994); // error! type error!
   Date(Day(28), Month(11), Year(1994)); // error! type error!
   Date(Month(11), Day(28), Year(1994)); // ok!
}
```

여기에 더해, month, day 등에는 유요한 값이 정해져 있으므로 enum과 같은 문법을 사용해 지정할 수도 있지만, `Jen()`, `Feb()` 등의 함수를 구현하는 것이 좋은 방법이다.


