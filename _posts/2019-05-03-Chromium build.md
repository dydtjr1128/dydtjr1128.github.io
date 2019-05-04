---
layout: post
title:  "크로미움(Chromium) 빌드하기"
subtitle: "Build Chromium"
date: 2019-05-03 13:33:30 +0900
background: '/img/Chromium/Chromium_bg.png'
comments: true
categories: Chromium
tags : Chromium
lastmod :   2019-05-04 19:17:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
크로미움(Chromium) 빌드하기
</div>


## 크로미움(Chromium)이란?

![Chromium logo](/img/Chromium/Chromium_logo.png){:width="25%"}{:.center}

크로미움은 2008년 9월 구글이 시작한 오픈 소스 웹 브라우저 프로젝트이다. 그로
많이 사용하는 구글 크롬은 크로미움을 기반으로 만들어진 브라우저이다.
크로미움은 크로미움 소스 코드에서 컴파일 된 브라우저를 뜻하고 크롬은 크로미움 소스코드에 어도비 플래시, 자동 업데이트 등 다양한 기능을 추가해 컴파일 한 브라우저이다.  
그밖에도 크로미움 소스코드는 엣지브라우저, 삼성 인터넷 브라우저, 오페라 브라우저에도 사용이 되었다.

## 크로미움(Chromium) 빌드하기

<hr>

### 목차

<a href="#no0">0. 환경설정</a><br>
<a href="#no1">1. 코드 다운로드</a><br>
<a href="#no2">2. 코드 빌드</a><br>
<a href="#no3">3. Visual studio에서 디버깅 하기</a><br>

<h2 id="no0">0. 환경설정</h2>

#### 필자의 노트북 환경

- OS : Windows 10 64bit
- CPU : i7-7200U
- RAM : 8GB
- SSD : 256GB


#### 권장 환경

- 64bit 운영체제
- 최소 8GB RAM, 16GB 이상의 RAM 권장
- NTFS포맷의 100GB의 SSD 여유공간, FAT32 는 동작X(GIT 파일이 4GB보다 크므로)
- 비쥬얼스튜디오 최신버전
- 윈도우7 이상(10 추천)

#### Visual studio 사전 설정

비쥬얼스튜디오는 2017 또는 2019 버전을 사용해야한다.

![Visual studio setting](/img/Chromium/vs_setting.png){:width="100%"}{:.center}

반드시

- Desktop development with C++
- MFC/ATL support
  
이 두가지 부분은 설치 해주어야 한다.

#### depot_tools 사전 설정

1. depot_tools 다운로드 => [[다운로드 링크]](https://storage.googleapis.com/chrome-infra/depot_tools.zip "depot_tools 다운로드 링크")
2. `C:\src`에 압축해제
3. `C:\src\depot_tools` 경로를 환경변수 PATH에 추가
4. ★★ 3번의 내용은 반드시 아나콘다, Python등의 PATH보다 위쪽에 추가되어야함!
5. 환경변수에 `DEPOT_TOOLS_WIN_TOOLCHAIN`, 값은 `0` 추가
6. cmd에 `gclient` 치기 (★★★ 오래걸림)

- 참고
  - 중간에 중단되거나 소스 업데이트가 필요한 경우 입력

   ```cmd
   gclient sync
   ```


<h2 id="no1">1. 코드 다운로드</h2>

- git 설정

   ```cmd
   git config --global user.name "My Name"
   git config --global user.email "my-name@chromium.org"
   git config --global core.autocrlf false
   git config --global core.filemode false
   git config --global branch.autosetuprebase always
   ```

- 소스코드 받을 폴더 생성 및 이동(경로는 달라도 됨)

  ```cmd
   mkdir C:\Users\유저명\chromium && cd C:\Users\유저명\chromium
  ```

- 소스코드 받기(★★★ 굉장히 오래걸림)

   ```cmd
   fetch chromium
   ```

   간혹 중간에 아래와같은 오류를 볼 수도 있다.  
   크로미움 코드가 enterprise의 경로를 우선적으로 잡아서 발생하는 오류이다.

   ![Visual studio setting](/img/Chromium/vs_path_error.png){:width="100%"}{:.center}

   자신이 Visual studio community를 사용중이라면  
   `C:\Users\유저명\chromium\src\build` 경로에 존재하는 `vs_toolchain.py`의 내용을 아래와같이 바꿔주어야 한다.

   ![Visual studio setting](/img/Chromium/vs_toolchain_before_box.png){:width="100%"}{:.center}

   ![Visual studio setting](/img/Chromium/vs_toolchain_after.png){:width="100%"}{:.center}

   그 후

   ```cmd
   gclient sync
   ```

- src로 이동

   ```cmd
   cd src
   ```

<h2 id="no2">2. 코드 빌드</h2>

- 소스코드 gen

   ```cmd
   gn args out/Default
   ```

- gen args 설정. 위의 명령어 실행 후 뜨는 메모장에 다음과 같이 기입

   ```txt
   is_debug = true
   is_component_build = true
   blink_symbol_level = 0
   ```

- 컴파일

   ```cmd
   ninja -C out/Default ui/views/examples:views_examples_exe
   ```

   노트북으로 2시간 정도 소요

- 예제파일 실행

   ```cmd
    .\out\Default\views_examples_exe
   ```

<h2 id="no3">3. Visual studio에서 디버깅 하기</h2>

### References

<pre>
<a href="https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md">https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md</a>
</pre>