---
layout: post
title:  "크로미움 컨트리뷰션 프로세스"
subtitle: "Chromium contribution process"
date: 2019-07-13 14:49:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Chromium
tags : Chromium
lastmod : 2019-07-13 14:49:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Chromium contribution process
</div>

### Intro

## Chromium Contribution process

사이트 분류

- 이슈 트래커 - crbug
- 코드 서치 - cs
- 리뷰 시스템 - gerrit-cr
- CI / Build bot(CQ) status – tree

크게 4단계 과정을 거친다.

1. Contribution할 거리를 찾기(https://bugs.chromium.org/p/chromium/issues/list)
2. 패치를 만들기
3. 리뷰를 받고 수정
4. 랜딩

### Start contribution

1. gerrit에 아이디 생성
2. Setting에서 필요한 아이디 추가 및 인증(기본 email 사용시 유지)
![Chromium email certification](/img//Chromium/contribution/1.png){:width="100%"}{:.center}

그 후 AUTHORS파일에 등록된 이메일 추가
★ 중요한 점은 이전 페이지의 prefer 선택한 email과 AUTHORS파일에 들어가는 이메일이 동일해야 한다.  

![Chromium author](/img//Chromium/contribution/2.png){:width="100%"}{:.center}

또, CLA(위법 및 부적절한 행동 시 법적 처벌 및 조약) 동의
[크로미움 Legal stuff 사이트](https://chromium.googlesource.com/chromium/src/+/master/docs/contributing.md#Legal-stuff) 에서 [LCA동의](https://cla.developers.google.com/about/google-individual?csw=1 )가 필요하다.

### code upload

Chromium은 dept_tools 안에 있는 cl(change list)툴을 이용한다.

- `git cl format`   <- 코드 포맷팅
- `git cl upload`   <- 코드리스트 업로드

그 후 기록 창이 뜨면 bug 부분에 crbug의 issue 번호를 넣어준다.

Upload가 완료되면 gerrit 사이트에 자신이 올린 내용이 보이게 된다.
들어가서 FIND OWNERS를 누르고

![Chromium email certification](/img//Chromium/contribution/5.png){:width="100%"}{:.center}

리뷰를 받고싶은 분을 체크 후 Apply를 누르면 리뷰어가 등록되고, start review 버튼을 통해 글을 작성하면 된다.
