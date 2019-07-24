---
layout: post
title:  "Git에 대해서 알아보자"
subtitle: "Understanding about Git"
date: 2019-07-24 20:01:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Git
tags : Git
lastmod : 2019-07-24 20:01:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Understanding git
</div>

### Intro

Git은 버전 관리에 있어서 정말 중요한 툴이다. 이를 통해서 이전 기록으로 되돌릴 수도, 임시저장도 할 수 있을 만큼 Git을 잘 사용한다면 개발하는데 정말 많은 도움을 줄 수 있다고 생각한다.

### Git config

Git의 config 설정방법에는 system, global, local이 있다.
적용범위
System : 시스템의 모든 사용자와 모든 저장소
Global : 시스템의 특정 사용자
local :  특정 저장소

```bash
git config --system user.name yongseok //모든 사용자 이름 설정
git config --global user.name “Yongseok Choi” //현재 계정 이름 설정, 띄어쓰기
git config --global user.email yongseok.choi@navercorp.com //현재 계정 이메일 설정
git config --global core.editor nano //git 기본 editor 설정
git config --global diff.tool vimdiff //diff tool
```

`git config –list` 명령어를 통해서 모든 git 설정 정보를 볼 수 있다.

### Git Workflow

Git의 각 영역에는 각각 담당하는 영역이 구분지어져 있다.
![Git workflow](/img/Git/git_workflow.png){:width="40%"}{:.center}

- Staging area :  커밋 가능한 파일들의 정보 저장 (.git/index)
- Object database : Commit Object 저장소 ().git/objects)

### Make git repository

```bash
git init // working directory 갖는 저장소 생성
git init -bare// working directory 없는 저장소 생성
Git clone https://github.com/dydtjr1128/RemoteAssistance-Cpp // 해당 remote 저장소에서 가져오는 저장소
```

### Check status of the file

```bash
git status
```

- Untracked : git이 관리하고 있지 않음
- Tracked : git이 관리 중
- Unmodified : 마지막 commit 후 수정되지 않음
- Modified : 마지막 commit 후 수정됨
- Staged : 수정내용을 commit 할 수 있음

### Reference

<pre>
<a href="https://www.slideshare.net/insanehong/gitbasiccommands">https://www.slideshare.net/insanehong/gitbasiccommands</a>
</pre>
