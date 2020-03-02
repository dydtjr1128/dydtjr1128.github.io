---
layout: post
title:  "C++ 코드를 추가해서 디버깅하기(중단점)"
subtitle: "Understanding C++ const keyword"
date: 2020-03-02 14:07:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod :   2020-03-02 14:07:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

윈도우 서비스 혹은 특정 프로그램에서는 타이밍에 맞춰서 프로세스를 디버깅하거나 실행한 프로세스를 attach 해서 디버깅하기가 어려운 경우가 많다. 이런 경우 특정 코드를 삽입해서 그 코드가 디버깅 을 할수 있도록 만들어 줄 수 있다.

원리를 설명하자면 vs가 깔려 있는경우 vs에 존재하는 `vsjitdebugger`라는 런타임에 동작하는 컴파일러인 `JIT(just-in-time compilation) 디버거`라는 프로세스를 실행해 연결 시키는 것이다.

#### MyDebug.h

```cpp
#ifndef MY_DEBUG_H
#define MY_DEBUG_H

#include <Windows.h>
#include <iostream>
#include <sstream>

//코드에서 디버깅 하고 싶은 부분에 MyDebug::launchDebugger()를 선언하고 중단점을 걸면 그위치에 중단점이 걸린채로 디버깅이 가능합니다.
class MyDebug {
public:
   static bool LaunchDebugger() {
      // Get System directory, typically c:\windows\system32
      std::wstring systemDir(MAX_PATH + 1, '\0');
      UINT nChars = GetSystemDirectoryW(&systemDir[0], systemDir.length());
      if (nChars == 0) return false; // failed to get system directory
      systemDir.resize(nChars);

      // Get process ID and create the command line
      DWORD pid = GetCurrentProcessId();
      std::wostringstream s;
      s << systemDir << L"\\vsjitdebugger.exe -p " << pid;
      std::wstring cmdLine = s.str();

      // Start debugger process
      STARTUPINFOW si;
      ZeroMemory(&si, sizeof(si));
      si.cb = sizeof(si);

      PROCESS_INFORMATION pi;
      ZeroMemory(&pi, sizeof(pi));

      if (!CreateProcessW(NULL, &cmdLine[0], NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) return false;

      // Close debugger process handles to eliminate resource leak
      CloseHandle(pi.hThread);
      CloseHandle(pi.hProcess);

      // Wait for the debugger to attach
      while (!IsDebuggerPresent()) Sleep(100);

      // Stop execution so the debugger can take over
      DebugBreak(); // 사용여부 결정 이후 중단점 부터 동작하고 싶다면 여기 부분 주석
      return true;
   }
};
#endif // MY_DEBUG_H
```

위와 같은 헤더 파일을 추가함으로써 첫번째 단계는 끝이 났다. 위의 코드를 호출함으로써 그 위치에서 프로세스를 자동적으로 visual studio에 attach 해주고 디버그를 할 수있도록 만들어 준다.

```cpp
#include <iostream>
#include "MyDebug.h"

int main() {
   MyDebug::LaunchDebugger();
   std::cout << "hello" << std::endl;

   for (int i = 0; i < 10; i++) {
      std::cout << "hello" << i << std::endl;
   }
}
```

위와 같은 코드가 있다면 `MyDebug::LaunchDebugger()`가 선언된 줄을 만날 때 디버거가 실행되고, 선택 후 중단점이 걸린 채 프로세스를 해당 visual studio에 attach 할 수 있다.

코드를 실행하면 다음과 같은 화면을 만날수 있고, 일치하는 코드의 visual studio에 attach할 수 있다.

![Process attach](/img/Cpp/debug/attach/attach1.png){:width="40%"}{:.center}

![Process attach](/img/Cpp/debug/attach/attach2.png){:width="40%"}{:.center}

