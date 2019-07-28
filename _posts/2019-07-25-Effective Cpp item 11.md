---
layout: post
title:  "C++ Operator=에서는 자기대입에 대한 처리가 빠지지 않도록 하자."
subtitle: "Do not take away the treatment of self-admission in Operator="
date: 2019-07-25 20:16:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: EffectiveC++
tags : EffectiveC++
lastmod : 2019-07-25 20:16:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Do not take away the processing of self-admission in Operator=

```cpp
class Bitmap {
public:
   Bitmap(int r, int g, int b) {
      this->r = r;
      this->g = g;
      this->b = b;
   }
private:
   int r;
   int g;
   int b;
};

class Widget {
public:
   Bitmap *bitmap;
   Widget& operator= (const Widget& whs);
};
Widget& Widget::operator= (const Widget& whs) {
   delete(bitmap);
   this->bitmap = whs.bitmap;
}
```

위 코드의 문제점은 무엇일까?

위의코드는 문제가 생길 수 있는 코드이다.  
만약 위의 코드 처럼 구현되어있는 코드에서 아래와 같이 호출이 된다면 문제가 되는 것이다.

```cpp
Widget *temp;
void f(Widget widget) {
   Widget r = *temp;
   r = widget;
}
int main() {
   Widget *widget = new Widget();
   widget->bitmap = new Bitmap(1, 5, 3);
   temp = widget;
   f(*widget);
}
```

위와 같은 코드가 존재한다고 할 때, f라는 함수 내부에서 r과 widget은 같은 객체를 뜻하기 때문에 위의 `operator=`이 불리게 된다.
따라서 Bitmap객체를 delete하고, 두 r과 widget 객체 모두 bitmap을 잃어버리게 되는것이다.

그렇기 때문에 operater을 구현 할 때에는 자기 대입에 대한 처리가 빠져선 안된다.

```cpp
Widget& Widget::operator= (const Widget& whs) {//여기서 &는 참조(reference)
   if(this == &whs) return *this;//여기서 &는 주소값

   delete(bitmap);
   this->bitmap = whs.bitmap;
}
```

위와 같이 같은 객체인지에 대한 예외처리를 통해 문제를 막을 수 있다.
