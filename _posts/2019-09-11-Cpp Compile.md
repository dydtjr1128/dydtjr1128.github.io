---
layout: post
title:  "C++ Compile 과정"
subtitle: "C++ Compile process"
date: 2019-09-11 17:42:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-09-11 17:42:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

C++ 코드를 작성하고 실행하는 과정이 어떻게 되는지 알아보려고 한다.

컴퓨터는 0과 1로만 이루어진 기계어만 이해 할 수 있기 때문에 상대적으로 개발자가 만들기 쉬운 C++로 만들어진 코드를 변환해 주어야 한다. 이러한 역할을 컴파일러가 담당한다.

### Compile process

우리가 c++ 코드로 작성한 파일이 실행 가능한 파일로 바뀌는 과정은 다음과 같다.

다음은 GCC의 컴파일 과정이다.

![C++ compile process](/img/Cpp/compile_process.png){:width="60%"}{:.center}

1. 전처리기가 cpp파일과 header파일을 읽어와 인라인 시키고 전처리 된 .i파일로 만든다.
2. 컴파일러는 이 .i파일을 컴파일 해 기계어와 가장 유사한 상태인 어셈블리어로 변환된 .s 파일을 생성한다.
3. 어셈블러는 .s파일을 어셈블 해 2진수로 이루어진 기계어로 된 .o 파일을 생성한다.
4. 링커는 만들어진 .o파일을 이용해 실행 파일로 변환한다. 이 링크 과정에서 각 .o 파일의 관계가 서로 연결되고 필요로 하는 라이브러리도 함께 코드화되어 실행 가능한 파일이 만들어진다.
