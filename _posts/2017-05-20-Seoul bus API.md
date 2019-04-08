---
layout: post
title:  "서울 버스 API 적용하기"
subtitle: "Applying Seoul Bus API"
date:   2017-05-20 16:35:30 -0900
background: '/img/posts/07.jpg'
comments: true
categories: Public-API
tags : Public-API
lastmod :   2019-04-08 14:30:10 -0900
sitemap :
changefreq : daily
priority : 1.0
---

<style>
a{
    white-space: pre-wrap; /* css-3 */    
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */    
    white-space: -o-pre-wrap; /* Opera 7 */    
    word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>


# Seoul bus API 적용하기

1. <a target="_blank" href="https://www.data.go.kr/">https://www.data.go.kr/</a> 들어가서 회원가입 및 로그인

2. <a target="_blank" href="https://www.data.go.kr/dataset/15000314/openapi.do">https://www.data.go.kr/dataset/15000314/openapi.do</a> 활용신청 누르기
<img src="/img/Seoul-bus-API/1.png" width="100%"/>

3. 승인이 되면 <a target="_blank" href="http://api.bus.go.kr/index.jsp">http://api.bus.go.kr/index.jsp</a> 에서 document를 따라 사용



--------------------------------------------------

SERVICE KEY IS NOT REGISTERED ERROR.  라고 뜨는경우

--------------------------------------------------

안녕하세요. 공공데이터포털 운영팀입니다.
인증키 사용에 참고하셔야 하는 사항이 대표적으로 2가지가 있습니다.

1. 발급 된 인증키가 기관에 전달되는 시간 : 평균 1시간에 한번 기관으로 전송됩니다.
2. 인증키 변환 : 인증키는 utf-8 형식으로 URL Encode 된 값으로 입력해야 합니다.
발급받으신 인증키를 사용하여
정상적으로 응답되는 URL 을 구성해보았습니다.
이용에 참고바랍니다.
