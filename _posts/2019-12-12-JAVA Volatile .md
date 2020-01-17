---
layout: post
title:  "JAVA Volatile"
subtitle: "JAVA Volatile"
date: 2019-12-12 17:51:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Java
tags : Java
lastmod :   2019-12-12 17:51:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Volatile

C++에도 존재하는 `volatile` 이라는 키워드는 변수 앞에 선언되며 `CPU 캐쉬가 아닌 메모리(RAM)에서 값을 읽거나 쓰도록 설정하는 키워드`이다.

Java는 컴파일러 최적화를 이용해 일반적인 반복된 내용을 줄이는 경향이 있다. 또한 더 빠른 사용을 위해서 non-volatile 변수들은 캐시를 거쳐 메모리에 읽거나 쓸수도 있고 캐시에 기록된 내용을 읽거나 쓸수도 있는데 어디에 쓸지를 보장하지 못한다.
`volatile` 키워드는 이러한 상황을 막고 매번 메모리에서 값을 읽어오도록 만드는 키워드 이다.

### volatile 을 이용한 메모리값의 최신화

```java
public class MyObject {
    public int count = 0;
}
```
위와 같은 형태의 공유 객체인 `MyObject` 가 존재 한다고 할 때, 멀티쓰레드 상황에서 공유 객체의 count 값을 늘린다고 생각해보자. 일반적으로 메모리에 바로 쓰는것이 아닌 보장할수 없는 랜덤한 시간에 캐시에 기록된 내용들이 메모리로 옮겨진다.
그렇기 때문에 다른 쓰레드가 count 값을 1로 만든 상황에서 캐시에 기록하고, 다른 쓰레드에서는 count 값을 0으로 된 값을 메모리에서 읽어올 수 있다. 그후에 1로 만든다면 두 쓰레드 모두 캐시에 1이란 값을 기록하게 된다.

즉, 메인 메모리의 count 값은 0이고, 캐시에는 1로 각각 기록된 상태인 것이다. 하지만 만약 count 가 `volatile int count`로 선언되어 있었다면 두 쓰레드 모두 메인 메모리에서 읽어와 최신화 된 값을 읽어 올 수 있게 된다.

```java
public class MyObject {
    public volatile int count = 0;
}
```


### volatile 은 동기화를 보장할까?

물론 `volatile`키워드는 공유자원에 대한 동기화를 보장하지 않는다. 오직 하나의 쓰레드가 쓰고, 다른 쓰레드가 읽을 때에만 보장된다. 
`volatile` 키워드는 값을 항상 메인 메모리에서 읽고 쓴다. 그리고 실질적으로 가장 최신화 된 값으로 읽어온다는것이지 멀티쓰레드에서 발생하는 공유자원의 동기화는 보장하지 않는다. 그렇기 때문에 동기화를 해 주어야 한다.
또한 기본적으로 메인 메모리에서 읽어오기에 non-volatile 보다 성능적으로 느릴 수 밖에 없다. 그렇기 때문에 최신화 된 값을 필요로 할 때만 사용하는것이 좋다.

`AtomicLong` 클래스의 대표적인 addAndGet 메소드를 살펴보자. `AtomicLong` 클래스는 내부적으로 value 값을 volatile 키워드로 가지고 있다.
```java
class AtomicLong {
...
private volatile long value;
...
}
```

```java
public final long getAndAddLong(Object o, long offset, long delta) {
        long v;
        do {
            v = getLongVolatile(o, offset);
        } while (!compareAndSwapLong(o, offset, v, v + delta));
        return v;
    }
```

그리고 이 값을 while-loop를 돌면서 예상 값과 같아질 때 까지 반복하는 구조를 가지고 있다. 이러한 구조를 CAS 구조라고 하는데 그렇기 때문에 `synchronized` 키워드 없이 멀티쓰레드에서 값을 보장한다.
또한 volatile 키워드를 통해 메모리에만 읽고 쓰기를 함으로써 변수에 가시성을 보장하게 된다.
