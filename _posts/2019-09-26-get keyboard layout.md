---
layout: post
title:  "WIN API 키보드 IME 언어 가져오기"
subtitle: "Get keyboard IME language in WIN32"
date: 2019-09-26 17:08:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: WIN_API
tags : WIN_API
lastmod : 2019-09-26 17:08:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### GetKeyboardLyout

```CPP
#include <iostream>
#include <Windows.h>
#include <kbd.h>

int main(int argc, char* argv[])
{
    std::cout << "Keyboard Layout ID: " << GetKeyboardLayout(0) << "\n";
  return 0;
}
```

위의 코드와 같이 키보드의 현재 IME 값을 가져 올 수 있다.

한글은 `0010412`값을 가진다.
