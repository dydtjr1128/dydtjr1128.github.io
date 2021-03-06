---
layout: post
title:  "C++ RVO, NRVO에 대해서 알아보자."
subtitle: "C++ RVO(Return Value Optimization), NRVO(Named Return Value Optimization)"
date: 2019-08-10 17:30:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-08-10 17:30:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

C/C++를 사용하는 이유 중 하나로는 빠른 속도와 커스터마이징 가능한 자언관리 등의 최적화를 위해서 사용할 것이다. 이러한 부분에서 코드를 개발하면서, 컴파일러단에서 부터 코드를 최적화 시켜서 더욱 바르게 실행 할 수 있도록 하려는 노력들이 많이 있다.

이처럼 C/C++ 에서는 내가 원하는대로 코드를 작성하더라도 컴파일러에의해 최적화 시킬 여지가 있으면 그러한 부분은 컴파일러가 최적화 시켜서 돌아가도록 만들어준다.

이번에는 대표적인 예인 RVO(Return Value Optimization)와 NRVO(Named Return Value Optimization)에 대해서 알아 보려고 한다.

### RVO(Return Value Optimization)

```cpp
#include <iostream>

class Foo {
public:
    Foo(const std::string& name) {
        this->name = name;
        std::cout << "This is " << name << " constructor." << std::endl;
    }
    ~Foo() {
        std::cout << "This is " << this->name << " desstructor." << std::endl;
    }
    Foo(const Foo& rhs) {
        this->name = rhs.name;
        std::cout << "This is " << rhs.name << " copy constructor." << std::endl;
    }
    Foo& operator=(const Foo& rhs) {
        std::cout << "This is " << this->name << " copy operator." << std::endl;
        return *this;
    }
private:
    std::string name;
};

//NRVO
Foo MakeFoo(const std::string& name) {
    Foo foo(name);
    return foo;
}

//RVO
Foo MakeFoo2(const std::string& name) {
    return Foo(name);
}

int main() {
    auto foo = MakeFoo("foo1");
    auto foo2 = MakeFoo2("foo2");

    std::cout << "---end---" << std::endl;
  return 0;
}
```

위의 foo의 결과 객체가 `NRVO`의 예시이고 foo2의 결과 객체가 `NRVO`의 대표적인 예시이다.

그렇다면 호출 순서를 알아보자.

1. main의 첫줄에서 `MakeFoo`함수로 인자가 전달된다.
2. `MakeFoo(const std::string&)` 함수 내부에서 기본생성자가 불린다.
3. return 될 때 내부에 생성된 foo 객체의 소멸자가 불리고 `foo` 객체의 복사 생성자가 불릴것이다.
4. main의 두번째줄에서 `MakeFoo2`함수로 인자가 전달된다
5. `MakeFoo2(const std::string&)` 함수에서 return에서 기본 생성자가 호출된다.
6. main의 foo2에 복사생성자가 불린다.

한번 출력된 결과를 살펴보자

```result
This is foo1 constructor.
This is foo1 copy constructor.
This is foo1 desstructor.
This is foo2 constructor.
---end---
This is foo2 desstructor.
This is foo1 desstructor.
```

위와 같이 복사생성자가 불린 것을 확인 할 수 있다. 하지만 foo2의 경우는 복사생성자가 호출되지 않았다.

위의 코드는 Debug 모드에서 실행 한 상태이다. 그렇기 때문에 최적화 수준에 따라 다르게 동작한다.

이 코드를 Release 모드에서 돌리면 어떻게 될까?

```result
This is foo1 constructor.
This is foo2 constructor.
---end---
This is foo2 desstructor.
This is foo1 desstructor.
```

Debug 모드일 때와 다른 출력 결과를 보여주고 있다.

그 이유는 `Release`모드에서는 기본적으로 컴파일러가 최적화를 해주기 때문이다. `MakeFoo`라는 함수에서 생성된 `foo`는 return 시켜 main의 `foo = ` 다음의 우측값으로 넣을 필요 없이 바로 foo에 대입하면 된다는것을 컴파일러가 인지하고 최적화를 시킨것이다. RVO는 컴파일러 최적화와 관계없이 무조건 사용되기 때문에 Debug, Release 모두에서 RVO가 적용된 결과를 보여준다.

`NRVO`는 `RVO`에 속하는 종류로써 예전에는 이러한 `MakeFoo` 라는 함수 내부에 foo라는 이름을 가진 객체는 return 시켜도 최적화 시키지 않았다. 그러나 사람들이 이름을 가지더라도 최적화 시키자고 하였고 이를 NRVO(Named Return Value Optimization)이라고 부르게 되었다. 그래서 ISO/ANSI C++ 위원회에서 1996년 `RVO`와 `NRVO`의 최적화 가능을 발표하고, Visual studio 2005에 포함시키게 되었다.

이처럼 컴파일러는 자신도 모르는 사이에 상황에 맞게 `RVO`, `NRVO` 뿐만 아니라 다양한 최적화 기법들을 이용해서 적절한 코드로 최적화 시키는 작업을 컴파일러단에서 진행하고 있다.
