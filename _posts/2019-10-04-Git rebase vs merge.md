---
layout: post
title:  "Git Rebase vs Merge"
subtitle: "Git Rebase vs Merge"
date: 2019-10-04 17:20:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Git
tags : Git
lastmod : 2019-10-04 17:20:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

Git에서 다른 브랜치와 내용을 합칠때 항상 merge와 rebase로 합치는것을 고민한다. 왜냐하면 그 차이를 잘 모르고 있었기 때문이다.

단순히 merge는 merge 커밋만 남고 rebase는 이런 커밋 없이 깔끔하게 합칠수 있다는 정도만 알고 있는 수준이었다. 그래서 이러한 두 병합 방법에 대한 차이와 기능에 대해서 상세히 살펴 보려고 한다.

### Merge

![Git default image](/img/Git/default.png){:width="70%"}{:.center}

위와 같은 커밋 상태가 존재한다고 할 때, `Feature` 브랜치를 `Master` 브랜치에 Merge 해보려고 한다.

![Git merga image](/img/Git/merge.png){:width="70%"}{:.center}

위의 그림은 두 브랜치를 Merge 한 결과이다. 마지막 커밋인 C6과 C4 모두를 가리키는 C7이라는 Merge 된 결과를 담는 커밋이 생성된다.

### Rebase

![Git default image](/img/Git/default.png){:width="70%"}{:.center}

위와 같은 커밋을 이번에는 Rebase 해보자.

```bash
git checkout Feature
git rebase Master
```

![Git merga image](/img/Git/rebase.png){:width="70%"}{:.center}

위의 그림은 두 브랜치를 Rebase 한 그림이다. Rebase를 통해서 Master에 존재하는 커밋을 합칠 수 있다.

Rebase는 Feature에서 변경된 커밋 사항들을 차례로 확인해 순차적으로 합친다.

두 브랜치가 나뉘기 전인 `C3`라는 공통 커밋으로 이동하고, 그 커밋 부터 현재 Checkout 된 브랜치(`Feature`)가 가리키는 커밋(`C6`)까지 diff를 차레로 만든다. 그리고 합칠 브랜치인 Master의 커밋(`C4`)을 가리키게 하고 C5와 C6의 커밋을 차례대로 적용한다. 그렇게 되면 위와 같은 그림을 보여주게된다.

![Git merga image](/img/Git/fast_forward.png){:width="70%"}{:.center}

```bash
git checkout Master
git rebase Feature
```

그 후에 Master 브랜치를 Fast-forward 시켜주면면 된다.

### Reference

<pre>
<a href="https://git-scm.com/book/ko/v2/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-Rebase-%ED%95%98%EA%B8%B0">https://git-scm.com/book/ko/v2/Git-%EB%B8%8C%EB%9E%9C%EC%B9%98-Rebase-%ED%95%98%EA%B8%B0</a>
</pre>
