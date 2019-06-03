---
layout: post
title:  "상수(const, constexpr, literal constant, symbolic constant...)"
subtitle: "Constant(const, constexpr, literal constant, symbolic constant...)"
date: 2019-06-02 21:17:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-06-02 21:17:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
상수 이해하기
</div>

## 상수(Constant)

상수란 변수와 마찬가지로 데이터를 저장 할 수 있는 메모리 공간을 뜻한다.
그러나 상수가 변수와 다른점은 한번 값이 정해지면 프로그램이 실행되는 동안 저장된 데이터를 변경하지 못한다는 것이다.

C++에서는 이름이 붙냐 붙지 않느냐에 따라 상수를 2가지로 나누어 분류할 수 있다.

1. 리터럴 상수(literal constant)
2. 심볼릭 상수(symbolic constant)

또한 컴파일 시간인지, 런타임 시간에 결정되는 상수인지에 따라서도 2가지로 분류가 가능하다.

1. 런타임 상수(Runtime constant)
2. 컴파일 시간 상수(Compile-time constant)

### 리터럴 상수(literal constant)

리터럴 상수(literal constant)는 변수와는 다르게 데이터가 저장된 메모리 공간을 가리키는 이름을 가지고 있지 않는다.
C++에서는 적절한 메모리 공간을 할당받기 위하여, 기본적으로 변수든 상수든 타입을 가지고 있다.
C++에서 상수는 타입에 따라 정수형 리터럴 상수, 실수형 리터럴 상수, 문자형 리터럴 상수 등으로 구분 가능하다.

#### 정수형 리터럴 상수

정수형 리터럴 상수는 `123`, `-456`과 같이 아라비아 숫자와 부호로 표현된다.
또한 C++에서는 정수형 상수를 10진수뿐만 아니라 8진수나 16진수로 표현할 수도 있다.

```cpp
int a = 10;
cout << "숫자 10을 10진수로 표현하면 " << a << "이며, " << endl;
cout << oct;
cout << "숫자 10을 8진수로 표현하면 " << a << "이며, " << endl;
cout << hex;
cout << "숫자 10을 16진수로 표현하면 " << a << " 입니다.";
```

위 부분에서 `int a = 10`의 `a`는 변수이고 `10`이라는 숫자를 리터럴 상수라고한다. `10`은 정수 형태이므로 정수형 리터럴 상수가 된다.
위에서 설명했듯이 `10`이라는 데이터가 들어갈 공간은 이름을 가지고 있지 않기 때문에 리터럴(Literal, 문자 그대로라는 의미) 상수가 되는것이다. 이러한 상수를 변수에 대입 시킴으로서 변수 `a`가 값을 가지게 된다.

---

#### 실수형 리터럴 상수

실수형 리터럴 상수는 3.14, -45.6과 같이 소수 부분을 가지는 아라비아 숫자로 표현된다.
실수형 리터럴 상수는 모두 부동 소수점 방식으로 저장된다.

```cpp
double PI = 3.141592;
```

---

#### 문자형 리터럴 상수

문자형 리터럴 상수는 'a', 'Z'와 같이 따옴표('')로 감싸진 문자로 표현된다.

```cpp
char a = 'a';
```

---

#### 이진 리터럴 상수

c++14 부터는 `0B` 또는 `0b` 접두사와 0 또는 1의 시퀀스를 붙혀 이진 리터럴 상수를 표현 할 수 있다.

```cpp
auto b = 0B1010;//10
```

---

### 심볼릭 상수(symbolic constant)

심볼릭 상수는 변수와 마찬가지로 이름을 가지고 있는 상수이다.  
심볼릭 상수는 선언과 동시에 반드시 초기화해야 하며 위의 리터럴 상수를 대입시킨 변수를 `const` 한정자를 통해 값을 수정 할수 없게 만드는 상수로 선언 할 수 있다.  
이러한 심볼릭 상수는 매크로를 이용하거나, `const` 한정자를 사용하여 선언할 수 있다.  
하지만 매크로를 이용한 선언은 C언어의 문법이므로, C++에서는 가급적 `const` 한정자를 사용하여 선언해야한다.
`const`는 상수 변수를 정의할 때 초기화(initialization)해야 하며, 할당(assignment)을 통해 값을 변경할 수 없다.

### 매크로를 이용한 선언

```cpp
#define MAX_AGE 50
```

