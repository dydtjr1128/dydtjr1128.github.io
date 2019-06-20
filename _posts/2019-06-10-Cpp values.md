---
layout: post
title:  "C++ Values(lvalue, rvalue, xvalue, prvalue, glvalue)"
subtitle: "What is Values(lvalue, rvalue, xvalue, prvalue, glvalue)?"
date: 2019-06-10 15:18:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-20 18:00:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
C++ Values
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

C++11 표준에서는 이러한 value들을 다음과 같이 나누었다.  

![cpp values](/img/Cpp/values2.png){:width="90%"}{:.center}

- lvalue : `identity`를 가지면서 `move`될 수 없는 표현식들
- xvalue : `identity`를 가지면서 `move`될 수 있는 표현식들
- prvalue : `identity`를 가지고있지 않으면서 `move`될 수 있는 표현식들
- glvalue : `identity`를 가지고있는 표현식들(lvalue, xvlaue모두 glvalue 표현식)
- rvalue : `move`될 수 있는 표현식들(prvalue, xvalue 모두 rvalue 표현식)
- `identity`를 가지고 있지 않으면서 `move`될 수 없는것들

이처럼 C++11에서는 값이 식별성을 가지고 있는 경우에 "`identity`를 가진다."라고 표현한다.
또, 값이 메모리에서 이동 될 수 있는 것을 "`move`될 숫 있다."라고 표현한다.  
쉽게 이해하자면, 포인터가 있는 값은 주소를 이동할 수 있기 때문에 `move`될 수 있다.  

위의 경우에서, 기본적인 분류단위를 `Primary category`라고 하며 두개 이상의 복합 분류를 `Mixed cateogry`라고 한다.

Primary category

- xvalue
- lvalue
- prvalue

Mixed cateogry

- rvalue(xvalue + prvalue)
- glvalue(xvalue + lvalue)
  
#### 2.0 Copy & Move에 대한 이해

![cpp copy&move](/img/Cpp/copy,move.png){:width="60%"}{:.center}

위의 그림처럼 move를 시키면 메모리 주소는 유지되면서 포인터만 바뀌게 되는 반변에 copy는 값을 복사하기 때문에 매번 메모리에 할당이 된다.

#### 2.1 lvalue, `identity`를 가지면서 `move`될 수 없는 값들

![cpp values](/img/Cpp/values2.png){:width="90%"}{:.center}

lvalue는 식별자를 갖지만 이동 될수 없는 값을 뜻한다.

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

위의 코드처럼 모든 변수, 함수, 전위증감 표현식, lvalue 참조, 문자열 리터럴 등이 lvalue에 속하는 예이다.
말 그대로 식별자는 갖지만 리터럴 등은 메모리상에서 이동 될 수 없기 때문에 lvalue가 된다.

특징

- 대입문의 좌측에 올 수 있다.
- &연산자로 값의 주소를 얻어올 수 있다.
- 표현식이 끝나더라도 값이 살아있다.

#### 2.2 xvalue, `identity`를 가지면서 `move`될 수 있는 표현식들

![cpp values](/img/Cpp/values2.png){:width="90%"}{:.center}

`identity`를 가지면서 `move`될 수 있는 표현식들을 xvalue라고 한다.
eXpiring에서 따와 xvalue라고 부른다. xvalue는 말 그대로 만료되어가는 값을 뜻한다. 그래서 표현식이 끝나고 표현식이 의미하던 주소로 접근했을 때 값이 존재할 수도 있고, 존재하지 않을 수도 있다.
위의 그림처럼 이동 될 수 있지만 메모리에 올라가는 순간 주소를 갖게되므로 prvalue는 될 수 없다. 컴파일러는 이러한 prvalue의 임시데이터를 저장할 공간이 필요한데, 이러한 임시 데이터 객체를 xvalue라고 한다.
예를들어 `std::move(x)`와 같이 rvalue reference를 리턴할 수 있는 함수는 lvalue를 move하고, move한 값은 xvalue에 속하게 된다.

특징

- 컴파일러만 사용하는 객체 이기 때문에 &연산자가 허용되지 않는다.
- 표현식이 끝났을 때 사라진다.

#### 2.3 prvalue, `identity`를 가지고있지 않으면서 `move`될 수 있는 표현식들

![cpp values](/img/Cpp/values2.png){:width="90%"}{:.center}

```cpp
int a = 10;
int b = 20;
a++;
a+b;
if(a < b){//a<b의 결과값 bool은 prvalue

}
```

prvalue는 `pure rvalue`의 약자로 후위 증감연산자, 문자열 리터럴을 제외한 모든 리터럴 등이 prvalue에 속한다.
prvalue는 대입문 오른쪽에 올 수 있으며 주소가 없다는 특징을 가지고 있다.

틍징

- 대입문의 우측에 올 수 있다.
- 주소가 없다.

#### 2.4 glvalue, `identity`를 가지고있는 표현식들(lvalue, xvlaue모두 glvalue 표현식)

![cpp values](/img/Cpp/values2.png){:width="90%"}{:.center}

gvalue는 xvalue 혹은 lvalue를 뜻한다.
쉽게 말하자면 공간의 성질을 가지고 있는 값들을 통칭하는 말이다.

`데이터를 저장할 수 있는 메모리의 위치정보`를 가지고 있다.

gvalue 는 lvalue에서 rvalue로 변환이 가능한데, 포인터, 배열 및 함수에서 암시적 변환을 통해 prvalue로 변환 할 수 있다.

#### 2.5 rvalue, `move`될 수 있는 표현식들(prvalue, xvalue 모두 rvalue 표현식)

![cpp values](/img/Cpp/values2.png){:width="90%"}{:.center}

rvalue는 메모리 주소에서 이동이 될 수 있는 표현식들을 통칭하는 말이다.
<a href="#20-copy--move에-대한-이해">2.0</a>에서 나왔듯이 이동 가능한 표현식(prvalue, xvalue)를 뜻한다.

#### 3. 참조 예제

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
