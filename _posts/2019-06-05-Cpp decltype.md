---
layout: post
title:  "C++ decltype"
subtitle: "What is decltype?"
date: 2019-06-05 21:30:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-05 21:30:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
decltype
</div>

### 1. Intro

`decltype()`은 `auto`와 찰떡궁합이라고 할정도로 같이 쓰인다. C++11부터 타입을 추론할 수 있는 `auto`와 `decltype()`이 지원되었는데, 이러한 매커니즘이 제공됨으로써 더욱 간결하고 효율적인 코드 작성이 가능해졌다. 둘 다 컴파일러가 인지하는 타입의 자료형을 보고 동작한다.

함수 원형 : `decltype( expression )`  
C++14 이상 : `decltype(auto)` 사용 가능  
C++11 이상 : `decltype(expression)` 사용 가능

`decltype()`은 declared type(선언된 형식)의 줄임말로 주어진 이름이나 표현식의 구체적인 타입을 알려주는 키워드이다.
C++11부터 도입된 `decltype()`은 주로 templete 인자에 기반한 generic programming의 어려움을 해소하기 위해 도입되었다.

### 2. auto vs decltype

`auto`가 값에 상응하는 타입을 추론시켜주는 키워드라면
`decltype()`은 값으로부터 타입을 추출해 낼 수 있는 키워드라고 생각하면 된다.
두 키워드 모두 컴파일 시간 라이브러리 이다.

```cpp
int count = 5;
auto qq;// error!
auto qq = count;//ok
decltype(count) d;
```

위에서 설명한 것 같이 auto는 값에 상응하는 타입을 추론하기 때문에  rvalue 값을 설정 해 주어야 한다.
그러나 decltype은 괄호 내부를 보고 타입을 추출해 내기 때문에 선언이 가능하다.

### 3. decltype 사용 예시

```cpp
int x = 3;
decltype(x) y = x; // => int y = x;
```

위와 같은 경우 `int y = x;`와 같은 뜻을 나타내며 이는 `auto y = x;`로 사용하는 것이 깔끔하다.

#### 3.1 기본 decltype

```cpp
struct A
{
   int x;
};
const A* a = new A{0};

//이 경우 a->x는 int 형태이므로 double x3;와 같은 형태
decltype(a->x) x3;

//decltype() 내부에 ()로 묶는 부분은 참조 표현식을 의미한다.
//const &int x4와 동일하다.
decltype((a->x)) x4 = x3;
```

#### 3.2 C++11 decltype

C++11(VS2013)부터 trailing return type(후행 반환 형식)인 `decltype` 및 자료형 표현으로 auto 타입 반환이 가능해졌다. 이 점 덕분에 템플릿 함수의 auto 반환이 상당히 유연해지고 자유로워졌다.

```cpp
// auto 반환함수와 후행 반환 형식으로 int 사용
auto add_function(int a, int b) -> int{
    return a + b;
}
// auto 반환과 후행 반환 형식으로 decltype()을 사용
template <typename T, typename U>
auto add_template(T&& x, U&& y) -> decltype(std::forward<T>(x) + std::forward<U>(y)){
    return std::forward<T>(x) + std::forward<U>(y);
}
// BUILDER의 makeObject() 반환 형식으로부터 자유로워짐
template <typename TBuilder>
auto MakeAndProcessObject(const TBuilder& builder) -> decltype(builder.makeObject()){
    auto val = builder.makeObject();

    return val;
}
```

C++11에서 auto 반환 함수는 반드시 후행 반환 형식을 지정해 주어야 하며,
특히 템플릿 함수들의 경우 타입을 템플릿 인자들로부터 추론해야 하므로 decltype을 활용하지 않으면,
컴파일 단계에서 auto 반환 형식을 재대로 추론하지 못해 컴파일 에러가 발생하게 된다.

#### 3.3 C++14 decltype

C++14(VS2015)부터는 auto 반환시 후행 반환 형식을 지정해 주지 않아도 컴파일 에러없이 반환 타입을 추론해 준다.

```cpp
auto add_function(int a, int b){// -> int{
    return a + b;
}
template <typename T, typename U>
auto add_template(T&& x, U&& y){// -> decltype(std::forward<T>(x) + std::forward<U>(y)){
    return std::forward<T>(x) + std::forward<U>(y);
}
template <typename TBuilder>
auto MakeAndProcessObject(const TBuilder& builder){// -> decltype(builder.makeObject()){
    auto val = builder.makeObject();

    return val;
}
```

위의 코드는 컴파일 시에는 문제없이 동작한다. 그러나 원하는 형태가 아닌 다른 형태로 리턴 될 수 있는 위험이 존재한다. auto는 템플릿 타입에 의존해서 리턴 시키게 되는데, 참조 형태에 따라 다르게 리턴 될 수도 있기 때문에 개발자가 원하는 직관적으로 리턴되기 위한 모습을 위해 `decltype(auto)`의 형태를 사용해야 한다.

```cpp
decltype(auto) add_function(int a, int b){// -> int{
    return a + b;
}
template <typename T, typename U>
decltype(auto) add_template(T&& x, U&& y){// -> decltype(std::forward<T>(x) + std::forward<U>(y)){
    return std::forward<T>(x) + std::forward<U>(y);
}
template <typename TBuilder>
decltype(auto) MakeAndProcessObject(const TBuilder& builder){// -> decltype(builder.makeObject()){
    auto val = builder.makeObject();

    return val;
}
```

즉, 적절한 타입 자동 추론 기능으로 리턴하고 싶다면 decltype을 이용한 후위 반환 형식을 지정해 주거나 deltyppe(auto)를 사용해 리턴 시켜주어야 한다.

### References

<pre>
<a href="https://docs.microsoft.com/en-us/cpp/cpp/decltype-cpp?view=vs-2019">https://docs.microsoft.com/en-us/cpp/cpp/decltype-cpp?view=vs-2019</a>
<a href="http://egloos.zum.com/sweeper/v/3148281">http://egloos.zum.com/sweeper/v/3148281/a>
</pre>
