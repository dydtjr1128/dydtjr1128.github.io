---
layout: post
title:  "C++ 클래스 메모리 주소"
subtitle: "C++ class memory address"
date: 2019-10-01 14:21:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-10-01 14:21:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

C++에서 클래스를 작성하고, 상속된 클래스를 구현할 때 메모리 구조는 어떻게 될 지 궁금하여 실제로 테스트를 해보고 만들어 보았다.

### C++ class memory address

아래와 같은 코드를 작성하고, 출력하면 어떻게 출력될까?

```cpp
#include <iostream>

class A {
public:
  int a;
protected:
  int b;
};

class B : public A {
public:
  int ba;
  void print() {
    std::cout << "&this : " << (int)this << std::endl;
    std::cout << "&a : " << (int)& a << std::endl;
    std::cout << "&b : " << (int)& b << std::endl;
    std::cout << "&ba : " << (int)& ba << std::endl;
    std::cout << "&bb : " << (int)& bb << std::endl;
  }
private:
  int bb;
};

int main()
{
  B* t = new B();
  t->print();
  return 0;
}
```

위와 같은 코드 구조에서 `B`라는 클래스는 `A` 클래스를 상속하도록 만들었다.
위의 코드를 작성하게 되면 다음과 같은 출력 결과를 보여준다.

```output
&this : 14113616
&a : 14113616
&b : 14113620
&ba : 14113624
&bb : 14113628
```

![C++ compile process](/img/Cpp/cpp_memory.png){:width="80%"}{:.center}

결국, 상속 받게 되면 부모의 생성자가 먼저 불리는것 과 같이 내부 변수들 또한 당연하게 부모의 내부 변수부터 생성되고, 그 후에 자식의 내부 변수가 생성된다.

그렇기 때문에 객체의 시작주소부터 `sizeof(int)`사이즈만큼 늘어나며 각 변수의 주소가 할당되는 것을 알 수가 있다.

