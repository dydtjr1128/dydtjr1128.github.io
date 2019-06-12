---
layout: post
title:  "C++ Lambda"
subtitle: "What is Lambda?"
date: 2019-06-06 17:43:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-06 17:43:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Lambda
</div>

### 1. Intro

`lambda`는 C++11부터 지원이 되었으며 Functor나 for-each를 이용한 반복등을 이용한 함수를 깔끔하고 쉽게 만들기 위한것이다.

### 2. 펑터(Functor)

`Functor`는  함수처럼 동작하는 클래스를 의미하며 '함수 오브젝트(Funtion Object)'라고도 불린다. 즉 operator()를 정의하고 이를 이용해서 표현되어있다.

```cpp
class FunctorClass
{
public:
    return-type operator () ( parameters... )
    {
        // do something...
    }
};
```

#### 2.1 Functor example

```cpp
#include <iostream>
using namespace std;

class Point
{
    int xpos, ypos;
public :
    Point(int x = 0, int y = 0) : xpos(x), ypos(y) {}
    Point operator+(const Point &pos) const
    {
        return Point(xpos + pos.xpos, ypos + pos.ypos);
    }
    friend ostream& operator<<(ostream &os, const Point &pos);
};
class Adder
{
public :
    Point operator()(const Point &pos1, const Point &pos2)
    {
        return pos1 + pos2;
    }
};
ostream& operator<<(ostream &os, const Point &pos)
{
    os << '[' << pos.xpos << ", " << pos.ypos << ']' << endl;
    return os;
}
int main(){
    Adder adder;
    cout << adder(Point(5, 4), Point(6, 10));

    return 0;
}
```

위의 예제처럼 Functor는 함수 또는 객체의 동작방식에 유연함을 제공할 때 주로 사용된다.

### 3. Lambda

![lambda](/img/Cpp/lambda.png){:width="100%"}{:.center}

위의 사진처럼 람다는

`[변수 캡쳐](받을 인자)->리턴타입{함수}(넘길 인자)`

의 형태를 띄고 있다.

```cpp
int main(){
    int a = 10;
    int b = 20;
    int c = 30;
    int result = [](int a, int b)->int {return a + b; }(a, b);
    int result2 = [=]()->int {return a + b; }();
    int result3 = [=,&a,&b]()->int {return a + b+c; }();
    auto result4 = [](int d)->decltype(auto) {return d * 30; }(a);// a를 대입해서 나온결과값이 result4
    int result5 = [a, &b]()->int {return a + b;}();
    auto result6 = [](int d)->decltype(auto) {return d * 30; };//result6는 함수 포인터

    [&b](){ b *= 6; }();// =>동일 [](int &v) {v *= 6;}(b);
    //[b]() {b *= 6; }();//err! 참조가 아닌 값으로 가져와 *만 할 수 없음

    std::cout << "result  : " << result << std::endl;
    std::cout << "result2 : " << result2 << std::endl;
    std::cout << "result3 : " << result3 << std::endl;
    std::cout << "result4 : " << result4 << std::endl;
    std::cout << "result5 : " << result5 << std::endl;
    std::cout << "a  : " << a << std::endl;//a : 10
    std::cout << "b  : " << b << std::endl;//b : 120
    std::cout << result6(10) << std::endl;
}

```

[변수 캡쳐] : 현재 람다 함수에서 사용할 외부의 변수를 의미한다.

- [] : 아무 변수도 사용하지 않겠다는 의미
- [=] : 해당 함수에 존재하는 모든 변수를 값으로 가져와 사용 하겠다는 의미
- [&] : 해당 함수에 존재하는 모든 변수를 레퍼런스로 가져와 사용 하겠다는 의미
- [&, a, b] : 해당 함수에 존재하는 모든 변수를 레퍼런스로 가져와 사용하고 a,b는 값으로 가져와 사용
- [=, &a, &b] : 해당 함수에 존재하는 모든 변수를 값으로 가져와 사용하고 a,b는 러퍼런스로 가져와 사용
- [a, &b] : a와 b만 가져와 사용하되 a는 값으로, b는 레퍼런스로 가져와 사용

(받을 인자) : ​부분은 말 그대로 함수에서 받는 인자들이다
> `void func(int a, int b)` 에서 `(int a, int b)` 부분이다.
> 받을 인자가 없다면 `()`로 두면 된다.

->리턴타입 : void, int 와 같이 함수의 리턴형을 명시하는 부분이다.
> void라면 ->와 함깨 생략 가능하다.
> delctype(auto)와 같이 타입 추론형식도 사용가능하다.

{함수} : 함수의 몸체 영역으로 만들고자 하는 코드의 구현부분이 들어가는부분이다.

(넘길 인자) : 호출하는 함수에서 넘겨주는 값들이다 `func(3,5);` 에서 3,5를 넘겨주는것과 같다.

#### 3.1 Lambda 함수 중복

```cpp
int a = 10, b = 20;
int result = [&]()->int{
    return [&]()->int{ return a+b;}();
}();
```

람다 함수 내부에 또다른 람다 함수를 중복 시킬 수 있다.

#### 3.2 클래스 내부의 Lambda 함수

```cpp
class Adder {
private:
    int a;
public:
    Adder(int a) {
        this->a = a;
    }
    int addNum(int num) {
        return [=]()->int { return a + num; }();
    }
    int addNum2(int num) {
        return [&]()->int { return a + num; }();
    }
};
```

클래스 내부에서도 람다 함수를 이용한 함수를 구현 할 수 있다.

#### 3.3 Lambda 함수 포인터

```cpp
auto myFunction = []{std::cout << "This is my function"<< std::endl;};
```

### References

<pre>
<a href="https://docs.microsoft.com/ko-kr/cpp/cpp/examples-of-lambda-expressions?view=vs-2019">https://docs.microsoft.com/ko-kr/cpp/cpp/examples-of-lambda-expressions?view=vs-2019</a>
<a href="https://modoocode.com/196">https://modoocode.com/196</a>
</pre>
