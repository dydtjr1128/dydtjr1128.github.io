---
layout: post
title:  "JAVA ThreadFactory"
subtitle: "JAVA ThreadFactory"
date: 2019-12-14 21:14:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Java
tags : Java
lastmod :   2019-12-14 21:14:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### ThreadFactory 살펴보기

`java.util.concurrent.`에 존재하는 `ThreadFactory`는 디버깅 목적으로 사용하기 용이하다. 많은 쓰레드를 사용해야 할 때 각 쓰레드에 대한 정보(id, name)등을 미리 규격화 해놓고 로그를 남기기가 용이하다는 장점이 있다.

```java
package executor;

import java.util.concurrent.TimeUnit;

public class Task implements Runnable {
    @Override
    public void run() {
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

```java
package executor;

import java.util.Date;
import java.util.concurrent.ThreadFactory;

public class MyThreadFactory implements ThreadFactory {
    private final String threadNamePrefix;
    private long threadCounter;
    private StringBuilder builder;

    public MyThreadFactory(String threadNamePrefix) {
        this.threadNamePrefix = threadNamePrefix;
        this.threadCounter = 0;
        this.builder = new StringBuilder();
    }

    @Override
    public Thread newThread(Runnable runnable) {
        Thread thread = new Thread(runnable, threadNamePrefix + "-" + threadCounter++);
        builder.append(String.format("Created thread %d with name %s on %s, Active thread %d %n", thread.getId(), thread.getName(), new Date(), Thread.activeCount()));
        return thread;
    }

    public String getThreadLog() {
        String s = builder.toString();
        builder.setLength(0);
        return s;
    }
}
```

위의 2개의 클래스는 아래의 예제를 실행하기 위한 클래스이다.
`MyThreadFactory`는 `ThreadFactory`를 상속받아 `newThread(Runnable runnable)` 메소드를 오버라이드 한 클래스이다. 이 메소드를 보면 쓰레드 생성 시 필요한 로그를 남기고 있다. 미리 지정한 prefix에 따라 로그를 남길 수 있다.
`Task` 클래스는 `MyThreadFactory`가 만들어 준 Thread를 실행 할 클래스이다. Runnable 인터페이스를 상속받아 오버라이드 하여 내용을 구현하였다.

```java
import executor.MyThreadFactory;
import executor.Task;

public class Main {
    public static void main(String[] args) {
        MyThreadFactory myThreadFactory = new MyThreadFactory("Thread");
        Task task = new Task();
        for (int i = 0; i < 10; i++) {
            Thread thread = myThreadFactory.newThread(task);
            thread.start();
        }
        System.out.println("End");
        System.out.println(myThreadFactory.getThreadLog());
    }
}
```
위처럼 `ThrwadFactory`를 이용하여 스레드를 실행하는 부분은 일반적인 스레드 생성과 큰 차이는 없지만 많은 스레드가 필요한 경우 팩토리를 이용한 구현이 필요하다. 수많은 스레드를 사용하게 될 때, 스레드에 적어 줄 thread id, name 등을 위임쉬켜 깔끔한 코드를 만들 수 있다.

스레드의 생성을 팩토리에게 위임하고, 만든 스레드를 사용하는것이 확장성이 좋은 코드이다.  