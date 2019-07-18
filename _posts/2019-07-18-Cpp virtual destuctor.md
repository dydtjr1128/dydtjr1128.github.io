---
layout: post
title:  "C++ 상속된 클래스가 있는 경우 가상 소멸자를 사용하자."
subtitle: "Use virtual destructor when existing inherit class"
date: 2019-07-18 20:18:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-07-13 14:15:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Virtual Destructor
</div>

### Intro

상속받는 클래스가 존재하는 경우 가상 소멸자를 사용하는것이 중요하다. 잘못하다간 메모리가 해제되지 않는 현상이 발생한다. 다음의 코드를 보고 문제점에 주의를 기울여야한다.

### Normal code

만약에 업캐스팅을 사용하는 코드가 있을때 다음의 코드는 어떻게 출력이 될까?

```cpp
#include <iostream>

class TimeKeeper {
public:
   TimeKeeper() { std::cout << "TimeKeeper constructor" << std::endl; };
   ~TimeKeeper() { std::cout << "TimeKeeper destructor" << std::endl; };
private:
};

class AtomicTimeKeeper : public TimeKeeper {
public:
   AtomicTimeKeeper() { std::cout << "AtomicTimeKeeper constructor" << std::endl; };
   ~AtomicTimeKeeper() { std::cout << "AtomicTimeKeeper destructor" << std::endl; };
private:
};
AtomicTimeKeeper* getTimeKeeper() {
   return new AtomicTimeKeeper();
}

int main() {
   TimeKeeper *t = getTimeKeeper();

   delete(t);
}
```

```text
TimeKeeper constructor
AtomicTimeKeeper constructor
TimeKeeper destructor
```

t라는 객체가 `업캐스팅` 되어 받기 때문에 TimeKeeper으로 인식하게 되고, `AtomicTimeKeeper`라는 클래스의 소멸자는 불리지 않게 된다.

그렇기 때문에 메모리를 해제 하였음에도 불구하고 해제되지 않은 메모리가 존재하게 된다. 이러한 문제점은 프로그램이 커지거나 지속적으로 사용시 문제를 야기할 수 있으며 잘못된 코드이다.

### Virtual Destructor code

```cpp
#include <iostream>

class TimeKeeper {
public:
   TimeKeeper() { std::cout << "TimeKeeper constructor" << std::endl; };
   virtual ~TimeKeeper() { std::cout << "TimeKeeper destructor" << std::endl; };
private:
};

class AtomicTimeKeeper : public TimeKeeper {
public:
   AtomicTimeKeeper() { std::cout << "AtomicTimeKeeper constructor" << std::endl; };
   ~AtomicTimeKeeper() { std::cout << "AtomicTimeKeeper destructor" << std::endl; };
private:
};
AtomicTimeKeeper* getTimeKeeper() {
   return new AtomicTimeKeeper();
}

int main() {
   TimeKeeper *t = getTimeKeeper();

   delete(t);
}
```

위의 코드는  가상 소멸자를 사용함으로써 자식을포함해 부모까지 적절히 없애주는 코드이다.
위의 코드를 실행하면

```text
TimeKeeper constructor
AtomicTimeKeeper constructor
AtomicTimeKeeper destructor
TimeKeeper destructor
```

이와 같은 결과를 얻을 수 있다. 그렇기 때문에 자식이 존재하는 일반 클래스라면 가상 소멸자를 사용하여 업캐스팅 된 객체가 소멸되더라도 실제 자식의 소멸자가 호출되도록 만들어 주어야 한다.

하지만 그렇다고 무조건 `virtual` 키워드를 사용해서는 안되는데, `virtual` 키워드를 사용하게되면 `가상 함수 테이블 포인터(vptr, virtual table pointer)`가 생기고, `가상 함수 테이블(vtbl, virtual table)`에 등록이 된다.  
이러한 이유 때문에 메모리 적으로 공간을 차지하기 때문에 불필요 한 부분에 막 `virtual`을 붙여서는 안된다.

이처럼 `virtual`만의 특징이 있지만 가상 소멸자가 존재하지 않는 `std::string`등을 상속받아 클래스를 구현하고, 업캐스팅 하여 사용하게 되면 가상 소멸자가 존재하지 않기 때문에 상속받은 클래스의 메모리는 해제되지 않는다.

이처럼 가상 소멸자의 사용을 조심히 하고, 상속을 해 주는 클래스에는 가상 소멸자를 선언하는것을 유념해 두고 코드를 작성해야한다.
