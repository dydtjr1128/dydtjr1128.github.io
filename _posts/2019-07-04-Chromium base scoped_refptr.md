---
layout: post
title:  "Chromium의 base::scoped_refptr?"
subtitle: "What is base::scoped_refptr in Chromium"
date: 2019-07-04 21:26:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Chromium
tags : Chromium
lastmod : 2019-07-04 21:26:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
base::scoped_refptr?
</div>

### Intro

Chromium에서는 std::unique_ptr과 base::scoped_refptr을 주로 사용한다.  
Base::scoped_refptr은 shared pointer와 비슷한 개념으로 보면 된다.(래핑x)

### std::shared_ptr vs Base::scoped_refptr

![shared_ptr](/img/Chromium/scoped_refptr/shared_ptr.png){:width="60%"}{:.center}

기존의 std::shared_ptr은

```cpp
auto a = new Widget;
std::shared_ptr<Widget> widget1(a);
std::shared_ptr<Widget> widget2(a);
```

위의 코드에서 Control block이 여러 번 생성되는 이슈가 발생한다.

그렇기 때문에 raw pointer 변수로부터 shared_ptr이 생성되지 않도록 해야한다.

```cpp
std::shared_ptr<Widget> widget3(new Widget)
```

```cpp
auto widget4 = std::make_shared<Widget>();
```

위의 두 코드 중 하나를 사용해야 한다.

![Base::scoped_refptr](/img/Chromium/scoped_refptr/scoped_refptr.png){:width="80%"}{:.center}

Base::scoped_refptr 내부에는 RefCountedThreadSafe와 RefCounted가 존재하고 멀티쓰레드 환경에서의 atomic한 refcount과 하나의 쓰레드를 위한 uint32의 refcount를 변수로 가지고 있어 상황에 맞게 효율적으로 관리가 가능하다.

### References

<pre>
<a href="https://www.chromium.org/developers/smart-pointer-guidelines">https://www.chromium.org/developers/smart-pointer-guidelines</a>
<a href="https://www.slideshare.net/deview/143-modern-c">https://www.slideshare.net/deview/143-modern-c</a>
</pre>
