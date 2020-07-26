---
layout: post
title:  "엘라스틱 서치 이해하기"
subtitle: "Understanding of Elastic Search"
date: 2020-03-03 09:45:10 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: ElasticSearch
tags : ElasticSearch
lastmod :   2020-03-03 09:45:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

### Intro

엘라스틱 서치는 아파치 루씬 기반의 오픈소스 분산 검색엔진으로 일반적인 관계형 데이터베이스로 처리할 수 없는 언어적 특징을 잘 활용해 검색 할 수 있도록 도와주는 소프트웨어 입니다.

베이스가 되는 아파치 루씬은 자바 언러로 만들어진 오픈소스로 추천 및 전문검색, 색인 검색기능에 특화된 라이브러리 입니다.

이러한 라이브러리를 이용해 만들어진 엘라스틱서치는 검색의 유사성을 조정해 검색제안을 줄 수 있고, 데이터를 샤드에 나눠 클러스터 가능한 서버들간의 균형을 유지할 수 있는등 많은 기능을 담고 있습니다.

### Elastic search vs database

`데이터베이스`로 흔히 알려져 있는 MySQL을 써 본적이 있다면 관계형 데이터 베이스라는 것을 알 수 있을 것입니다. 이러한 관계형 데이터 베이스 뿐만 아니라 다른 데이터 베이스들은 원하는 조건에 해당하는 뛰어난 검색 기능을 갖추고 있습니다.

하지만 본질적으로 `검색엔진`이라고 하는것과는 큰 차이가 존재합니다.

1. 관계형 데이터베이스는 단순 텍스트매칭에 대한 검색기능만을 제공합니다.
   - 최신 MySQL 버전에서는 n-gram 기반의 Full-text 검색을 지원하지만 한글등에 대한 검색에는 아직 빈약합니다.
2. 1번과 비슷한 내용으로 검색엔진에서만 하나의 텍스트를 여러단어로 변형, 동의어 유의어 처리가 가능합니다.
3. 검색의 유사성을 조정해서 검색제안과 같은 기능들을 사용할 수 있습니다.
4. 검색엔진에서는 관계형 데이터베이스에서 불가능한 비정형 데이터의 색인과 검색이 가능합니다.
5. 형태소 플러그인등을 이용하여 자연어 처리가 가능합니다.
6. 역색인이 가능합니다.

이러한 차이 뿐만 아니라 서로 사용하는 용어에도 다음과 같은 차이가 존재합니다.

|    검색엔진    	|   관계형 데이터베이스  	|
|:--------------:	|:----------------------:	|
|  인덱스(index) 	| 데이터베이스(database) 	|
|   샤드(shard)  	|    파티션(Partition)   	|
|   타입(Type)   	|      테이블(Table)     	|
| 문서(Document) 	|         행(Row)        	|
|   필드(Field)  	|       열(Column)       	|
|  매핑(Mapping) 	|     스키마(Schema)     	|
|    Query DSL   	|           SQL          	|


### 1. Install ElasticSearch

엘라스틱 서치는 기본적으로 자바가 필요하기 때문에 자바를 우선 설치 해야 합니다.

그 후에 https://www.elastic.co/kr/downloads/ 링크에서 엘라스틱 서치를 맞는 운영체제로 다운받으면 됩니다.

### 2. Check ElasticSearch

### Reference

<pre>
ElasticSearch in Action
<a href="https://velog.io/@jakeseo_me/%EC%97%98%EB%9D%BC%EC%8A%A4%ED%8B%B1%EC%84%9C%EC%B9%98-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-2-DB%EB%A7%8C-%EC%9E%88%EC%9C%BC%EB%A9%B4-%EB%90%98%EB%8A%94%EB%8D%B0-%EC%99%9C-%EA%B5%B3%EC%9D%B4-%EA%B2%80%EC%83%89%EC%97%94%EC%A7%84">https://velog.io/@jakeseo_me/엘라스틱서치-알아보기-2-DB만-있으면-되는데-왜-굳이-검색엔진</a>
</pre>