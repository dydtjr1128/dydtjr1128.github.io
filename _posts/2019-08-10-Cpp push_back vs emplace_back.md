---
layout: post
title:  "C++ Vector push_back vs empalce_back"
subtitle: "C++ Vector push_back vs empalce_back"
date: 2019-08-10 13:55:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-08-10 13:55:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

std::vector의 멤버 함수인 `push_back`은 vecotr의 맨 뒤에 요소를 추가할 때 사용하는 함수로써 기본적인 기능을 담당하는 함수이다.
그 뒤에 추가된 멤버 함수인 `emplace_back`은 `push_back`의 문제점을 해결하기위해 C++11 에 추가되었다.

#### push_back 함수원형

```cpp
void push_back( const T& value ); //C++98
void push_back( T&& value );//C++11
```

`push_back`은 c++03까지 하나의 함수로 존재 했다가 C++11에서 Move Semantics 개념이 추가 되고 나서 이를 적용 시킬 함수 하나가 더 추가되었다.

#### emplace_back 함수원형

```cpp
template< class... Args >
void emplace_back( Args&&... args ); //C++11 - C++17

template< class... Args >
reference emplace_back( Args&&... args ); //Since C++17
```

`emplace_back`은 함수 원형이 한가지 뿐이다. `push_back`과 달리 가변 인자 템플릿 문법을 이용해 생성자의 인자를 받는다.

### push_back vs emplace_back

```cpp
#include <iostream>
#include <vector>

class MyClass {
public:
   MyClass(int a) : num(a) {
      std::cout << "MyClass constructor." << std::endl;
   };
   ~MyClass() {
      std::cout << "MyClass destructor." << std::endl;
   };
   MyClass(const MyClass& rhs) {
      this->num = rhs.num;
      std::cout << "MyClass copy constructor." << std::endl;
   }
   MyClass& operator=(MyClass& rhs) {
      this->num = rhs.num;
      std::cout << "MyClass copy operator." << std::endl;
      return *this;
   }
private:
   int num;
};

int main() {
   std::vector<MyClass> vec, vec2;
   std::cout << "-vec.push_back()-" << std::endl;
   vec.push_back(MyClass(10));
   std::cout << "-vec2.emplace_back()-" << std::endl;
   vec2.emplace_back(15);
   std::cout << "-end-" << std::endl;
}
```

위와 같은 코드가 존재할때, 실행결과는 어떻게 될까?

```result
-vec.push_back()-
MyClass constructor.
MyClass copy constructor.
MyClass destructor.
-vec2.emplace_back()-
MyClass constructor.
-end-
MyClass destructor.
MyClass destructor.
```

실행 결과는 위와 같이 출력된다. `push_back`을 이용한 경우에는 복사생성자가 한번 불리는데, `emplace_back`과 같은경우는 복사생성자가 불리지 않는다.

왜냐하면 `emplace_back`은 인자로 받은 값을 생성자에 넣어 `emplace_back` 내부에서 객체를 생성하지만 `push_back`의 경우는 외부에서 생성한 객체를 내부로 넣을 때 복새생성자를 이용해 복사해 관리하기 때문이다.그렇기 때문에 `emplace_back`에 비해 `push_back`은 복사생성자를 호출해 성능적인 측면에서 느릴 수 밖에 없다.
하지만 이는 컴파일러마다 다르겠지만 최적화가 이루어 져 있어 별 차이가 없을 수도 있다. 그러나 원리상 `emplace_back`이 일반적인 경우 더 좋기 때문에 이를 사용하는것이 좋을 수 있다. 하지만 무조건 적으로 `emplace_back`이 좋은것만은 아니다.

### emplace_back을 사용해서는 안되는 경우

```cpp
int main(){
   std::vector<std::unique_ptr<MyClass>> vec1, vec2;
   vec1.push_back(std::make_unique<MyClass>(10));
   std::cout << "vec.push_back()" << std::endl;

   std::cout << "----------------------" << std::endl;

   vec2.emplace_back(new MyClass(10));
   std::cout << "vec2.emplace_back()" << std::endl;
   std::cout << "----------------------" << std::endl;
}
```

위와 같은 코드에서, `push_back`은 vector의 템플릿 안의 형태인 std::unique_ptr(포인터) 형태로 받게 된다. 그리고 `emplace_back`은 생성자의 인자를 받아서 내부에서 `std::unique_ptr<MyClass>(new MyClass(10))`을 실행 시킬 것이므로 new MyClass(10)을 넣어 주었다. 

위의 둘 코드는 생성자만 호출되지만, 이러한 때에는 `push_back`을 쓰는것이 안정적이다. 왜냐하면 `emplace_back`에 넣을 `new MyClass(10)`가 unique_ptr로 만들어지기 전에 실패가 발생한다면 객체는 생성되지만 이를 가리킬 수 있는 존재가 없어 문제가 되게 된다. 

하지만 위의 `push_back`의 경우에는 `std::make_unique<MyClass>(10)` 이후에 오류가 발생하더라도 메모리가 해제 되기 때문에 안전하다.

이처럼 위의 경우에는 성능상 별 차이는 없지만 포인터의 생성 관점에서 볼 때 위의 `push_back`을 사용하는것이 더 안전하다.


### performance 

```cpp
int main() {
   std::vector<std::string> vec, vec2;
   constexpr int kTestCase = 1000000;
   clock_t start;

   start = clock();
   for (int i = 0; i < kTestCase; i++)
      vec.push_back(std::string("hello"));
   std::cout << "vec.push_back() : " << clock() - start << std::endl;

   start = clock();
   for (int i = 0; i < kTestCase; i++)
      vec2.emplace_back("hello");
   std::cout << "vec2.emplace_back() : " << clock() - start << std::endl;
}
```

위의 코드를 실행했을때의 결과이다. 물론 컴파일러단의 최적화(RVO 등)에 따라 이러한 결과가 나오지 않을 수도 있다.

```result
vec.push_back() : 7315
vec2.emplace_back() : 4917
```
