---
layout: post
title:  "C++ static_assert란?"
subtitle: "What is static_assert?"
date: 2019-06-03 17:09:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-03 17:09:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
static_assert?
</div>

### 1. Intro

기존의 C++에 존재하는 `#error` 전처리기 지시자와 `assert` 매크로를 통하여 assertion 처리가 가능하다.
프로그램이 수행되는 동안 반드시 유지되어야 할 불변식(invariant)을 `assert`를 이용해서 검증 가능하다.  
예를 들어, 동적으로 배열을 할당할 때 배열 사이즈는 반드시 양수여야 하는데, 이를 assert를 써서 검증할 수 있다.

#### 1.1 Assert

C   : `#include <assert.h>`  
C++ : `#include <cassert>`  
함수 원형 : `void assert(int expression)`  

```cpp
#include <iostream>
#include <cassert>
using namespace std;

void foo (int age)
{
  // assert를 이용한 유효성 확인
  assert(age > 50);

  int* p = new int[age];
}

int main(int argc, char* argv[])
{
  foo(26);
  return 0;
}
```

위와 같이 `assert`를 이용한다면 오류가 발생하면 개발자에게 프로그램이 다양한 정보(Call Stack, 발생 위치 등)를 알려주어 유효성을 쉽게 검증 할 수 있도록 도와준다.

---

#### 1.2 #error

```cpp
#errortoken-string
```

`#error`는 위와같은 형태로 되어있다.

```cpp
#if !defined(__cplusplus)
#error C++ compiler required.
#endif
```

전처리기가 전처리기 지시자인 `#error`를 만나게되면 컴파일 오류를 발생시키며 뒤에 나오는 `token-string` 문자열을 화면에 출력한다.
즉, error가 발생할것 같이 컴파일 시점에 강제로 error를 발생시킨다.

하지만 이러한 `assert`와 `#error`에는 중요한 단점이있다.
`assert`의 경우 런타임에 비교를 수행하기 때문에 성능의 하락을 가져올 수 있다.
`#error`의 경우 컴파일 시간에 처리가 가능하나 템플릿이 구체화 되기 전에 수행되므로 C++에서는 적절하지 못하다.  
이러한 문제점을 해결하기 위해 탄생한 문법이 바로 `static_assert`이다.

### 2. static_assert

C++11에 추가된 static_assert는 컴파일 타임에 소프트웨어 assertion을 위해서 추가된 문법이다.
만약 작성된 상수 표현식(constant-expression)이 false(거짓)일 경우에 컴파일러는 메시지를 출력하고 C2338 에러를 출력한다.
반대로 true(참)인 경우에는 아무 영향을 주지 않는다.

```cpp
static_assert( constant-expression, string-literal );
static_assert( constant-expression ); // Visual Studio 2017 and later
```

앞의 constant-expression 부분은 bool값으로 return 되어야 한다.
이 부분이 false 일 때, 컴파일러가 string-literal를 표시하게 된다.

```cpp
struct Command {
    char cmd;
    int len;
};
template <class T>
void foo(T& a) {
    static_assert(sizeof(Command) == sizeof(a.cmd) + sizeof(a.len), "Command size is different");
}
int main() {
    Command a;
    foo(a);
}
```

위와 같은 상황에서 Command 클래스의 사이즈에 padding이 들어갔는지 확인하는 예제이다.
기본적으로 padding이 들어 Command의 사이즈는 8이 출력되는상황에서 char와int의 사이즈를 더한 5와 다르므로 `Command size is different`라는 출력문을 볼 수 있게 된다.

```cpp
#include <type_traits>
struct Myclass {
    Myclass(const Myclass&) = delete;
    Myclass() = default;
};

template <class T>
void my_assert(T& a)
{
    static_assert(std::is_copy_constructible<T>::value,
        "Copy constructure is unavailable");
}

int main()
{
    Myclass a;
    my_assert(a);
}
```

또한 위처럼 템플릿을 사용하는 상확에서 복사 생성자를 지운 경우 사용 가능성을 검증하는 코드에서 검증을 할 수 있다.

이처럼 `static_assert`는 컴파일 시간에서의 검증을 지원하기 때문에 성능을 높일수가 있으며 템플릿을 지원하기 때문에 템플릿의 에러도 잡아낼 수 있다.

### References

<pre>
<a href="https://docs.microsoft.com/ko-kr/cpp/cpp/static-assert?view=vs-2019">https://docs.microsoft.com/ko-kr/cpp/cpp/static-assert?view=vs-2019</a>
<a href="https://en.cppreference.com/w/cpp/language/static_assert">https://en.cppreference.com/w/cpp/language/static_assert</a>
</pre>
