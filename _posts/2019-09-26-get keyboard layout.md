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

#define ARRSIZE(arr) (sizeof(arr)/sizeof(*(arr)))

using namespace std;
#define LID_TRADITIONAL_CHINESE  0x0404
#define LID_JAPANESE      0x0411
#define LID_KOREAN        0x0412
#define LID_SIMPLIFIED_CHINESE  0x0804 

int main()
{
  HKL hKeyboardLayout = 0;
  wchar_t localeName[100] = { 0 };
  cout << "Calling GetUserDefaultLocaleName" << endl;
  int ret = GetUserDefaultLocaleName(localeName, ARRSIZE(localeName));
  wcout << localeName << endl;

  if (hKeyboardLayout == 0)
    hKeyboardLayout = GetKeyboardLayout(0);
  if (LOWORD(hKeyboardLayout) == LID_KOREAN)
    cout << "kor";
  else
    cout << "else";

  return 0;
}
```

위의 코드와 같이 `GetKeyboardLayout`를 이용하여 키보드의 현재 IME 값을 가져 올 수 있다.
`GetKeyboardLayout`는 

한글은 `0010412`값을 가진다.

또한 `GetUserDefaultLocaleName`을 이용해서 현재 로케일을 확인 할 수 있다.


위의 내용을 응용하여 액티브 된 윈도우의 언어를 확인 할 수 있다.
```cpp
#include <iostream>
#include <Windows.h>
int main()
{
  while (1)
  {
    HWND  _curr_window = GetForegroundWindow();
    DWORD _curr_window_procces_id;
    DWORD _curr_window_thread_id = GetWindowThreadProcessId(_curr_window, &_curr_window_procces_id);
    HKL _key_locale = GetKeyboardLayout(_curr_window_thread_id);
    int n = (int)_key_locale;

    std::cout << "Process ID is " << _curr_window_procces_id << " and Thread ID is " << _curr_window_thread_id << std::endl;
    std::cout << "Keyboard layout is " << n << std::endl;
   }
   return 0;
}
```