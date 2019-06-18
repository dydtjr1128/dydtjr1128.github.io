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

또한 C++11 부터, rvalue, lavalue 뿐만 아니라 prvalue, xvalue, glvalue라는 개념이 추가되었다.

![cpp values](/img/Cpp/values.png){:width="50%"}{:.center}

### 2. Values

 위의 다양한 value들을 이해하기 앞서 우선 참조에 대해서 이해를 하고 넘어가야 한다.

 ```cpp
 int main(){
     int num = 0;
     int& refNum = num;// OK!
     int& refNum2 = 0;// Error!
     return 0;
 }
 ```

 위와같이 Reference에 0이라는 리터럴 상수를 참조 할 수 없기 때문에 에러가 발생한다.
 > 비 const 참조에 대한 초기값은 lvalue여야 합니다.

라는 오류를 확인 할 수 있다.
그 대신 0은 const int 형이기 때문에 const int에대한 참조형인 `const int& refNum2 = 0;`으로 사용 할 수는 있다.

이처럼 C++11에서는 lvalue의 특성을 가지고 있는 것을 "`identity`를 가진다"라고 표현한다.
이 뜻은 `데이터를 저장할 수 있는 메모리의 위치정보`를 뜻한다.
C++11 표준에서는 이러한 value들을 다음과 같이 나누었다.

- lvalue : `identity`를 가지면서 `move`될 수 없는 표현식들
- xvalue : `identity`를 가지면서 `move`될 수 있는 표현식들
- prvalue : `identity`를 가지고있지 않으면서 `move`될 수 있는 표현식들
- glvalue : `identity`를 가지고있는 표현식들(lvalue, xvlaue모두 glvalue 표현식)
- rvalue : `move`될 수 있는 표현식들(prvalue, xvalue 모두 rvalue 표현식)
- `identity`를 가지고 있지 않으면서 `move`될 수 없는것들

쉽게 이해하자면, 포인터가 있는 값은 주소를 이동할 수 있기 때문에 `move`될 수 있다.
이처럼 메모리에서 이동 될 수 있는 값을 `rvalue`라고 한다.

#### 2.1 lvalue

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
int main(){
    int a = 10,b=10,c=10;
    int *j = &a; //참조 가능하기 때문에 a는 좌측값(Lvalue)
    foo() = 43; //foo()는 좌측값(Lvalue)
    int *ptr1 = &foo(); //&foo()가능하기 때문에 좌측값(Lvalue)
    ++a;//a는 lvalue, pre-increasement, pre-decreasement
    int c[4];
    std::cout << c[1] << std::endl;//c[1]도 lvalue
    a ? b : c;// a ? b : c의 반환값은 b 또는 c이므로 lvalue
}
```

위의 설명처럼 `identity`를 가지면서 `move`될 수 없는 표현식들을 의미한다.

#### 2.2 xvalue

`identity`를 가지면서 `move`될 수 있는 표현식들을 xvalue라고 한다.
eXpiring에서 따와 xvalue라고 부른다. xvalue는 말 그대로 만료되어가는 값을 뜻한다. 그래서 표현식이 끝나고 표현식이 의미하던 주소로 접근했을 때 값이 존재할 수도 있고, 존재하지 않을 수도 있다.
예를들어 `std::move(x)`와 같이 rvalue reference를 리턴할 수 있는 함수는 lvalue를 move하고, move한 값은 xvalue에 속하게 된다.

#### 2.3 prvalue

```cpp
int a = 10;
int b = 20;
a++;
a+b;
if(a < b){//a<b의 결과값 bool은 prvalue

}

```

#### 2.1 Example1

Intro에서 말한 내용을 풀어 말하면 & 연산자를 이용해 위치를 참조할 수 있는 부분은 좌측값을 뜻하고, 그 외는 우측값을 뜻한다.

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
<a href="https://en.cppreference.com/w/cpp/language/value_category">https://en.cppreference.com/w/cpp/language/value_category</a>
<a href="https://docs.microsoft.com/ko-kr/cpp/cpp/lvalues-and-rvalues-visual-cpp?view=vs-2019">https://docs.microsoft.com/ko-kr/cpp/cpp/lvalues-and-rvalues-visual-cpp?view=vs-2019</a>
<a href="https://blog.seulgi.kim/2017/06/cpp11-value-category.html">https://blog.seulgi.kim/2017/06/cpp11-value-category.html</a>
<a href="https://modoocode.com/189">https://modoocode.com/189</a>
</pre>
