---
layout: post
title:  "React에서 MobX 사용하기"
subtitle: "Use MobX in React"
date: 2019-09-06 13:50:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: React
tags : React
lastmod : 2019-09-06 13:50:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### 1. Intro

React에서는 State와 Props를 간편하게 관리 및 적용하기 위한 라이브러리인 `MobX`가 존재한다. 이를 `Functional component`에서 적용하는 방법을 이해해 보려고 한다.

### 2. Start MobX

MobX는 부모에서 자식으로 전파가 가능할 뿐만 아니라 반대로 자식에서 부모로 이벤트를 알려 줄 수 있다는 점에서 유용하다.

#### 2.1 Install MobX

```npm
npm install react-mobx-lite
```

#### 2.2 Observer

```jsx
import { observable } from 'mobx'
import { Observer, useObserver, observer } from 'mobx-react' // 6.x or mobx-react-lite@1.4.0
import ReactDOM from 'react-dom'

const person = observable({
  name: 'John',
})

// named function is optional (for debugging purposes)
const P1 = observer(function P1({ person }) {
  return <h1>{person.name}</h1>
})

//unnamed function
const P1b = observer(({ person }) => <h1>{person.name}</h1>)

const P2 = ({ person }) => <Observer>{() => <h1>{person.name}</h1>}</Observer>

const P3 = ({ person }) => {
  return useObserver(() => <h1>{person.name}</h1>)
}

ReactDOM.render(
  <div>
    <P1 person={person} />
    <P1b person={person} />
    <P2 person={person} />
    <P3 person={person} />
  </div>,
)

setTimeout(() => {
  person.name = 'Jane'
}, 1000)
```

기본적으로 위와 같이 4가지 방법을 이용하여 observer를 적용할 수 있다.

### Inject

`Inject`는 store에 저장된 내용을 불러오고, 주입 시켜주는 역할을 한다.

```jsx
const ChattingTemplate = inject("chat")(props => {
    const [clientRef, setClientRef] = useState(null);
    const [clientConnected, setClientConnected] = useState(null);
    const onMessageReceive = (msg, topic) => {
        props.chat.data.push(msg);
        console.log("send message : " + topic + JSON.stringify(msg));
    }
    return (
        <Fragment>
            <div>
                <ChattingList />
                <InputForm />
            </div>
         </Fragment>
    );
});
```

위와 같이 특정 이벤트에 대해 chat이라고 하는 store에 저장된 것을 주입시키고, 사용 할 수 있다.

### Reference

<pre>
<a href="https://mobx-react.js.org">https://mobx-react.js.org</a>
</pre>
