---
layout: post
title:  "JAVA String 리터럴과 객체 차이점"
subtitle: "Differences between JAVA String Literal and Object"
date: 2019-04-23 17:26:10 +0900
background: '/img/Kafka/kafka-logo.png'
comments: true
categories: Kafka
tags : Kafka
lastmod :   2019-04-23 17:26:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
String 객체와 String 리터럴
</div>

```java
String a = "choi";
String b = "choi";
String c = new String("choi");
System.out.println("a.hashCode(), b.hashCode : "
 + a.hashCode() + " " + b.hashCode() + " " + c.hashCode());
System.out.println("a==b : " + (a == b));
System.out.println("a==c : " + (a == c));
System.out.println("a.equals(b) : " + a.equals(b));
System.out.println("a.equals(c) : " + a.equals(c));
b = c.intern();
System.out.println(a==b);
System.out.println(a==c);
```

이 코드의 결과값은 어떻게 나올까?

```java
a.hashCode(), b.hashCode : 3052799 3052799 3052799 //(1)
a==b : true  //(2)
a==c : false //(3)
a.equals(b) : true //(4)
a.equals(c) : true //(5)
true //(6)
false //(7)
```

이렇게 출력된다.  
즉,같은 문자열인 경우 hashcode값은 같지만 리터럴이냐 객체냐에 따라 ==의 결과가 다르게 된다.  
a와 c의 문자열 값은 같지만 실제 메모리에서의 동작방식이 다르다.

a는 "choi"라고 하는 리터럴 문자열을 a라는 변수에 대입시킨 개념과 같다.
JVM 스택에 생성된 choi라는 변수는 힙 메모리에 생성된 객체를 참조하고, 이 객체는 메모리의 메소드 영역에 있는 상수풀(String Liberal Pool)을 참조한다.  
즉, new라는 객체생성연사자를 사용하지 않아도 내부적으로는 객체를 생성한다는 의미이다.
하지만 "choi"라는 객체가 아닌 상수풀의

`Literal` 은 하나의 문자열이 생기면 모두 같은 레