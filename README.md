Dline：一款可自定义故事的开源聊天类AVG游戏
-------------------------
如果谁写了剧本，记得发布嗷～
-------------------------
1. 受到 异次元通讯 启发，由原玩家BXV编写（html+css+js+java非本人常用语言，现学现卖，如有Bug实属预料之中）。
2. 自知历史记录保存效率不高，但未想到什么高效率的web与app共用一套h5代码的方法，如果有大佬能稍作改进就更好了。
3. Apk为自写webview封装，是不是小的像个病毒？嘛嘛～放心啦，这么缺德的事情我才不干呢～
4. webview功能完善后开源（Alpha1.0？）
5. 还差个ios版本，但本人没有mac电脑，无法使用xcode,如果有大佬能提供ios解决方案就好了（或者来个小可爱用HbuilderX封装个ipa发到apple开发者测试平台～ hx需要绑定手机，个人不习惯）。
6. 已收录剧本见仓库：https://github.com/God-SunCAT/DLine-Story
7. 剧本文件建议上传到Github后使用cdn读取（最方便方法之一），或者之间本地读取
8. 如果使用链接读取剧本，剧本过大时需等待剧本下载完毕（一般1-10s）

功能列表 []为待实现，[v]为以实现。待实现后的版本号代表预计实现版本，已实现后的版本号为实际实现版本<br>
Web 功能:<br>
[v][Can't]剧本大小不限额<br>
[v][Alpha0.8]可通过网址或文件格式导入剧本<br>

Android Webview功能:<br>
[v][Alpha0.8]剧本大小不限额<br>
[v][Alpha0.8]可通过网址或文件格式导入剧本<br>
[ ][Alpha1.0]后台消息通知<br>
[ ][Alpha1.0]改善存储架构<br>

-------------------------
各版本网页版链接目录
1. Alpha0.8
2. 网页版：https://god-suncat.github.io/DLine/Web-Code-Alpha0.8/Dline.html
3. 剧本生成器：https://god-suncat.github.io/DLine//StoryMaker-Alpha0.8/StoryDeal.html



-------------------------
剧本模板见StoryEdite目录。
请认真读完以下内容再写剧本。
1. 节点序号不够用请自行增加，但绝对不能断掉顺序且必须从1开始(从1-N 中间一个数都不能乱且不能少)
2. 跳转对应节点序号，自行检查是否有错误
3. 对白不得为空，选项可为空
4. 如果选项为空，默认自动跳转到“选项A跳转”对应的节点序号
5. 如果以上两者均空，“节点序号”自动加一并执行
6. 消息类型对应： 1=对方发言 2=我方发言 3=对方发图片 4=自己发图片 5=动态 6=系统消息 7=结局(本消息不会输出)
7. 如果消息类型未填写，默认为 1=对方发言。为1时建议不填写消息类型，以节省剧本空间
8. 消息类型3以及4 对白填写图片所在http网址
9. 动态仅可携带一张图片
10. 动态携带图片格式： 月亮沉入海底，氤氲了大海的诗意[img]http://图片.com/图片.jpg
11. 动态不携带图片则不需要"[img]"
12. 所有图片均可以以Base64格式包含在剧本中，但请注意图片大小 格式如下:“月亮沉入海底，氤氲了大海的诗意[img]“ + “data:image/png;base64,“ + ...
13. 重要: Web版剧本以及历史记录共用 10M 空间(App无限)。所以不建议剧本包含图片(头像除外)
14. 头像推荐尺寸: 640*640
15. 如果剧本一定要携带图片，建议使用webp格式以达到减小占用的目的(主流浏览器均支持本格式)
16. 剧本使用的所有图片，均可使用主流浏览器支持的任意格式yi ban
17. 不要连续几条内容没有等待时间，否则会出现Bug(无法解决)
18. 剧本跑完或者结局后会报错
19. 所有列均可空，但Bug自负
20. 接受一切Bug反馈(已标明无法解决的除外)，如果能携带解决方法就最好了
