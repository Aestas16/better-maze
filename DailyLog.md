## 2024/10/01
上午去世界城逛了逛。

下午赶高铁回家。

晚上（21:00 ~ ）了解学习了 IO 式交互的评测方法（使用管道）。

## 2024/10/02
打算写一个类似于 OJ 的东西，支持用户注册登录，提交自己的代码至服务端，然后由评测端进行评测，返回结果，并将结果保存在服务器的排行榜上。

了解学习了 OJ 的基本架构，认为评测沙箱部分为此项目最大的难点，思考如何设计一套优美安全支持 IO 式交互的评测方案。

阅读了多个开源 OJ 的评测沙箱部分实现，打算使用 docker 实现沙箱部分。

## 2024/10/03
阅读了多个开源 OJ 的 IO 式交互评测方法及评测沙箱部分实现。

规划了项目大致的结构，开始编写，先从首页、用户登录与注册、用户提交代码开始编写。

晚上完成了首页（题目描述）部分。

## 2024/10/04
凌晨完成用户登录注册部分与排名界面。

剩余的时间完成了代码提交和评测的 api，顺便发现之前不小心把密码也 push 到 repo 里了，紧急补救了一下。

## 2024/10/05
完成了迷宫生成程序和交互库的编写。

使用管道完成了 IO 交互评测的部分内容，目前支持评测：
- Accepted（通过）
- Invalid Output（错误的移动或是错误的交互方式）
- Runtime Error（运行时错误）

学习 docker 相关内容，然后发现 docker pull 一直失败。

折腾了好久，最后发现要给 docker 不会默认使用系统代理，改了一下配置才好。

## 2024/10/06
编写了 Dockerfile。

添加了评测机对 CPU 占用时间与内存空间的限制。

sleep 的时间并不占用 CPU 时间，接下来会进一步考虑如何更加严格的限制程序运行时间。同时还需要限制编译时间。

添加了对编译错误和编译超时的判断，接下来准备解决获取运行时间/占用内存。

添加了对程序运行时间/占用空间的检测。接下来研究一下 nodejs 与 docker 的交互，然后把评测搬进 docker 里面就行。

完成了评测部分。完成了评测后对排名进行更新。

## 2024/10/07
将写好的部分部署到服务器上。已在 readme 中更新了 demo 链接。

找了几个朋友来帮忙测试，发现并修复了以下 bug：
- 程序无端 Compile Error
- `error.ejs` 语法错误
- Invalid Output 无法正确显示

赶高铁回学校，休整了一下，所以除了 fix bugs 没做什么事情。

## 2024/10/08
增加了管理员可以看到所有用户提交记录的功能。

修复了注册用户名可以为空串的 bug。

修复了评测队列异常的 bug。

修复了 TLE 和 MLE 判断不严谨的 bug。