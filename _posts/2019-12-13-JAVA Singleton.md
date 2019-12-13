---
layout: post
title:  "JAVA Singleton(싱글톤) 구현 방법"
subtitle: "JAVA Singleton"
date: 2019-12-13 16:30:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Java
tags : Java
lastmod :   2019-12-13 16:30:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---


### Singleton 객체 생성 방법

Singleton 패턴을 적용하는 방법은 무척이나 많지만 그중에서 Thread-safe를 보장하고 빠른 성능을 보여주는 방법은 몇가지 없다. 그 중에서 가장 유명한 2가지 방법을 이해해 보려고 한다.

#### Eager initialization

```java
/**
 * Blog : https://dydtjr1128.github.io/
 * Github : https://github.com/dydtjr1128
 */
public class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();

    public static EagerSingleton getInstance() {
        return INSTANCE;
    }

    private EagerSingleton() {
        System.out.println("EagerSingleton Constructor");
    }

    public static void print() {
        System.out.println("EagerSingleton.print()");
    }
}
```

위의 코드는 싱글턴 객체를 Classloader가 클래스를 읽어오는 시점에 무조건 객체를 생성한다. 그렇기 때문에 사용하지 않더라도 객체가 생기는 문제가 발생한다.
그렇기 때문에 이른 초기화(Eager initialization) 방법이라고 부른다.
이 방법을 이용한 객체 생성 과정은 다음과 같다.

1. getInstance() 호출
2. EagerSingleton 클래스 로드
3. EagerSingleton 내부 static 객체 생성
4. `private static final EagerSingleton ex = new EagerSingleton();` 코드 수행
5. getInstance() 수행
6. EagerSingleton 객체 return

#### Lazy initialization

```java
/**
 * Blog : https://dydtjr1128.github.io/
 * Github : https://github.com/dydtjr1128
 */
public class LazySingleton {
    private LazySingleton() {
        System.out.println("LazySingleton Constructor");
    }

    public static LazySingleton getInstance() {
        return LazyHolder.INSTANCE;
    }

    private static class LazyHolder {
        static {
            System.out.println("LazyHolder");
        }

        private static final LazySingleton INSTANCE = new LazySingleton();
    }

    public static void print() {
        System.out.println("LazySingleton.print()");
    }
}
```

늦은 초기화(Lazy initialization) 방법은 이른 초기화와 유사하지만 한번 static class로 감싸 실질적으로 호출 할 때 객체를 생성 하게 된다.
객체가 생성되는 과정은 다음과 같다.

1. getInstance() 호출
2. LazySingleton 클래스 로드
3. LazyHoder.INSTANCE를 만남
4. LazyHolder 클래스 로드
5. LazyHolder 내부 static 객체 생성
6. `private static final LazySingleton INSTANCE = new LazySingleton();` 코드 수행
7. getInstance() 수행
8. LazySingleton 객체 return

이러한 과정을 거치기 때문에 getInstance를 호출 할 때에만 객체가 생성된다. 그렇기 때문에 늦은 초기화 라고 부른다.

```java
public class Main {
    Main() {
        LazySingleton ss = LazySingleton.getInstance();
        EagerSingleton s = EagerSingleton.getInstance();
/*        LazySingleton.print();
        EagerSingleton.print();*/
    }

    public static void main(String[] args) {
        new Main();
    }
}
```

위의 코드를 실행해 보면

```result
LazyHolder
LazySingleton Constructor
EagerSingleton Constructor
```

위와 같은 결과를 보여준다. 하지만 `getInstance()`를 사용한 2 라인을 주석하고 주석되어 있는 `print()`가 호출되는 2줄만 존재하는 상태로 실행 해 보면 다음과 같은 결과를 보여준다.

```result
LazySingleton.print()
EagerSingleton Constructor
EagerSingleton.print()
```

`EagerSingleton.print()`만을 호출했음에도 클래스가 로드되면서 객체까지 생성되어 생성자가 호출되는것을 확인 할 수 있다.

### Summary

2가지 방법 모두 JVM의 `ClassLoader`가 클래스를 로드할 때 직렬화 되어 로드 되기 때문에 원자성을 보장 한다.
이러한 원리를 이용해 Thread-safe하고 효과적으로 객체를 접근 할 수 있도록 구현 되어 있다. 하지만 상대적으로 `Eager Initialization` 방법의 경우는 접근만 하더라도 객체가 생성되는 문제점이 있기 때문에 `Lazy Initialization` 방법을 사용하는것이 좋다.
