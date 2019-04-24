---
layout: post
title:  "자바에서 숫자에 언더바(_) 표시"
subtitle: "Show underscore in JAVA number"
date: 2019-04-15 11:45:13 +0900
background: '/img/posts/07.jpg'
comments: true
categories: Java
tags : Java
lastmod :   2019-04-15 14:20:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

# 자바에서 숫자에 언더바 표시



자바7 이후 버전부터 `_`가 숫자 리터럴의 어디에도 등장할 수 있다. 
그 덕분이 숫자를 끊어 보이게 만들어 가독성을 높일 수 있다.
예를 들어 한국형 표시로 100만원을 `int money = 1_000_000;` 처럼 선언 할 수 있다.

하지만 어디에든 사용할수 있는것은 아니고 4가지 경우에는 `_` 를 넣을 수 없다.

- 숫자의 처음이나 끝
- 소수점 앞,뒤
- F나 L의 앞
- 숫자 문자열이 예상되는 위치


```java
        float f1 = 1_.23456F;           // X; .의 앞에 위치(숫자와 숫자사이_ X)
        float f2 = 1._23456F;           // X; .의 뒤에 위치(숫자와 숫자사이_ X)
        long longNum = 999_99_9999_L;   // O; L의 앞에 위치

        int ex1 = _26;                  // X; 숫자 표현이 아님 (_로 시작 = 변수명)
        int ex2 = 2_6;                  // O;
        int ex3 = 26_;                  // X; 숫자의 끝에 위치 X
        int ex4 = 2_______6;            // O

        int ex5 = 0_x26;                // X; 16진수를 나타내는 0x사이에는 불가능
        int ex6 = 0x_26;                // X; 숫자의 시작에 위치 X
        int ex7 = 0x2_6;                // O; (16진수)
        int ex8 = 0x26_;                // X; 숫자의 끝에 위치 X

        int ex9 = 0_26;                 // O; (8진수)
        int ex10 = 02_6;                // O; (8진수)
        int ex11 = 026_;                // X; 숫자의 끝에 위치 X

        int age = 26;
        long num = 8764827384923849L;
```

<div class="contentTitle">
Appendix
</div>

```java
    int age = 10;
    long countOfStar = 8764827384923849L;
```
long 변수에 값을 대입할 때 대입하는 값이 int 자료형의 최대값인 2147483647 보다 큰 경우 8764827384923849L과 같이 L 접미사(또는 소문자 l, 소문자 'l'은 숫자 1과 비슷하게 보이므로 추천하지 않는다.)를 붙여 주어야 한다. 만약 'L'과 같은 접미사를 누락하면 컴파일 에러가 발생한다.

### References

<pre>
<a href="https://docs.oracle.com/javase/8/docs/technotes/guides/language/underscores-literals.html">Oracle Java docs(Underscores in Numeric Literals)</a>

<a href="https://wikidocs.net/204">https://wikidocs.net/204</a>
</pre>