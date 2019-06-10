---
layout: post
title:  "C++ Lvalue Rvalue"
subtitle: "What is Lvalue & Rvalue?"
date: 2019-06-10 15:18:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-10 15:18:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Lvalue Rvalue
</div>

### 1. Intro

우측값 참조(Rvalue reference)는 C++11에서 처음 소개된 기능으로 다소 이해하기 어려운 구조를 가지고 있다.

기존의 C에서 사용했던 `Rvalue, Lvalue`와는 다른 정의를 가지고 있다.

> 좌측값은 대입(assignment) 시에 왼쪽 혹은 오른쪽에 오는 식(expression)이고, 우측값은 대입 시에 오직 오른쪽에만 오는 식이다.

C에서는 위처럼 정의를 내리고 있다.

그러나 C++에서는 다음과 같의 정의를 하고 있다.

> 좌측값은 어떠한 메모리 위치를 가리키는데, & 연산자를 통해 그 위치를 참조할 수 있다. 우측값은 좌측값이 아닌 값들이다.

### 2. Rvalue Lvalue

 위에서 말한 내용을 풀어 말하면 & 연산자를 이용해 위치를 참조할 수 있는 부분은 좌측값을 뜻하고, 그 외는 우측값을 뜻한다.

#### 2.1 Example1

```cpp
static int a = 10;
int& foo() {
    a++;
    return a;
}
int foo2(){
    return a;
}

//좌측값 (Lvalue)
int a = 10;
int *j = &a; //참조 가능하기 때문에 a는 좌측값(Lvalue)
foo() = 43; //foo()는 좌측값(Lvalue)
int *ptr1 = &foo(); //&foo()가능하기 때문에 좌측값(Lvalue)
//ptr1 == &a == &foo()

// 우측값(Rvalue)
int b = 10;
b = foobar();         // foobar()는 참조 불가능, 우측값(Rvalue)이다. b는 좌측값
int* ptr2 = &foobar();  // error. 우측값의 주소는 참조할 수 없다.
b = 42;               // 42(상수)는 우측값이다.
```

#### 2.2 Example2

```cpp
int& func(int &a){
    a++;
    return a;
}
int func2(int &a){
    a++;
    return a;
}
```

이 두함수의 차이는 무엇일까?

위의 `func`함수는 int&를 리턴하게 되는데, 이는 return a;에서 a라는 실제 객체를 리턴 시키는 함수이다.  
=> lvalue의 속성을 갖게 된다.  

그러나 `func2` 함수는 int를 리턴하고, 이는 a의 복제본을 리턴하는 것이다.  
=> rvalue로 반환된다.

```cpp
int num1;
int num2 = func(num1);
```

`func`라고 하는 int& 리턴형 함수를 사용하더라도 값의 복사가 이루어지기 때문에 위의 num1과 num2는 다른 변수이다.

```cpp
int num1;
int &num2 = func(num1);
```

그러나 위의 경우에는 참조를 통한 전달이 이루어지기 때문에 num1과 num2는 같은 변수가 된다. 위와 같은경우 func2로는 받을 수 없는데, 참조자가 리터럴상수를 참조할 수 없기 때문이다.

### References

<pre>
<a href="https://modoocode.com/189">https://modoocode.com/189</a>
</pre>
