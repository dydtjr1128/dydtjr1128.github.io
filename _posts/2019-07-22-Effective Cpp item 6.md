---
layout: post
title:  "C++ 컴파일러가 만든 함수가 필요 없는 경우 이를 제거하자"
subtitle: "If you don't need a function created by the compiler, Remove it."
date: 2019-07-22 19:55:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: EffectiveC++
tags : EffectiveC++
lastmod : 2019-07-22 19:55:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### If you don't need a function created by the compiler, Remove it.

```cpp
#include <iostream>

class Home{
public:
   Home() {};
private:
   Home(const Home&);
   Home& operator=(const Home&);
};

class Uncopyable {
protected:
   Uncopyable() {};
private:
   Uncopyable(const Uncopyable&);
   Uncopyable& operator=(const Uncopyable&);
};

class UncopyableHome : private Uncopyable {
public:
   //inherit default constructor
   //copy constructor& copy operator is not created.
private:

};

int main() {
   Home h;
   Home h2;
   //Home h3(h);//error!

   UncopyableHome uh;
   UncopyableHome uh2;
   //UncopyableHome uh3(uh);//error!
   //UncopyableHome uh3=uh;//error!
}
```

위의 코드처럼 만약 컴파일러가 만든 함수인 복사생성자 및 대입연산자가 필요없는경우 private으로 선언함으로써 다른 객체가 이를 복사, 대입 하지 못하도록 만들 수 있다.

`UncopyableHome`은 `Uncopyable`을 상속받는데, 이는 기본 생성자는 상속되지만 private으로 선언된 복사 생성자와 대입 연산자는 상속되지 않아 이를 사용 할 수 없게 된다.

이러한 코드 작성으로 복사와 대입을 막을 수 있다. 위의 코드는 차후 모던 C++에서 사용되는 delete 키워드로 간단하게 선언 가능하다.
