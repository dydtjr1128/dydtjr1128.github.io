---
layout: post
title:  "스마트 포인터(Smart Pointer) 란?"
subtitle: "What is Smart Pointer?"
date: 2019-05-10 18:17:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: CPP
tags : CPP
lastmod : 2019-05-30 15:31:30 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

<div class="contentTitle">
Smart pointer
</div>

## Smart pointer(C++11)

스마트 포인터에는 크게 다음 3가지의 포인터가 존재한다.

- unique_ptr
- shared_ptr
- weak_ptr

C++03의 `auto_ptr`은 `unique_ptr`을 만들려던 시도의 실패작이므로 사용해선 안된다.

### 1. unique_ptr

![unique_ptr](/img/Cpp/unique_ptr.png){:width="50%"}{:.center}

`unique_ptr`는 모던 C++에 속한 스마트 포인터 3가지 중 하나로서 `std` 네임스페이스에 속해있고 `<memory>` 헤더파일에 속한 표준 포인터이다.
다수의 인스턴스가 하나의 객체를 가르키는것은 프로그램 구조상 복잡해 지기 때문에 하나의 소유자만을 허용하기 위한 용도이다.
새 소유자로 이동은 가능하지만 복사하거나 공유할 수 없습니다. `unique_ptr`은 `c++03`의 사용하지 않는 `auto_ptr`을 대체합니다.

#### unique_ptr Example

```cpp
#include <memory>
#include <vector>
#include <list>
#include <string>
#include <stdio.h>

using namespace std;
class Song {
private:
	string title;
	string artist;
	unique_ptr<list<string>>  producers;//Song class는 unique_ptr을 소유.
public:
	// list<string> 기본 생성자와 make_unique를 이용한 초기화
	Song(string artist, string title) : producers(make_unique<list<string>>()) {
		this->artist = artist;
		this->title = title;		
	}
	string getTitle() {
		return title;
	}
	string getArtist() {
		return artist;
	}
};
unique_ptr<Song> SongFactory(const string& artist, const string& title)
{
	return make_unique<Song>(artist, title);
}

void SongVector()
{
	vector<unique_ptr<Song>> songs;
	//unique_ptr 생성 및 vector에 추가
	songs.push_back(make_unique<Song>("Anne-Marie", "2002"));
	songs.push_back(make_unique<Song>("Namie Amuro", "Funky Town"));
	songs.push_back(SongFactory("Twice","FANCY"));

	auto song = make_unique<Song>("Ayumi Hamasaki", "Poker Face");
	
	unique_ptr<Song> song2 = std::move(song);//song은 "Ayumi Hamasaki" & "Poker Face"에 접근 할 수 없다.
	
	//songs.push_back(song2);//에러! song2는 song2라는 레퍼런스가 연결을 맺고 있으므로 move를 통해 연결을 옮겨주어야 한다.
	songs.push_back(std::move(song2));

	for (const auto& song : songs)
	{
		printf("Artist: %15s Title: %s\n", song->getArtist().c_str(), song->getTitle().c_str());
	}
	
	song.reset(); // song이 가리키고 있는 메모리 영역을 삭제함.
}
int main() {
	SongVector();
}
```

### 2. shared_ptr

![shared_ptr](/img/Cpp/shared_ptr.png){:width="50%"}{:.center}
`shared_ptr`은 둘 이상의 소유자가 메모리에 있는 객체를 공유하는 C++ 표준 라이브러리의 스마트 포인터이다. `shared_ptr`을 초기화한 후 복사, 함수 인수의 값으로 전달 및 다른 `shared_ptr` 인스턴스로 할당할 수 있다. 모든 인스턴스는 동일한 객체를 가리키고 새 `shared_ptr`이 추가되거나 범위를 벗어나거나 다시 설정될 때마다 하나의 "제어 블록"에 대한 액세스를 공유한다. 참조 횟수가 0에 도달하면 delete 키워드를 사용하여 메모리를 해제 하게 된다.

#### shared_ptr Example

```cpp
#include <memory>
#include <vector>
#include <list>
#include <string>
#include <iostream>

using namespace std;
class Song {
private:
	string title;
	string artist;
public:
	Song(string artist, string title) {
		this->artist = artist;
		this->title = title;
	}
	string getTitle() {
		return title;
	}
	string getArtist() {
		return artist;
	}
};

void SongVector()
{
	//shared_ptr 생성 방법
	auto sp1 = make_shared<Song>("The Beatles", "Im Happy Just to Dance With You");

	shared_ptr<Song> sp2(new Song("Twice", "Fancy"));

	shared_ptr<Song> sp3(nullptr);
	sp3 = make_shared<Song>("Elton John", "I'm Still Standing");

	//shared_ptr 변경 및 초기화 방법
	auto sp4(sp2);//복사 생성자를 이용한 초기화 ref_count++
	auto sp5 = sp2;//sp5에 sp2 할당 초기화 ref_count++
	cout << sp5.use_count() << endl;//3
}
int main() {
	SongVector();
}
```

### 3. weak_ptr

`weak_ptr`은 하나 이상의 `shared_ptr` 인스턴스가 소유하는 객체에 대한 접근을 제공하지만, 소유자의 수에는 포함되지 않는 스마트 포인터이다.
`shared_ptr`은 참조 횟수(reference count)를 기반으로 동작하는 스마트 포인터인데 만약 서로가 상대방을 가리키는 `shared_ptr`를 가지고 있다면, 참조 횟수는 절대 0이 되지 않으므로 메모리는 영원히 해제되지 않는다.
이렇게 서로가 상대방을 참조하고 있는 상황을 순환 참조(circular reference)라고 한다.
`weak_ptr`은 바로 이러한 `shared_ptr` 인스턴스 사이의 순환 참조를 제거하기 위해서 사용된다.

### References

<pre>
<a href="https://docs.microsoft.com/ko-kr/cpp/cpp/smart-pointers-modern-cpp?view=vs-2019">https://docs.microsoft.com/ko-kr/cpp/cpp/smart-pointers-modern-cpp?view=vs-2019</a>
<a href="http://tcpschool.com/cpp/cpp_template_smartPointer">http://tcpschool.com/cpp/cpp_template_smartPointer</a>
</pre>