위의 코드는 매크로를 이용하여 `MAX_AGE`를 50으로 변환해 넣어준다.
컴파일을 하게 되면 전처리기는 모든 `MAX_AGE`가 사용된 부분을 50으로 바꿔넣어주게 되는것이다. 하지만 이와같은 매크로를 이용한 선언은 2가지 문제점이 있다.

1. 컴파일 에러등이 발생하면 MAX_AGE가 문제로 나타나는것이아니라 50이라는 숫자가 문제로 나타날 수 있기 때문에 오류를 찾는데에 많은 시간이 발생 할 수 있다. 즉, 매크로로 선언된 내용은 디버거에 표현되지 않는다.
2. #define된 값은 유효범위가 존재하지 않기 때문에 한번 define 되면 undef 될때까지 범위내에 존재하기 때문에 나중에 define 된 값과 충돌이 발생 할 수 있다.

그렇기 때문에 매크로가 아닌 `const` 등의 한정자 선언을 통한 심볼릭 상수 선언을 권장한다.

```cpp
const int AGE = 30;
```

`constexpr`이라는 한정자또한 존재하는데, 이는 C++11에 추가되었다.

```cpp
constexpr int AGE = 30;
```

둘의 차이는 분명하다.

`const`는 런타임 상수(Runtime constant)이며 `constexpr`은 컴파일 시간 상수(Compile-time constant)이다.

```cpp
int i = 10, int j = 20;//OK
const int AGE = 30; //OK
const int AGE2 = i + j; //OK
constexpr int AGE3 = 26;//OK
constexpr int AGE4 = i + j;//ERROR!
constexpr int AGE4 = 10 + 16;//OK
constexpr int a = 20, b = 30;//OK
constexpr int AGE5 = a + b;//OK
```
위처럼 `constexpr`이라는 한정자는 컴파일 시간에 값이 결정되어야 하기 때문에 런타임중 값이 결정되는 i, j를 통한 초기화가 불가능하다.그밖에 사용자의 키보드 입력등으로 런타임중에 정해지는 값들 또한 `constexpr`에 사용 할 수 없다.

```cpp
int GetNum() { retun 5; }
int Numbers[ GetNum() ];
```

위의 코드는 C++03에서는 오류를 발생한다. 하지만 C++11에서 추가된 컴파일 시간 상수 한정자인 `constexpr`을 이용하여 함수에 적용시킬 수 있다.

```cpp
constexpr int GetNum() { retun 5; }
int Numbers[ GetNum() ];
```

이러한 장점이 존재하기 때문에 아래와 같은 깔끔한 코드를 만들 수 있다.

```cpp
constexpr double power( double x, unsigned int y ){
    return y == 1 ? x : x * power( x, y - 1 ) ;
}
int main(){
    constexpr double a = power( 2, 32 );
    double x = 2 ; unsigned int y = 32;
    double b = power( x, y );
}
```

또한 여러 변수를 컴파일 시간에 계산해서 적용 시킬 수도 있게된다.

```cpp
const int base_HP = 200;
int NPC_Lv1_HP = base_HP + 0;
int NPC_Lv2_HP = base_HP + 200;
```

```cpp
constexpr int AssignHP( int nPlusHP ){
 return base_HP + nPlusHP;
}
int NPC_Lv1_HP = AssignHP( 0 );
int NPC_Lv2_HP = AssignHP( 200 );
```

이러한 코드를 컴파일 시간에 선언 및 초기화를 해 놓을 수 있게 된다.

`constexpr`은 컴파일 할 때 결과가 이미 결정 나는 것은 컴파일 타임 때 처리를 해주어 실행 시에 불필요한 처리를 막아주고, 기존의 메타 템플릿 프로그래밍으로 까다롭게 만들었던 것을 아주 쉽게 구현할 수 있게 해준다.  
또한 이러한 컴파일 시 정해지는 상수는 런타임중에 메모리를 할당받는것이 아니기 때문에 성능적인 측면에서도 향상 시킬 수 있다.


### References

<pre>
<a href="http://tcpschool.com/cpp/cpp_datatype_constant">http://tcpschool.com/cpp/cpp_datatype_constant</a>
<a href="https://docs.microsoft.com/ko-kr/cpp/cpp/constexpr-cpp?view=vs-2019">https://docs.microsoft.com/ko-kr/cpp/cpp/constexpr-cpp?view=vs-2019</a>
<a href="https://jacking.tistory.com/1010">https://jacking.tistory.com/1010</a>
</pre>
