---
layout: post
title:  "자바 시스템 트레이 만들기"
subtitle: "Creating Java System Tray"
date:   2017-05-25 11:23:30 +0900
background: '/img/posts/07.jpg'
comments: true
catalog: true
categories: Java
tags : Java
lastmod :   2019-04-08 14:30:10 +0900
sitemap:
   changefreq: daily
   priority: 1.0
---

# JAVA system tray

```java
public void makeTray() {
    MenuItem exititem = new MenuItem("exit");
    PopupMenu menu = new PopupMenu("My Menu");

    menu.add(exititem);
    exititem.addActionListener(new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            System.exit(1);
        }
    });

    TrayIcon myTray = 
        new TrayIcon(Toolkit.getDefaultToolkit().getImage(trayURL), "chat", menu);
    SystemTray tray = SystemTray.getSystemTray();

    try {
        tray.add(myTray);
    } catch (AWTException e1) {
        System.out.println(e1.getMessage());
    }
    myTray.setImageAutoSize(true);
}
```