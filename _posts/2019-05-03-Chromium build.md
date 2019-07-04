---
layout: post
title:  "크로미움(Chromium) 빌드하기"
subtitle: "Build Chromium"
date: 2019-05-03 13:33:30 +0900
background: '/img/Chromium/Chromium_bg.png'
comments: true
catalog: true
categories: Chromium
tags : Chromium
lastmod :   2019-05-04 19:17:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---
<style>
   a{
      text-decoration:none !important;
   }
</style>

<div class="contentTitle">
크로미움(Chromium) 빌드하기
</div>

### Intro. 크로미움(Chromium)이란?

![Chromium logo](/img/Chromium/Chromium_logo.png){:width="25%"}{:.center}

크로미움은 2008년 9월 구글이 시작한 오픈 소스 웹 브라우저 프로젝트이다. 그로
많이 사용하는 구글 크롬은 크로미움을 기반으로 만들어진 브라우저이다.
크로미움은 크로미움 소스 코드에서 컴파일 된 브라우저를 뜻하고 크롬은 크로미움 소스코드에 어도비 플래시, 자동 업데이트 등 다양한 기능을 추가해 컴파일 한 브라우저이다.  
그밖에도 크로미움 소스코드는 엣지브라우저, 삼성 인터넷 브라우저, 오페라 브라우저에도 사용이 되었다.

### 1. 환경설정

크로미움을 빌드하기에 앞서 다양한 환경설정을 해주어야 정상적인 빌드가 가능하다.

#### 1.1 필자의 노트북 환경

- OS : Windows 10 64bit
- CPU : i7-7200U
- RAM : 8GB
- SSD : 256GB

#### 1.2 권장 환경

- 64bit 운영체제
- 최소 8GB RAM, 16GB 이상의 RAM 권장
- NTFS포맷의 100GB의 SSD 여유공간, FAT32 는 동작X(GIT 파일이 4GB보다 크므로)
- 비쥬얼스튜디오 최신버전
- 윈도우7 이상(10 추천)

#### 1.3 Visual studio 사전 설정

비쥬얼스튜디오는 2017 또는 2019 버전을 사용해야한다.

![Visual studio setting](/img/Chromium/vs_setting.png){:width="100%"}{:.center}

반드시

- Desktop development with C++
- MFC/ATL support
  
이 두가지 부분은 설치 해주어야 한다.

#### 1.4 depot_tools 사전 설정

1. depot_tools 다운로드 => **[[다운로드 링크]](https://storage.googleapis.com/chrome-infra/depot_tools.zip "depot_tools 다운로드 링크")**
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

### 2. 코드 다운로드

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

### 3. 소스코드 빌드

아래의 컴파일 과정을 거치면 `C:\Users\유저명\chromium\src\out\Default` 경로에 `all.sln` 파일이 생기는데, 이를 실행하면 된다.
그러나 매우 많은 프로젝트가 존재하므로 --filter 옵션을 사용해 필요한 부분만 생성하거나 sublimetext 등을 사용해 open 속도를 줄이는것을 추천한다.(build는 Ninja로 하기 때문에)
빌드는 아래의 3.1(예제코드만), 3.2(크롬빌드)중 하나를 선택해 실행하면 된다.

#### 3.1 예제 코드 빌드

- 소스코드 gen

   ```cmd
   gn args out/Default
   ```

- gen args 설정. 위의 명령어 실행 후 뜨는 메모장에 다음과 같이 기입

   ```text
   is_debug = true
   is_component_build = true
   blink_symbol_level = 0
   ```

- view example 프로젝트만 컴파일

   ```cmd
   gn gen --ide=vs --filters=//ui/views/examples:views_examples_exe out\Default
   ```

   노트북으로 2시간 정도 소요

- 예제파일 실행

   ```cmd
    .\out\Default\views_examples_exe
   ```

#### 3.2 크롬 빌드

- 소스코드 gen

   ```cmd
   gn args out/Default
   ```

- gn args 설정. 위의 명령어 실행 후 뜨는 메모장에 다음과 같이 기입

   ```text
   is_debug = true
   is_component_build = true
   blink_symbol_level = 0
   ```

- 크롬 빌드

   ```cmd
   autoninja -C out\Default chrome
   ```

- 예제파일 실행

   ```cmd
    .\out\Default\Chrome.exe
   ```

### 4. Ninja(Chromium build tool)

닌자(Ninja)는 속도에 중점을 둔 소형 빌드 시스템으로 상위 레벨 빌드 시스템에서 입력 파일을 생성하도록 설계되었고 최대한 빨리 빌드를 실행하기위해 cpu 병렬처리를 한다.
`ninja -j N`
autoninja는 크로미움에서 ninja에 최적화된값을 자동으로 설정하는 툴이다.

#### 4.1 Jumbo_build (Ninja option)

`Jumbo_build = false`

3번에서 gn args 부분에서 위의 옵션을 주지 않는다면 기본적으로 `true` 인 상태로 gen 되게 된다.
점보빌드는 cc파일을 하나로 합쳐서 빌드함으로써 속도를 높이는데 `true`상태로 빌드 시에는 오류가 안 생기는데 `false`로 돌려서 오류가 생길수 있다.
왜냐하면 점보빌드는 cc파일 합칠때 include header파일이 2군데 필요할 때 한군데에만 선언되어 있어도 파일이 합쳐지기 때문에 제대로 동작한다.
그러나 일반적으로 빌드하는 상황에서는 두군데에서 필요하지만 한군데에만 선언되어서 오류가 발생 할 수 있다.

### 5. Visual studio에서 디버깅 하기

```cmd
devenv /debugexe .\out\Default\Chromium.exe
```

그 후 파일-열기-파일 에서 원하는 소스파일 열고 중단점 걸고 위의 시작 을 눌러 프로세스 실행하면 된다.

이렇게 디버깅 하는것의 장점으로는 실행 후 디버그를 거는것이 아닌 실행과정에서의 디버깅 또한 가능하다는 장점이 있다.

## toolbar 수정 결과

![Chromium change](/img/Chromium/change/change_chromium.png){:width="70%"}{:.center}

hello라는 버튼을 toolbar에 추가해 보았다.

### References

<pre>
<a href="https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md">https://chromium.googlesource.com/chromium/src/+/master/docs/windows_build_instructions.md</a>
</pre>