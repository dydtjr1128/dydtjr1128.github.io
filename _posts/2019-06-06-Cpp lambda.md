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

`lamda`는 C++11부터 지원이 되었으며 Functor나 for-each를 이용한 반복등을 이용한 함수를 깔끔하고 쉽게 만들기 위한것이다.

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

### References

<pre>
<a href="https://docs.microsoft.com/en-us/cpp/cpp/decltype-cpp?view=vs-2019">https://docs.microsoft.com/en-us/cpp/cpp/decltype-cpp?view=vs-2019</a>
<a href="http://egloos.zum.com/sweeper/v/3148281">http://egloos.zum.com/sweeper/v/3148281/a>
</pre>
