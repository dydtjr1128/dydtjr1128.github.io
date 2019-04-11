---
layout: post
title:  "데이터 압축 알고리즘 비교"
subtitle: "Data Compression Algorithm Comparison"
date:   2018-10-29 11:34:13 -0900
background: '/img/posts/07.jpg'
comments: true
categories: Data-compression
tags : Data-compression
lastmod :   2019-04-08 14:30:10 -0900
sitemap:
   changefreq: daily
   priority: 1.0
---
<style>
th,td {
    text-align: center;
    vertical-align: middle;
}
h1 {
    white-space: nowrap;
    overflow : hidden;
}
</style>

# Data Compression/Decompression

Snappy를 이용하여 이미지를 압축하는 부분을 다루면서, 다양한 압축 알고리즘 이 있으며 각각의 성능 차이가 크다는 것을 알게 되었다.
<div style="overflow: auto">
<table class="table">
    <thead class="thead-light">
        <tr>
            <th>Compressor</th>
            <th>Ratio</th>
            <th>Compression</th>
            <th>Decompression</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>zstd 1.3.4 -1</td>
            <td>2.877</td>
            <td>470 MB/s</td>
            <td>1380 MB/s</td>        
        </tr>
        <tr>
            <td>zlib 1.2.11 -1</td>        
            <td>2.743</td>
            <td>110 MB/s</td>
            <td>400 MB/s</td>        
        </tr>
        <tr>
            <td>brotli 1.0.2 -0</td>
            <td>2.701</td>
            <td>410 MB/s</td>
            <td>430 MB/s</td>
        </tr>        
        <tr>
            <td>quicklz 1.5.0 -1</td>
            <td>2.238</td>
            <td>550 MB/s</td>
            <td>710 MB/s</td>
        </tr>
        <tr>
            <td>lzo1x 2.09 -1</td>
            <td>2.108</td>
            <td>650 MB/s</td>
            <td>830 MB/s</td>
        </tr>
        <tr>
            <td>lz4 1.8.1</td>
            <td>2.101</td>
            <td>750 MB/s</td>
            <td>3700 MB/s</td>
        </tr>       
        <tr>
            <td>snappy 1.1.4</td>
            <td>2.091</td>
            <td>530 MB/s</td>
            <td>1800 MB/s</td>
        </tr>      
        <tr>
            <td>lzf 3.6 -1</td>
            <td>2.077</td>
            <td>400 MB/s</td>
            <td>860 MB/s</td>        
        </tr>
    </tbody>
</table>
</div>
Core i7-6700K CPU @ 4.0GHz, using lzbench, an open-source in-memory benchmark by @inikep compiled with gcc 7.3.0<br>
압축률과 속도가 각각 다르기 때문에 알맞는 상황에 적절한 압축 알고리즘을 사용하여야 한다.