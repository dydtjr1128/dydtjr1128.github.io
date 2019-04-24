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
c = c.intern();
System.out.println("a==b : " + (a == b));
System.out.println("a==c : " + (a == c));
```

이 코드의 결과값은 어떻게 나올까?

```java
a.hashCode(), b.hashCode : 3052799 3052799 3052799 //(1)
a==b : true  //(2)
a==c : false //(3)
a.equals(b) : true //(4)
a.equals(c) : true //(5)
a==b : true //(6)
a==c : true //(7)
```

이렇게 출력된다.  
즉, 같은 문자열인 경우 hashcode값(1)은 같지만 리터럴이냐 객체냐에 따라 ==의 결과가 다르게 동작한다.
a와 c의 문자열 값은 같지만 실제 메모리에서의 동작방식이 다르다.
  
String의 문자열 생성방식에는 2가지 방법이 있다.

1. new 연산자를 이용한 방법
2. 리터럴을 이용한 방법

<br>

### 문자열 리터럴이 메모리에서 저장되는 방법

a는 "choi"라고 하는 리터럴 문자열을 a라는 변수에 대입시킨 개념과 같다.
JVM 스택에 생성된 choi라는 변수는 힙 메모리에 생성된 객체를 참조하고, 이 객체는 메모리의 메소드 영역에 있는 상수풀(String Constant Pool)을 참조한다.  
즉, new라는 객체생성연사자를 사용하지 않아도 내부적으로는 객체를 생성한다는 의미이다.
하지만 `String a = "choi";`에서 `"choi"`는 객체에 생성된것이 아닌 상수풀을 참조하는것이다.

<br>

### 문자열 리터럴

문자 리터럴은 상수의 한 종류로써 변하지 않는 (immutable) 중요한 특성이 있다. 이러한 특성 덕분에, 다양한 변수가 있더라도 동일한 문자열을 지닌다면 동일한 객체와 상수풀을 참도 한다.  
그 때문에 같은 문자열인 b또한 상수풀에 생성된 동일한`"choi"`를 참조하고 있는 것이다.
즉, a와 b는 같은 객체를 참조하고 상수풀을 참조하는것이다. ==의 결과 주소값을 비교하고(동일 객체인지) 같은 객체를 참조했기 때문에 위의 출력된 예제(2)가 나오게 되는 것이다.
문자열 리터럴은 내부적으로 `interen()`이라는 메소드를 사용한다.

```java
/**
* Returns a canonical representation for the string object.
* <p>
* A pool of strings, initially empty, is maintained privately by the
* class <code>String</code>.
* <p>
* When the intern method is invoked, if the pool already contains a
* string equal to this <code>String</code> object as determined by
* the {@link #equals(Object)} method, then the string from the pool is
* returned. Otherwise, this <code>String</code> object is added to the
* pool and a reference to this <code>String</code> object is returned.
* <p>
* It follows that for any two strings <code>s</code> and <code>t</code>,
* <code>s.intern()&nbsp;==&nbsp;t.intern()</code> is <code>true</code>
* if and only if <code>s.equals(t)</code> is <code>true</code>.
* <p>
* All literal strings and string-valued constant expressions are
* interned. String literals are defined in section 3.10.5 of the
* <cite>The Java&trade; Language Specification</cite>.
*
* @return  a string that has the same contents as this string, but is
*          guaranteed to be from a pool of unique strings.
*/
public native String intern();
```

자바 내부 API를 살펴보면 위와 같은 코드가 존재하는데 이러한 `intern()` 메소드는 해당 문자열이 상수풀에 이미 있는 경우에는 그 문자열의 주소값을 반환하고 없다면 새로 집어넣고 그 주소값을 반환한다.  
이러한 원리를 통해 문자열 리터럴이 같은 객체와 상수풀을 참조하는것이다.

<br>

### new 연산자를 이용한 문자열이 메모리에 저장되는 방법

```java
String c = new String("choi");
```

위와같이 new를 이용한 객체 생성방법은 매번 new라는 연산자를 이용하여 새롭게 힙영역에 만들어지므로 a,b와 같은 객체라고 할 수 없다.

하지만 아래와 같은 경우는 어떨까?

```java
c = c.intern();
```

이러한 경우는 c라는 객체가 만든 문자열을 상수풀에 등록하는 `intern()`메소드를 호출하였다.그렇기 때문에 상수풀에서 c의 문자열이 존재하지 않는경우 상수풀에 넣게된다. 그후 b가 그 상수풀을 참조하도록 만든다. 그렇기 때문에 a,b,c 모두 같은 객체를 참조하기 때문에 `c==a` 가 `true`가 출력이 되게 된다(7)

<br>

### Appendix
상수풀(Spring Constant Pool)의 위치는 Java 6까지는 Perm영역(Permanent Generation)에 저장되었지만 이 영역은 고정된 용량을 가지고 있어 런타임 중 OutOfMemoryException을 발생시킬 수 있는 문제가 있어 Java 7 부터는 Heap 영역으로 이동 되었다. 또한 이 때부터 상수풀에 들어간 문자열도 GC 대상이 되었다.

<br>
<div class="contentTitle">
요약
</div>

![kafka structure](/img/Java/String literal.png){:width="100%"}{:.center}

### References

<pre>
<a href="http://www.coderanch.com/t/463829/java-programmer-OCPJP/certification/String-literal-String">http://www.coderanch.com/t/463829/java-programmer-OCPJP/certification/String-literal-String</a>
<a href="https://bugs.java.com/view_bug.do?bug_id=6962931">
JDK-6962931 : move interned strings out of the perm gen(Oracle Java Bug Database)</a>
</pre>