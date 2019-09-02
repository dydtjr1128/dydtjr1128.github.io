---
layout: post
title:  "C++ Uniform initialization(유니폼 초기화)"
subtitle: "C++ Uniform initialization"
date: 2019-09-02 11:53:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-09-02 11:53:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

유니폼 초기화(Uniform initialization)는 `{}`를 이용하기 때문에 Brace initialization으로도 불린다.
유니폼 초기화는 C++11에 도입된 `initializer_list`를 이용해서 모든 객체 타입에 대해서 리스트형 초기화(list initialization)를 할 수 있게 도와준다.

### Uniform initialization

```cpp
class Widget
{
public:
    Widget(int i, bool b);
};
int main() {
  Widget w{10, 5.0}; //error
  Widget w2(10, 5.0); //ok
  return 0;
}
```

`유니폼 초기화(uniform initialization)`는 기본적으로 형 변환을 제한하는 특성이 있다.

위의 코드에서 w라는 객체를 유니폼 초기화를 이용한다면 축소변환(narrowing conversion)이 불가능 하기 때문에 오류가 발생한다.  
그와 반대로 w2는 bool 형태로 축소변환(narrowing conversion)으로 대입이 가능하다.

### initializer_list

`initializer_list` 는 `{}` 를 이용해서 생성자를 호출할 때, 인자로 받는 생성자가 존재한다면 인자가 전달된다.

```cpp
#include <iostream>

class Widget
{
public:
  Widget(int i, bool b);
  Widget(int i, double d);

  //bool을 원소로 하는 initializer_list 인자로 받음
  Widget(std::initializer_list<bool> b) {
    std::cout << "initializer_list" << std::endl;
  }
};
int main() {
  //Widget w{ 10, 5.0 }; //error
  Widget w{ true }; //ok
  return 0;
}
```

`uniform initialization`은 생성자들 중에 `std::initializer_list`의 형태의 인자를 가진 생성자가 존재한다면 적절한 생성자가 있음에도 불구하고 모두 무시하려고 한다.  
그렇기 때문에 w에 `{}`을 이용하여 10, 5.0을 대입 하더라도 이에 맞는 `std::initializer_list`를 인자로 가진 생성자가 존재 하지 않기 때문에 오류를 발생시킨다.
그러나 bool형과 관련이 없는 

```cpp
class Widget
{
public:
  Widget() {
    std::cout << "default" << std::endl;
  }

  Widget(std::initializer_list<int> il) {
    std::cout << "init" << std::endl;
  }
};

int main() {
Widget w1; //기본 생성자 호출
Widget w2(); //함수! 호출 x
Widget w3{}; //기본 생성자 호출
Widget w4({});//std::initializer_list 이용해 호출
Widget w5{ {} };//std::initializer_list 이용해 호출
Widget w6 = {}; // 기본 생성자 호출
Widget w7 = { {} }; //std::initializer_list 이용해 호출
}
```

이처럼 `std::initializer_list`의 존재 여부에 따라서도 호출되는 내용이 달라 질 수가 있다.

실제 호출 전까지는 타입이 결정되어 있지 않기 때문에, 함수 작성자가 객체마다 서로 다를 생성자의 규칙을 모두 커버할 수는 없다. 동일한 문제가 있는 표준 라이브러리의 함수 `std::make_unique`와 `std::make_shared`는 내부적으로 ()를 쓰고 그걸 문서화해두는 걸로 이 문제를 처리했다.
