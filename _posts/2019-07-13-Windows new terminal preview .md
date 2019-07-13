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

![Windows new terminal preview](/img//Windows/new_terminal.png){:width="100%"}{:.center}

이제까지 써오던 윈도우 기본 터미널은 30년간 바뀐적 없을 정도로 구형의 형태를 가지고 있었다.

그렇기 때문에 다국어 지원등 문자가 제대로 표현되지 않는 등 불편한 점이 많이 존재했다.
그래서 많은 사람들이 hyper, cmder 등 다양한 외부 console terminal 역할을 하는 프로그램을 사용했다.
마이크로소프트에서 마이크로소프트 빌드 2019에 새로운 터미널을 지원하겠다고 발표하면서 많은 주목을 받았다.

- [Youtube Link](https://www.youtube.com/watch?v=8gw0rXPMMPE&app=desktop){: target="_blank" }

### Windows Terminal

이번 터미널은 깃허브에 오픈소스로 개발되며, profile.json 수정을 통해 테마를 꾸밀 수 있다.

- [Github Link](https://github.com/microsoft/terminal){: target="_blank" }

윈도우 터미널은 여러개의 탭 지원, GPU 가속을 이용한 텍스트 렌더링, 설정을 이용한 개인화 등의 기능을 가지고 있다.

![Windows new terminal preview](/img/Windows/terminal_2.png){:width="70%"}{:.center}

또한 다양한 언어를 깨짐 없이 지원가능하고 이모지 등도 사용 가능하다.

![Windows new terminal preview](/img/Windows/terminal_1.png){:width="70%"}{:.center}

현재 윈도우 터미널은 마이크로소프트 스토어에서 프리뷰 버전으로 받아 사용 할 수 있다.

![Windows new terminal preview](/img/Windows/terminal_search.png){:width="100%"}{:.center}

![Windows new terminal preview](/img/Windows/terminal_image.png){:width="100%"}{:.center}

### 사용중인 Profile
- 
 ```json
{
      "acrylicOpacity": 0.5,
      "closeOnExit": true,
      "colorScheme": "Solarized Dark",
      "commandline": "cmd.exe",
      "cursorColor": "#FFFFFF",
      "cursorShape": "bar",
      "fontFace": "D2Coding",
      "fontSize": 14,
      "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
      "historySize": 9001,
      "icon": "ms-appx:///ProfileIcons/{0caa0dad-35be-5f56-a8ff-afceeeaa6101}.png",
      "name": "cmd2",
      "padding": "0, 0, 0, 0",
      "snapOnInput": true,
      "startingDirectory": "%USERPROFILE%",
      "useAcrylic": false
    },
```


### References

<pre>
<a href="https://devblogs.microsoft.com/commandline/introducing-windows-terminal/">https://devblogs.microsoft.com/commandline/introducing-windows-terminal/</a>
</pre>
