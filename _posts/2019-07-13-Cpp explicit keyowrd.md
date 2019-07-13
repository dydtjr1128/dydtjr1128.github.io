---
layout: post
title:  "C++ explicit 키워드 이해하기"
subtitle: "What is explicit?"
date: 2019-07-13 14:15:30 +0900
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
explicit
</div>

### Intro

explicit 키워드는 자신이 원하지 않은 형변환이 일어나지 않도록 제한하는 키워드이다.

### explicit keyword

```cpp
#include <iostream>
class A{
public:
   int num;
   A(int n) : num(n){};
};
void printA(A a){
   std::cout << a.num << std::endl;
}
int main(){
   int n = 26;
   printA(n);
}
```

위의 코드에서는 `printA(A a)` 함수의 인자로 들어오는 26이라는 숫자가 컴파일러에 의해 A 형태로 바뀌게 된다.
이때 `A(int n)`이라는 생성자를 통해서 바뀌게 되는 것이다.

![explicit call stack](/img/Cpp/explicit.png){:.center}
위의 사진은 A의 생성자에서 중단점을 걸고 Call stack을 본 내용이다.
위의 내용처럼 사용자가 형변환을 하지 않더라도 자동적으로 형변환을 위해 생성자가 불리는 것을 알 수 있다.

```cpp
#include <iostream>
class A{
public:
   int num;
   explicit A(int n) : num(n){};
};
void printA(A a){
   std::cout << a.num << std::endl;
}
int main(){
   int n = 26;
   printA(n); //Error!
}
```

하지만 위처럼 생성자에 expilict 키워드를 사용한다면 컴파일러가 알아서 형변환 하는것을 막을 수 있다.  
이처럼 explicit 키워드 없이 사용한다면 사용자가 원치 않은 형변환이 일어나는 등 예기치 않은 버그가 발생할 수 있기 때문에 사용해 주는 것이 좋다.

explicit 키워드를 사용한다면 사용자가 상황에 맞게 직접 형 변환을 해주어야 한다.

```cpp
int main(){
   int n = 26;
   printA(A(n)); //OK
}
```

### References

<pre>
<a href="https://blockdmask.tistory.com/236">https://blockdmask.tistory.com/236</a>
</pre>
