---
layout: post
title:  "Ajax를 이용한 이용한 데이터 전달받기"
subtitle: "Data Transfer Using Ajax"
date:   2017-06-05 14:23:30 -0900
background: '/img/posts/07.jpg'
comments: true
categories: WEB
tags : WEB
lastmod :   2019-04-08 14:30:10 -0900
sitemap :
changefreq : daily
priority : 1.0
---
<style>
.center {
    display: block;
    margin: auto;
}
</style>

# Ajax를 이용한 이용한 데이터 전달

```javascript
<script>
$(function(){    
    var out;
    $("#user_login").click(function(){        
        var data_param ="input_id="+$("#user_id").val() + "&" + "input_pw="+$("#user_pw").val();        
        $.ajax({
            type : "post",
            url : "loginCheckDB.jsp",            
            data : data_param,
            success : function(result){        
                    var p = result.trim();
                    if(p == 1){/* 로그인성공  */
                        <%%>
                    }
                    else if(p == 2)
                        alert("로그인 실패!");                                        
            }
        });
    });
});
</script>
```

```java
    String userID = request.getParameter("input_id");
    String userPW = request.getParameter("input_pw");
    System.out.println(userID + " " + userPW);
    pstmt.setString(1, userID);
    pstmt.setString(2, userPW);
    ResultSet rs = pstmt.executeQuery();
    if(rs.next() == false){
        System.out.println("로그인성공");
        out.println("1");/*  로그인성공  */
        request.getSession().removeAttribute("loginID");
        request.getSession().setAttribute("loginID",userID);
    }
    else{            
        out.println("2");/*  로그인실패 */        
    }
```


loginCheckDB.jsp로 post 형태로 data_param을 요청 성공하면 sussess로 결과를 받아올 수 있다.