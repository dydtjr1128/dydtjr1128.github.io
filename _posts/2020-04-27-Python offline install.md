---
layout: post
title:  "Python 파일 오프라인 설치"
subtitle: "Install Python file offline"
date: 2020-04-27 17:35:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Python
tags : Python
lastmod :   2020-04-27 17:35:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---
### Install python files offline

오프라인/폐쇄망 환경에서는 특정 라이브러리를 설치하기 위해서는 외부 컴퓨터에서 다운로드 받아 와야 합니다.

다음과 같이 간단한 명령으로 특정 라이브러리에 대한 목록 및 다운로드를 진행 할 수 있습니다.

1. 원하는 라이브러리 설치(ex.`pip install pylint`)
2. 다운로드 목록 및 다운로드 내용을 가져올 폴더로 이동(cmd/bash 이용)
3. 설치된 라이브러리 목록 파일로 저장
   ```python
   python -m pip freeze > requirements.txt
   ```
4. 설치된 기록된 파일명 라이브러리들 다운로드
   ```python
   python -m pip download -r .\requirements.txt
   ```
5. 이 폴더를 통째로 오프라인에서 설치할 컴퓨터로 복사

다운로드 받은 파일들을 옮겨서 그 위치에서 파이썬을 실행 후 다음 명령어를 실행합니다.

```python
python -m pip install --no-index --find-links="./" -r .\requirements.txt
```

위의 명령어로 txt에 기록된 라이브러리들을 쉽게 설치 할 수 있습니다.

#### appendix

위 명령에 대한 옵션값입니다.

```
--no-index                  Ignore package index (only looking at --find-
                            links URLs instead).
-f, --find-links <url>      If a url or path to an html file, then parse for
                            links to archives. If a local path or file://
                            url that's a directory, then look for archives
                            in the directory listing.
```
