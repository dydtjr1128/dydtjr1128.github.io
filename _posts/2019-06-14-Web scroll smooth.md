---
layout: post
title:  "웹 페이지 스크롤 부드럽게 동작하게 만들기"
subtitle: "Make webpage scrolling smooth"
date: 2019-06-10 15:18:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: WEB
tags : WEB
lastmod : 2019-06-10 15:18:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Smooth scroll
</div>

웹페이지에서 스크롤을 부드럽게 동작하기위해서는 2가지 방법이 있다.

### 1. scroll-behavior

간단한 코드로 모든 웹페이지 내의 스크롤을 부드러운 애니메이션 효과를 줄 수 있다.

```css
html {
    scroll-behavior: smooth;
}
```

간단히 위와 같은 css를 주는 것만으로 부드러운 스크롤을 구현 할 수 있다.

주의할 점으로 위의 코드는 `크롬 61`, `파이어폭스 36`, `오페라 48` 버전 이상에서만 지원되며 타 브라우저에서는 지원되지 않는다.

### 2. custom animate javascript

```html
<div id="num1">this is num 1</div>
<div id="num2">this is num 2</div>


<a href="#num1">move to num1</a>
```

```javascript
<script>
  $('a').click(function () {
    $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
    return false;
  });
</script>
```

위와 같은 코드가 존재할때, 위의 자바스크립트를 이용해 `move to num1` 이 적힌 a 태그를 누르면 num2의 위치로 500ms의 속도로 부드럽게 이동하게 된다.

위의 코드는 jquery 1.0 이상부터 지원된다.

### Appendix

그밖에 `WoW.js`, `Headroom.js` 등의 라이브러리를 이용하여 애니메이션 효과를 줄 수 있다.

### References

<pre>
<a href="https://www.w3schools.com/cssref/pr_scroll-behavior.asp">https://www.w3schools.com/cssref/pr_scroll-behavior.asp</a>
<a href="https://api.jquery.com/animate/">https://api.jquery.com/animate/</a>
</pre>
