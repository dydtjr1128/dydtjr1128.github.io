---
layout: post
title:  "C++ 객체의 모든 부분을 빠짐없이 복사하자."
subtitle: "Let's make a full copy of the object."
date: 2019-07-30 19:53:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: EffectiveC++
tags : EffectiveC++
lastmod : 2019-07-30 19:53:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Let's make a full copy of the object

많은 클래스 내부에는 복사 생성자와 복사 대입 연산자가 존재하는 경우가 있다. 이 둘을 통틀어 `복사 함수`라고 부르는데, 이 부분은 컴파일러에 의해 선언 없이도 혼자 만들어 질 수도 있다.

하지만 이러한 복사 함수를 사용 할 때 중요한점이 있는데, 자신의 복사 함수만을 사용해서는 안된다. 상속받은 클래스가 존재한다면 부모의 복사 함수 또한 호출해 주어야 부모에 속해있는 변수 등에 대한 처리가 가능해지기 때문이다.

```cpp
#include <iostream>
#include <string>

class Customer {
public:
   Customer();
   Customer(std::string name):name(name){}
   Customer(const Customer& rhs):
      name(rhs.name) {
      std::cout << "Copy constructor"<< std::endl;
   }
   Customer& operator=(const Customer& rhs) {
      std::cout << "Copy operator" << std::endl;
      name = rhs.name;
      return *this;
   }
private:
   std::string name;
};

class PriorityCustomer : public Customer {
public:
   PriorityCustomer(int age) :age(age) {}
   PriorityCustomer(const PriorityCustomer& rhs) :
      age(rhs.age) {
      std::cout << "Copy PriorityCustomer constructor" << std::endl;
   }
   PriorityCustomer& operator=(const PriorityCustomer& rhs) {
      Customer::operator(rhs);
      priority = rhs.priority;
      std::cout << "Copy PriorityCustomer operator" << std::endl;
      return *this;
   }
private:
   int age;
};
```

위의 코드는 문제가 생길 수 있는 코드이다.  
위의 코드에서 `PriorityCustomer`은 복사 생성자를 age만 넘겨주고 있다. 그러나 `Customer`을 상속받았기 때문에 name에 대해서는 복사를 하고 있지 않다. 그렇기 때문에 문제가 발생한다.
이런 문제를 피하기 위해서는 아래처럼 항상 부모의 복사 생성자 까지 호출해 주어야 한다.

```cpp
class PriorityCustomer : public Customer {
public:
   PriorityCustomer(int age) :age(age) {}
   PriorityCustomer(const PriorityCustomer& rhs) :
      Customer(rhs),
      age(rhs.age) {
      std::cout << "Copy PriorityCustomer constructor" << std::endl;
   }
   PriorityCustomer& operator=(const PriorityCustomer& rhs) {
      Customer::operator(rhs);
      priority = rhs.priority;
      std::cout << "Copy PriorityCustomer operator" << std::endl;
      return *this;
   }
private:
   int age;
};
```

만약 위처럼 부모의 복사 생성자를 호출하지 않는다면 age값만 남아있고 name에 대한 내용은 복사되지 않을것이다.
