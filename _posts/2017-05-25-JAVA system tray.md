---
layout: post
title:  "[JAVA] 시스템 트레이 만들기"
subtitle: ""
date:   2017-05-25 11:23:30 -0900
background: '/img/posts/07.jpg'
comments: true
categories: JAVA
tags : JAVA system-tray
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