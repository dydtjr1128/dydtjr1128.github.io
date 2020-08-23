---
layout: post
title:  "WSL2(Windows Subsystem Linux 2) 설치하기"
subtitle: "Install WSL2(Windows Subsystem Linux 2)"
date: 2020-06-01 10:05:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Windows
tags : Windows
lastmod : 2020-06-01 10:05:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### WSL2(Windows Subsystem Linux 2) 설치

공식 지원 버전인 WSL2를 사용하기 위해서는 윈도우 2004 버전(20H1, Build 19041.264)가 필요합니다. 몇 일 전에 공식 버전이 오픈 되었기 때문에 업데이트가 필요합니다.

- [윈도우 업데이트 링크](https://www.microsoft.com/ko-kr/software-download/windows10)

위 링크에서 수동으로 업데이트 할 수 있는 툴을 받을 수 있습니다.

그 후의  WSL2 설치과정은 다음과 같습니다.

1. `윈도우 2004` 업데이트 완료
2. PowerShell 관리자 권한으로 실행
3. 다음 명령 입력

   ```bash
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
   Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
   ```

4. 마켓에서 WSL용 Unbuntu 다운로드 => [Ubuntu 마켓 링크](ms-windows-store://pdp?productId=9NBLGGH4MSV6&ocid=&cid=&referrer=unistoreweb&scenario=click&webig=240968bf-b51b-4194-98f7-d5014cbf6c4b&muid=0190504D4B686AFF1A215E6E4F686CAE&websession=90380ed73ffc4961975e0d2745520c77&tduid=)
5. 다운이 완료되면 마켓에서 실행버튼을 클릭합니다.
6. 우분투 설정을 진행합니다.(계정 및 암호)
   ![ubuntu image](/img/WSL/ubuntu_setting.png){:width="100%"}
7. [우분투 커널 업데이트](https://docs.microsoft.com/ko-kr/windows/wsl/wsl2-kernel)링크에서 WSL 커널을 최신버전으로 업데이트 할 수 있는 툴을 다운로드 및 실행 합니다.
8. 설정 환료 후 PowerShell에서 `wsl --set-version Ubuntu 2`으로 WSL 버전을 2로 설정 해 줍니다.

