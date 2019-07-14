---
layout: post
title:  "윈도우10 새로운 터미널 실치하기(프리뷰)"
subtitle: "Installing Windows new terminal preview"
date: 2019-07-13 14:49:30 +0900
background: '/img/Windows/new_terminal.png'
comments: true
catalog: true
categories: Windows
tags : Windows
lastmod : 2019-07-13 14:49:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---
<style>
   post-container li>a {
      font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 800;
      font-size: 18px;
      text-decoration:#800080 !important;
      border-bottom : 1px solid blue;
   }
</style>

<div class="contentTitle">
Windows new terminal
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

### 첫 contribution

1. gerrit에 아이디 생성
2. Setting에서 필요한 아이디 추가 및 인증(기본 email 사용시 유지) 
![image](https://media.oss.navercorp.com/user/14633/files/19ef0300-9e74-11e9-9055-ecb70dc55533)

그 후 AUTHORS파일에 등록된 이메일 추가
★ 중요한 점은 이전 페이지의 prefer 선택한 email과 AUTHORS파일에 들어가는 이메일이 동일해야 한다.  

![image](https://media.oss.navercorp.com/user/14633/files/25dac500-9e74-11e9-9bc9-fbe2bf36d3fa)

또, CLA(위법 및 부적절한 행동 시 법적 처벌 및 조약) 동의
[크로미움 Legal stuff 사이트](https://chromium.googlesource.com/chromium/src/+/master/docs/contributing.md#Legal-stuff) 에서 [LCA동의](https://cla.developers.google.com/about/google-individual?csw=1 )가 필요하다.

### code upload

Chromium은 dept_tools 안에 있는 cl(code list)툴을 이용한다.
git cl format   <- 코드 포맷팅
git cl upload   <- 코드리스트 업로드

그 후 기록 창이 뜨면 bug 부분에 crbug의 issue 번호를 넣어준다.

Upload가 완료되면 gerrit 사이트에 자신이 올린 내용이 보이게 된다.
들어가서 FIND OWNERS를 누르고

![image](https://media.oss.navercorp.com/user/14633/files/84a03e80-9e74-11e9-8dae-d8e8c6396d21)

리뷰를 받고싶은 분을 체크 후 Apply를 누르면 리뷰어가 등록되고, start review 버튼을 통해 글을 작성하면 된다.
https://oss.navercorp.com/whale/crbug-pick

## Chromium contribution <br/>#648382: Eliminate View::AddChildView(View*) (only expose unique_ptr version)

AddChildView에게 uinque_ptr을 넘겨줌으로써 ViewTree에서 부모트리가 죽으면 하위 트리가 제거되도록 Ownership 이양하는것이 목적
```cpp
view->owned_by_client()
//"This should only be called if the client is passing ownership of |view| to the parent View.";
//오너쉽 관점에서 매우 중요!
```
이러한 작업을 통해서 차후엔 ` T* AddChildView(T* view)`대신  `T* AddChildView(std::unique_ptr<T> view) `만 사용하도록 하는것이 중요
AddChildView를 호출함으로써 자식이 부모에게 Ownership을 이양하는것이다.
=> Ownership은 ViewTree로 전달해 부모가 가지고 return 된 raw pointer을 사용만하기 위함.