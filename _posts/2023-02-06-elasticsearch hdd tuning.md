---
layout: post
title: elasticsearch 하드디스크 튜닝(HDD) tuning
subtitle: elasticsearch HDD tuning
date: 2023-02-06 11:05:10 +0900
background: /img/posts/07.jpg
comments: true
catalog: true
categories: Elasticsearch
tags:
  - Elasticsearch
lastmod: 2023-02-06 11:05:10 +0900
sitemap:
  changefreq: daily
  priority: 1
---
### Elasticsearch에서 HDD 사용시 성능 최적화

하드디스크에서는 물리적으로 데이터를 읽는 방식이 기본적으로 헤드가 돌고있는 플래터를 읽는 Spinning 방식이기 때문에 동시에 여러데이터를 읽지 못한다.
그렇기때문에 한번에 하나의 데이터만 읽을 수 있어 많은 수의 thread로 동시에 읽는 작업은 많은 병합이 생겨 성능을 저하시킨다.

Elasticsearch에서는 그렇기 때문에 `index.merge.scheduler.max_thread_count`값을 1로 변경함에 따라 적절한 셋팅을 할 수 있다.

#### max_thread_count 값 확인

```curl
GET /my-index/_settings/index.merge.scheduler.max_thread_count
```

#### max_thread_count 값 변경

```curl
PUT /my-index/_settings
{
  "index.merge.scheduler.max_thread_count" : 1
}

PUT /_settings
{
  "index.merge.scheduler.max_thread_count" : 1
}
```

Default 값은 `Math.max(1, Math.min(4, <<node.processors, node.processors>> / 2))`를 따른다.

### Reference

<pre>
<a href="https://www.elastic.co/kr/blog/performance-considerations-elasticsearch-indexing">[https://en.cppreference.com/w/cpp/thread/mutex](https://www.elastic.co/kr/blog/performance-considerations-elasticsearch-indexing)</a>
</pre>
