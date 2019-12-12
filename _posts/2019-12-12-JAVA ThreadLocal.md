---
layout: post
title:  "JAVA 쓰레드 내 공유자원 ThreadLocal 알아보기"
subtitle: "Understanding about threadLocal that can use shared resource in jAVA thread"
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

### ThreadLocal

`ThreadLocal`은 하나의 쓰레드에서 전역으로 관리 할수 있는 변수를 담고 있는 클래스이다. ThreadLocal을 사용한다면 일일히 자식까지 파라미터로 넘겨주지 않아도 데이터를 사용 할 수 있으며 어렵지 않게 사용이 가능하다.

위처럼 쓰레드에서 전역으로 사용할 수 있는 `ThreadLocal`의 사용법은 간단하다.

1. ThreadLocal 객체를 생성한다.
2. ThreadLocal.set() 메서드를 이용해서 현재 쓰레드의 로컬 변수에 값을 저장한다.
3. ThreadLocal.get() 메서드를 이용해서 현재 쓰레드의 로컬 변수 값을 읽어온다.
4. ThreadLocal.remove() 메서드를 이용해서 현재 쓰레드의 로컬 변수 값을 삭제한다.

다음은 `ThreadLocal`을 사용하는 간단한 예제이다.

```java
class Context {
    public static ThreadLocal<StoreData> threadLocal = new ThreadLocal<>();
}

class StoreData {
    private int id;
    private String message;

    StoreData(int id, String message) {
        this.id = id;
        this.message = message;
    }

    @Override
    public String toString() {
        return "StoreData{" + "id=" + id + ", message='" + message + '\'' + '}';
    }
}


class Parent extends Thread {
    private int id;

    Parent(int id) { 
        this.id = id;
    }

    @Override
    public void run() {
        Context.threadLocal.set(new StoreData(id, "This is message."));
        System.out.println(this.getClass().toString() + Context.threadLocal.get().toString());
        Service service = new Service();
        service.printThreadLocal();
        Context.threadLocal.remove();
        //System.out.println(this.getClass().toString() + Context.threadLocal.get().toString());// NullPointerException
    }
}

class Service {
    public void printThreadLocal() {
        StoreData storeData = Context.threadLocal.get();
        System.out.println(this.getClass().toString() + storeData.toString());
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        // InheritableThreadLocal을 이용한다면 set을 여기서 할 수 있음
        Parent parent = new Parent(100);
        Parent parent2 = new Parent(200);
        parent.start();
        parent2.start();

        parent.join();
        parent2.join();
    }
}
```

위처럼 `Parent` 클래스에서 넣어준 데이터를 파라미터로 넘겨주지 않더라도 간단히 사용할 수 있다. 사용을 마치면 필수적으로 `remove()`를 호출해 주어야 다음 사용 시 잘못된 접근을 막을 수 있다.

이처럼 간편하고 유용한 `ThreadLocal` 클래스는 Spring Security에서도 사용 되는데, 인증정보를 `ThreadLocal`을 이용해서 넘겨준다. 그밖에도 트랜잭션 메니저에서도 사용한다.

`InheritableThreadLocal`이라는 ThreadLocal을 상속받아 구현한 클래스를 사용한다면 단일 쓰레드 뿐만 아니라 그 쓰레드에서 생성한 하위 쓰레드 까지도 데이터를 공유해서 사용할 수가 있다.
