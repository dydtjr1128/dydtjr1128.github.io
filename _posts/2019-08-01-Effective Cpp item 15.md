---
layout: post
title:  "C++ 자원 관리 클래스에서 관리되는 자원은 외부에서 접근 할 수 있도록 하자."
subtitle: "Managed resource by the resource management class be accessible from the outside."
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

### Managed resource by the resource management class be accessible from the outside.

스마트 포인터를 사용할 때 조심해야 하는 점중 하나가 형 변환이다.  
형 변환을 잘 사용한다면 매끄러운 자원 접근이 가능 하도록 도와주지만 잘못하다간 자원이 다 노출되어 버릴 수 도 있다.

```cpp
int daysHeld(const Investment *pi){
   ...
}
int main(){
   std::shared_ptr<Investment> pInv(createInvestment());
   int d = dayHeld(pInv);
}
```

위와 같은 코드가 존재할 때, 위의 코드는 오류를 발생시킨다. 왜냐하면 dayHeld라는 함수는 Raw Pointer을 인자로 받는데, 넘겨주는것은 `std::shared_ptr` 형태이기 때문이다.

그렇기 때문에 위의 경우에는 변환할 방법이 필요해진다.  
이런 방법은 2가지가 존재하는데 그 중 하나는 `명시적 변환(explicit conversion)`이고 다른 하나는 `암시적 변환(implicit conversion)`이다.

`std::shared_ptr`이나 `std::unique_ptr`은 `get()`이라는 함수로 명시적 변환을 통해 Raw pointer의 사본을 얻어 낼 수 있다.

```cpp
int d = daysHeld(pInv.get());//명시적 형변환
```

이러한 기능을 가진 스마트 포인터에는 역참조 연산자(operator-> 및 operator*)도 오버로딩하고 있어서 자신이 관리하는 실제 포인터에 대한 암시적 변환도 쉽게 할 수 있다.

```cpp
#include <memory>

class Pointer {
public:
   int getNum() { return num; }
private:
   int num;
};
int main() {
   std::shared_ptr<Pointer> pointer;
   int r = pointer->getNum();
   int r2 = !((*pointer).getNum());
}
```

위의 코드처럼 실제 포인터에 대한 `암시적 형 변환` 또한 가능하다.

