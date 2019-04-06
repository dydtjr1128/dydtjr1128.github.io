---
layout: post
title:  "데이터 압축 알고리즘 비교"
subtitle: "데이터 압축 알고리즘 비교"
date:   2018-10-29 16:34:13 -0800
background: '/img/posts/07.jpg'
comments: true
categories: Data compression
tags : Data compression
---

# Data Compression/Decompression

Snappy를 이용하여 이미지를 압축하는 부분을 다루면서, 다양한 압축 알고리즘 이 있으며 각각의 성능 차이가 크다는 것을 알게 되었다.
|  Compressor name 	| Ratio 	| Compression 	| Decompression 	|
|:----------------:	|:-----:	|:-----------:	|---------------	|
|   zstd 1.3.4 -1  	| 2.877 	|   470 MB/s  	| 1380 MB/s     	|
|  zlib 1.2.11 -1  	| 2.743 	|   110 MB/s  	| 400 MB/s      	|
|  brotli 1.0.2 -0 	| 2.701 	|   410 MB/s  	| 430 MB/s      	|
| quicklz 1.5.0 -1 	| 2.238 	|   550 MB/s  	| 710 MB/s      	|
|   lzo1x 2.09 -1  	| 2.108 	|   650 MB/s  	| 830 MB/s      	|
|     lz4 1.8.1    	| 2.101 	|   750 MB/s  	| 3700 MB/s     	|
|   snappy 1.1.4   	| 2.091 	|   530 MB/s  	| 1800 MB/s     	|
|    lzf 3.6 -1    	| 2.077 	|   400 MB/s  	| 860 MB/s      	|
Core i7-6700K CPU @ 4.0GHz, using lzbench, an open-source in-memory benchmark by @inikep compiled with gcc 7.3.0
압축률과 속도가 각각 다르기 때문에 알맞는 상황에 적절한 압축 알고리즘을 사용하여야 한다.