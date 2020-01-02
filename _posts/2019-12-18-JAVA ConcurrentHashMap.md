---
layout: post
title:  "JAVA ConcurrentHashMap"
subtitle: "JAVA ConcurrentHashMap"
date: 2019-12-18 09:05:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Java
tags : Java
lastmod :   2019-12-18 09:05:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---


### ConcurrentHashMap

기존의 멀티쓰레드 환경에서 동기화를 위한 Hashmap은 `Collections.synchronizedMap(new HashMap<>())`을 이용하여 사용하였다.
그러나 단순히 hashmap 내부의 함수를 synchronized 키워드로 감싼 탓에 성능이 현저하게 떨어지는 문제점이 발생하였다. 그래서 java 1.5부터 추가된 `ConcurrentHashMap`은 이러한 문제점을 해결하여 구현되어있다.

ConcurrentHashmap은 훨씬 세밀한 locking 방법을 적용시켜 오버헤드를 줄였다. 하나의 공유자원을 여러개의 세그먼트로 나누고 각 세그먼트별로 다른 락을 거는 기법을`lock striping`이라고 부르는데, 이 기법을 적용시킨 `ConcurrentHashMap`은 기본적으로 16개의 세그먼트로 나뉘어져 있고, 각 세그먼트별로 다른 lock으로 동기화 되도록 만들었다.

```java
ConcurrentHashMap()
ConcurrentHashMap(int initialCapacity)
ConcurrentHashMap(int initialCapacity, float loadFactor)
ConcurrentHashMap(int initialCapacity, float loadFactor, int concurrencyLevel)
ConcurrentHashMap(Map<? extends K,? extends V> m)
```

`ConcurrentHashMap`의 생성자는 위와 같으며 4번째 생성자의 concurrencyLevel을 이용하여 세그먼트 갯수를 정할 수 있다.
여기서 세그먼트 갯수는 분리된 세그먼트당 락을 갖도록 하기 때문데 멀티 쓰레드에서 전체적링 락킹 방법보다 훨씬 효율적이고 뛰어난 성능을 보여준다.

기본값으로는 initialCapacity 는 16, loadFactor는 0.75, concurrencyLevel은 16으로 정해져 있다. 

다음 코드는 `ConcurrentHashMap`과  `Collections.synchronizedMap(new HashMap<>())`의 성능을 비교한 코드 이다.

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class Test {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        int MAP_SIZE = 2;
        Map<String, Integer>[] maps = new Map[MAP_SIZE];
        maps[0] = Collections.synchronizedMap(new HashMap<>());
        maps[1] = new ConcurrentHashMap<>();
        List<String> arrayList = new ArrayList<>();

        for (int i = 0; i < 1000000; i++) {
            String uid = UUID.randomUUID().toString();
            arrayList.add(uid);
            int val = (int) ((Math.random() * Integer.MAX_VALUE) + 1);
            for (int j = 0; j < MAP_SIZE; j++) {
                maps[j].put(uid, val);
            }
        }

        System.out.println("============= containsKey time in multi thread =============");
        AtomicInteger[] atomicIntegers = new AtomicInteger[MAP_SIZE];
        atomicIntegers[0] = new AtomicInteger(0);
        atomicIntegers[1] = new AtomicInteger(0);
        int availableProcessors = Runtime.getRuntime().availableProcessors();
        ExecutorService service = Executors.newFixedThreadPool(availableProcessors);
        Future<?>[] future = new Future[availableProcessors];
        //쓰레드 풀 개수(프로세서 수) 만큼 반복, 모든 쓰레드에 작업 할당
        for (int i = 0; i < availableProcessors; i++) {
            //쓰레드 풀을 이용해 멀티 쓰레드로 Map의 get 메소드 호출
            future[i] = service.submit(() -> {
                for (int j = 0; j < MAP_SIZE; j++) {
                    long st = System.currentTimeMillis();
                    for (int k = 0; k < arrayList.size(); k++) {
                        maps[j].get(arrayList.get(k));
                    }
                    //쓰레드 별 걸린 작업시간 측정 및 추가
                    atomicIntegers[j].addAndGet((int) (System.currentTimeMillis() - st));
                }
            });
        }
        //결과값 대기
        for (int i = 0; i < availableProcessors; i++) {
            future[i].get();
        }
        for (int i = 0; i < MAP_SIZE; i++) {
            //Map 종류별로 걸린 평균시간 출력
            System.out.println(maps[i].getClass().toString() + " " + atomicIntegers[i].get() / availableProcessors);
        }

    }
}

```

```result
============= containsKey time in multi thread =============
class java.util.Collections$SynchronizedMap 1465
class java.util.concurrent.ConcurrentHashMap 157
```

1,000,000개의 랜덤한 데이터를 두 객체에 넣고, 모든 Key를 이용해 값을 가져오는 코드이다. 결과를 보면 `SynchronizedMap`이 `ConcurrentHashMap`에 비해 굉장히 느리다는 것을 알 수 있다.
`ConcurrentHashMap`이 어떠한 상황에서도  `SynchronizedMap`보다 좋은 성능을 보여 주기 때문에 멀티 쓰레드 환경을 고려한다면 `ConcurrentHashMap`을 사용하는것이 좋다.
