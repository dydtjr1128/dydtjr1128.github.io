---
layout: post
title:  "C++ 객체 생성 및 소멸 과정 중에는 절대로 가상 함수를 호출하지 말자"
subtitle: "Do not use virtual function in constructor/destructor"
date: 2019-07-23 20:01:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: EffectiveC++
tags : EffectiveC++
lastmod : 2019-07-23 20:01:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Do not use virtual function in constructor/destructor.

```cpp
class Transaction {
public:
   virtual void logTransaction() const = 0;
};
Transaction::Transaction() {
   logTransaction();
}

class BuyTransaction : public Transaction {
public:
   virtual void logTransaction() const;
};

class SellTransaction : public Transaction {
public:
   virtual void logTransaction() const;
};

int main() {
   BuyTransaction b;//error!
}

```

생성자의 성성 순서는 `Transaction`의 생성자가 불리고 `BuyTransaction`이 불리게 되는데 `Transaction`의 생성자 가 끝나기 전에 함수를 호출한다. 그러나 생성자가 끝나기 전에는 절대로 파생 클래스로 내려가지 않는다. 즉, 가상 함수가 먹히지 않는다.

즉, `Transaction`의 생성자가 끝나기 전까지, `BuyTransaction`의 생성자가 시작하기 전까지의 타입은 `Transaction`인 것이다.

요약하자면 `Transaction` 생성자에서 `Transaction`의 순수 가상 함수를 호출하였기 때문에 에러가 발생한 것이다.
