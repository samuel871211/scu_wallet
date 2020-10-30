# 專案簡介：

我們是從一門碩士班的選修課程【區塊鏈】(2020.03~2020.06)，延續期末專案開發而組建起來的團隊，負責做區塊鏈東吳幣的開發、推廣，團隊目前主要的工作分成：
  
1.區塊鏈節點維護
  
2.錢包網頁的開發
  
目前預計在2020年11月創建FaceBook粉專，增加曝光度。2020年12月在全校師長前，以高教深耕計畫報告方式公開亮相

# 我在專案中負責的事情：

錢包網頁的開發(2020.06~Current)

在此之前，我對於網頁開發、串資料庫、後端的基礎完全是零

由於我們科系較著重在使用python，所以我選擇了python Flask來當作我後端框架

pymongo負責跟MondoDB資料庫去做溝通，開始了我的全端開發旅程

# 我在專案中學到的事情：

1.基礎的終端機指令，由於SERVER是架在AWS EC2，選用的系統是Ubuntu 18.04.4 LTS，所以我們必須要寫一些簡單的指令，把專案部署到SERVER上運行

2.前端HTML排版、CSS美化、並且可以用JavaScript添加動態效果；JavaScript也負責發送資料給後端，並且處理後端回傳的資料

3.對於建置後端、連結資料庫有基礎的實作經驗

4.Debug能力提升

5.由於網路上很多教學、官方文檔都是用英文撰寫，使用GOOGLE翻譯成中文又會大幅失真，所以這讓我更熟悉於閱讀英文Document

# 我目前覺得自己不足、缺乏的地方

1.缺乏與團隊使用github共同維護一份專案的經驗

2.缺乏與前端工程師溝通、分工的經驗

3.使用過的後端語言太少，像php、node.js等等，都僅止於"聽過但沒用過"

4.只操作過NoSQL資料庫，對於SQL資料庫沒有實作的經驗

# 給自己的期許

1.在正式踏入實習以前，我願意先自行學習其他後端語言、資料庫，或者執行貴公司指派給我的練習課程等等，以達到貴公司對於職缺的需求

# 專案開發日誌

因為我本身就有每天寫日記的習慣，所以我從專案步入正軌之後，就開始每天記錄一些今天的進度、學到的東西

7/3
資料庫reverse抓資料
發文換行功能
子版篩選
查詢功能
排序(default時間、讚數、回覆)

7/4
回覆標記功能
新增回覆會無法立即按讚，已修正
新增聊天室功能：xxx於幾點幾分已進入聊天室
send_token跟get_balance的API正常
SignUp跟PublishBounty要新增時間進資料庫
不可接自己的單
接單前顯示詳細資料，並confirm

7/5
login function實作
接單bug修正(字串跟數字的相加)
發佈懸賞的介面優化、js function更新
BountyBoard跟ManageMyBounty資料要倒著抓
信箱功能初版：
1.有人按讚您的文章(ok)
2.有人接單您的懸賞
3.有人回覆您的文章(ok)
4.有人按讚您的回覆(ok)
5.有人標記您的回覆(ok)
5.配對成功(暫無)
不可於留言區回覆自己！
回覆的bug修正(使用placeholder取代value)
SignUp連結NewDID的API

7/6
資料庫清整(把舊帳號的足跡都刪除)
信箱介面初版
東吳幣SERVER環境架設(requirements.txt)
聊天室bug修正(entered the chat room.)
mail href要用相對路徑，且split要清乾淨
新帳戶註冊轉帳功能、配對功能現在可以轉帳了
JoinDailyPair的bug修正
前後端部署到東吳幣server進行測試

7/7
日誌功能重作
初版功能：
簽到(每天可簽到1次)ok
日記(提供textarea讓使用者編輯日記or筆記)ok
備忘(備忘錄都可以打在這裡)
課表(每學期首次先把課表key in，之後就可以通知您今天的課)

構想：
連續簽到3天可獲得1顆東吳幣(目前是每天1顆)
日記只要連續寫3天，可獲得1顆東吳幣(目前暫無驗證方法)

7/8
簽到bug修正
日記新增個人化選項(格線、字體、背景)僅有構想
在會員中心可以顯示信箱有多少訊息了
在3.87註冊的帳號，如果再用ajax發送到new_did，會報error 409 conflict，給出錯誤提示
日記bug修正、流程優化
我的小屋第一版
PublishParagraph的子版不應該有【所有】

7/9
新增小遊戲(猜數字)

7/10
新增小遊戲(今彩539)
小遊戲bug修正
轉帳功能移到個人小屋
非同步轉帳功能測試ok
註冊的地方有兩個會計系==
發文的地方有兩個【問題】
SignUp、Login、轉帳的btn只能按一次
GetSignUpReward現在變成確定轉帳成功才去更新資料庫的資料了
發文的時候如果沒有選擇子版，要跳個提示

7/11
日記在上傳前都不會新增到資料庫
查詢方式不夠人性化，要更改的更直覺
PublishBounty的_id改成hash
Bounty接單之後移到trading分支
原bb改成onboard，比較好區分架上跟交易中的
trade.html顯示施工中
already using 500 collections of 500
原來documents的上限是500個？
為啥今彩539要塞車到8.再開獎?
直接先把random數字設定好
使用者上傳5個數字的瞬間，其實就排名好了啊==

7/12
把今彩539的開獎分散到各個使用者
initiator的bug修正
日記如果先點未來再點今天會無法正常顯示
改成未來的日記也可以編輯
每個頁面的【會員中心】都先置中
聊天室的介面優化 文字區塊隨著文字長度動態改變  新增離開聊天室的提醒 不過一定要按離開聊天
發現網頁的設計應該不能用width % 最外圍那圈要設定px 在手機上顯示才不會大跑版

7/13
PublishParagraph介面優化

尚未實作：
所有轉帳功能，都應該要確認轉帳成功再去update資料庫(簽到、猜數字等等)(7/16完成)
如果猜數字的獎勵發送失敗，要如何補發獎勵？(7/16完成)
想記錄thane的現金流
新增【客服】功能，讓使用者可以即時跟我溝通
所有網頁的width設計都改一下
發文刪除、修改、發文屬性框跟標題不可重疊

7/14
SeeParagraph介面優化
games介面重作(乾超累)

7/15
去竹山跟光幣交流
尚未實作：
在轉帳部分的get  balance跟send token不應該都放到前端，容易增加被駭的風險(7/16完成)
safari瀏覽器的cookie要多加一個+";max-age=0;"(7/16完成)

7/16
send token轉到後端

7/17
延續games.html的設計優化
響應式網頁RWD

7/18
Diary.html設計優化、日記的bug修正(先點當天，再點別天，不點日記，再點當天日記，會說日期無變化)
textarea之間不可用空白...
新增回覆之後，應該把placeholder刪除，把回覆count+1
用imgurpython串API

尚未實作

7/19
發現手機也可以透過IPV4連線到本機由FLASK後端渲染的網頁
一般手機的width = 360 height = 640左右，看螢幕比是不是16:9 還有home鍵等等
Contact.html可以新增圖片了
發文也可以新增圖片了

尚未實作：
響應式網頁初探(width建議用%)、至少要寫三版以上的css來定義各種裝置的width
使用者如果放置一個網頁太久會登出，這時候應該要及時讓他再登入
引入圖片管理系統，每個人最多只能同時擁有100張圖檔，超過的要刪除
圖片上傳(引用圖檔、引用連結、上傳圖檔)

7/23
Paragraph、ManageMyParagraph手機版介面優化
table-layout:fixed會導致td width每格寬度平分

7/24
聊天室現在可以上傳圖片了

7/25
聊天室上傳圖片的功能優化(可以放大縮小)

7/26
RWD第一版實作
@media (max-width: 720px)
@media (min-width: 721px)
css hover實作
UserCenter介面重作

7/27
table rowspan實作
mail介面重作
BountyBoard介面重作

尚未實作：
mail操作(僅顯示未讀、已讀、所有、回報進度)

7/28
usercenter介面優化
尚未實作：
圖片上傳之前要先提醒(單張圖片不得超過10MB、圖片上傳前最好先壓縮、圖片上傳時最好給個提示)
Paragraph的頁面要新增(上一頁)
Paragraph的標題可點擊區域要大一點、padding-top-bottom加大、字體加大
聊天室連續輸入兩段話之後，希望可以直接把頁面跳到最下面(點擊textarea然後scroll)按鈕太小

7/29
Pair介面重作
尚未實作：
部分功能引入驗證碼機制，以免遭到重複提交表單


7/30
Pair跟ChatRoom介面重作
是否要像8591一樣偵測同個使用者但是不同IP位置的登入？
或是同個帳號不能同時在兩個裝置登入？

8/1
Paragraph介面重作

8/2
Paragraph的篩選跟搜尋演算法重作

8/3
Paragraph的篩選跟搜尋演算法debug
流程：先搜尋 > 再篩選子版 > 再進行排序，搜尋一律是全文匹配
原本是每次搜尋、篩選、排序都會重新跟資料庫抓資料，但是我一開始的做法就是AllParagraph全抓
所以之後的搜尋、篩選、排序其實沒有必要再跟去資料庫做請求，直接在前端js把演算法寫好即可
另，原本的想法是【未篩選到的td再添加display:none】，但這樣顯得太突兀，少了動態感
故，後來的想法是【所有td一律先display:none，篩選到的再用toggle("slide")】比較有互動感
SearchIndex跟FilterIndex分別負責存放【搜尋結果】、【根據搜尋結果再進行篩選的結果】
如果子版 = 全部，就從SearchIndex進行排序，其餘情況，就從FilterIndex進行排序
SortBy這個函式會把丟入的陣列(SearchIndex或是FilterIndex)進行排序

尚未實作：
UserCenter、回報、配對的電腦版頁面過長
不過就算把height限制在100vh，好像只會變得很寬？

8/4
games猜數字介面重作

8/5
games猜數字介面重作
現在不用再點擊"開始遊玩"了，在FirstArea按下猜數字的瞬間，就會去資料庫撈資料，
並且把作答紀錄顯示出來。另外，猜到4A0B之後，也不用再額外點擊"領取獎勵"了
會直接帶使用者回到FirstArea，並且顯示獎勵發送中。如果獎勵發送失敗，會重新整理網頁
只要再點擊猜數字，就可以重新領取獎勵了(帶使用者回到FirstArea，並且顯示獎勵發送中)
領取完獎勵之後，一樣可以回到SecondArea，這時候會有四個階段的安全機制防止重複領取
1. ok按鍵disabled = true
2. KeyIn的時候檢查PredictAB的最後一筆是不是4A0B
3. 後端DetermineAB會先去檢查第一筆是不是received
4. 後端ReceiveABGameReward會先去檢查第一筆是不是received
如此四階段的驗證尚且才能確保交易的安全性

8/6
今彩539介面重作

8/7
今彩539介面重作，現在Join539只有在上傳數字的時候會呼叫，其餘情況就讓其他函式做掉
讓每個函式的功能分割更精準，現在頭獎~陸獎不會一起顯示，會分區用按鈕點擊來選擇了

8/8
login跟SignUp介面重作、init跟SignUpReward這兩個頁面刪除

8/9
login跟SignUp介面重作、並且把信箱驗證的功能加進SignUp
另，由於手機板在輸入資料的時候會展開鍵盤，導致可視區域減少
所以輸入區域的div加個overflow:auto，想固定大小的input可用px
不然input的高度會隨著鍵盤的展開與否來變化，感覺非常怪!!!
另，註冊的獎勵也寫進後端，不然大家就都知道管理者是誰了ㄚ，感覺不安全
前端JS圖片壓縮再上傳到imgur，不然常常會上傳失敗><
下午都在研究圖片壓縮的部分，簡單講就是用canvas畫布提供的drawImage跟toDataURL
這兩個API分別可以把圖片等比縮小、以及轉成base64的編碼然後設定壓縮率

突然發現一個問題，這是從login的時後才發現的，就是手機版用戶在輸入文字的時候
因為有展開鍵盤，所以會導致body.height()大幅變小，如果這時候我們的input height是用%數
就會導致input height浮動，所以contact這個頁面的textarea估計也是要高度固定吧

另，由於JS的非同步，我在上傳圖片的時候是這樣：先用fileReader把圖片讀成base64的樣子
再把這base64丟到img的src，img不要設定width，讓它隨著圖片自動調整，接著再去檢查width
如果超過1440，就把寬度設為1440，但是這樣做，有時候會發生圖片讀取到一半，width還=0
這樣就沒辦法壓縮到圖片，也就無法把壓縮後的base64送到後端了，後來我的做法是
如果img.width設定失敗，就recursive呼叫同個函式，通常最多2次就可以成功把圖片壓縮，速度算快
我如果用setTimeout，我也不能知道圖片轉base64需要的時間，所以時間不好抓

8/10
今天早上接著昨天上傳圖片的壓縮，後來發現一個更好用的方法，直接在img style設定max-width就好
然後我們需要一個img空間放width=1440px的圖片，但這樣會很佔版面，到底要怎麼辦呢？
img在append進去html之前，width跟height都會是0，簡單講就是img一定要放到頁面上才能決定寬高
所以如果我對img設定display none，這樣也不行，但是visibility hidden可以，但是後者會佔空間
最後我的作法是外層包一個div寬高=0，overflow=hidden，裡面的img max-width=1440px，解決！

尚未實作：
contact在上傳圖片的時候，應該偷偷的把home跟send disable，不然怕使用者亂按

我發現不是只有button可以加onclick的事件，那這樣的話其實很多東西外面根本不用包button...

8/11
SeeParagraph的三大區域(文章區域 留言區域 我要留言)介面設計、牽動到js也要砍掉重寫
另外，以前用js動態新增元素的時候，習慣把style寫在js，其實可以把元素訂同個class
再到css那邊去寫樣式即可，修改跟可讀性都比較優秀，在發佈文章的頁面
原本是把img包在button，再把樣式寫在js，但其實onclick不一定要綁在button
所以外圈button拆掉，直接設個class來套img樣式，放大縮小也是直接針對img去做

8/12
ManageMyParagraph直接引用Paragraph的樣式跟js程式碼，但是有多了"刪除、修改"的選項
但是由於我原本是td包a，如果把下拉的按鈕也放在a裡面，這樣就會點到文章的連結
雖然可以把下拉按鈕放在a下面，然後再用position relative調整位置，但原本的位置還是會佔空間
後來我決定把下拉按鈕放在a下面，也不去調整位置了

8/13
下拉按鈕按下去之後，要怎麼樣抓對應的div區塊來做display呢？還好js跟jquery都有提供語法
大致上就是什麼parent、parentNode、next、previous，所以就可以利用此抓到外圈的div來display
再來是關於刪除按鈕按下之後，要抓什麼資料給後端呢？唯一的_id值是一個好方法
PublishParagraph可以選擇是否要隱藏學系、頭像
由於現在paragraph的資料庫的username變成"username,major,selfie"，所以getMyParagrpah
的搜尋方法要改，本來想說要新增key(很麻煩，後端python前端js都要連動)想說可不可用prefix搜索
我想這種搜尋方式一定有，結果用regex就可以拉，灑花~~

尚未實作：
編輯發文也可以連到PublishParagraph這個頁面(8/14ok)
預覽發文

8/14
編輯發文的功能優化，但是現在遇到一個問題，如果有人內文用<>
裡面包的不是img1~5的話，內文會無法正常顯示，這感覺要用regex來抓，但是又很麻煩阿==
更正，只要<A-z的prefix都不行，可能是HTML的內建判斷標籤的程式碼，所以不管title
還是paragraph都要先用regex篩選過內容，不然會導致div.innerHTML無法正常顯示RRR

尚未實作：
留言區點擊留言可以回覆、刪除、檢舉

8/15
錯誤標籤的判斷，由於內文會先把\n轉成<br>，再把<img>加上className onclick等等屬性
所以在img新增attribute之前，只要判斷標籤484 = <img1>、<img2>......或是<br>即可
點擊留言之後應該要可以回覆、檢舉，如果是本人的話，就要刪除or編輯，總共四個

尚未實作：
UserCenter的頭貼點擊可以更改頭貼
mail的部分要修改程式碼

8/16
由於現在留言也可以隱藏學系、頭貼，所以InsertNewResponse抓的是及時的資料，而不是cookie的
留言現在可以使用全螢幕編輯了
編輯留言，希望可以跟留言使用同樣的html，已完成
編輯、刪除、檢舉基本上都已經把相應的JS跟HTML寫好，剩下reply，因為會牽扯到mail，比較麻煩

8/17
編輯的js程式碼修正，預設會先帶到FullScreenEdit，編輯完之後，如果還在全螢幕，就關閉全螢幕
檢舉的部分，由於GrayArea的opacity是0.6，所以檢舉原因不能寫在GrayArea裡面，不然也會變透明
同一樓的留言，只能檢舉一次，不然會造成惡意檢舉，或者是多人檢舉，後者對我來講只是更麻煩(吧
因為我要花更多時間去過濾相同的檢舉，也會讓資料庫的負擔更大。
另，原本新增留言不會reload頁面，所以刪除留言跟編輯留言，也要及時修改html的部分
so far，四大功能(編輯、回覆、刪除、檢舉)皆以完成，且串接的mail也已經更新完畢
基本上串接mail的js跟對應的後端我都沒改，因為改起來也是大工程，等之後重寫mail頁面的時候再說
另，如果要編輯標記別人的留言，標記的部分無法編輯，只能修改留言的部分
另，如果要回覆的留言含有標記，那麼標記也不會列入placeholder裡面

8/18
Mail的介面重作，幾乎跟Paragraph相同，差別在我新增了一些功能，判斷裝置是否支援觸控
如果支援觸控的話，基本上就是手持裝置，那麼hover屬性的css就不會載入，因為手機跟平板
並沒有滑鼠移入事件，所以那些hover屬性會顯得很奇怪，再來就是button class的部分
很多網頁喜歡把目前的button加上底線，如果切換到不同button，底線會跟著移動
我一開始不知道要怎麼弄，只查到css的transition，但又有分moz、webkit等等瀏覽器，麻煩
加上border-bottom只是一個style，並不是一個DOM元素，也沒辦法利用JQUERYUI的slide控制
後來我發現有hr這個標籤，就是水平線的標籤，我就在兩個button下面分別加了兩條hr
再來就是用display搭配slide來做出底線滑動的效果，後來上網查才發現slide有參數可以調左右方向
但又遇到一個問題，兩個hr中間有一點空隙，後來我就改用td包div(inline-block)再包兩個hr
問題解決！但又遇到一個問題，由於【系統郵件、回報進度】是包在BottomArea裡面
所以當overflow:auto，這兩個button也會一起消失，所以必須跟header一樣設定position:fixed
之後回去弄pair.html跟ChatRoom.html的js，把document.cookie更新，才能正確抓到username
另，header部分不再顯示"Pair"，而是顯示對方的暱稱跟學系，學系跟頭像可隱藏，在報名的時候決定
pair.html的介面微調，header改成position fixed，然後BottomArea一樣是overflow:auto
之前在EditParagraph就有發現，textarea可以正常顯示的文字，例如：<b，在其他區塊會被視為標籤
突然想到，就不要用innerHTML，改用innerText不是就能解決了嗎？至少在純文字的部分可以這樣

尚未實作：
回報進度要如何呈現？有哪些key？
ChatRoom要新增的功能【已讀、複製、收回、回覆、圖片壓縮】

8/19
聊天室現在可以抓到對方的學系、暱稱、頭像了！然後用innerText會讓<br>失效，後來我的作法是
先用split("\n")把message變成array，每個index位置都獨立成div，再用div.innerText就可以完成
因為div本身就有換行的效果了，聊天室現在可以有已讀的功能了！且xxx於xx:xx分進入/離開聊天室
的功能移除，因為本身就不實用，而且不美觀。已讀功能其實就是當A透過socket.emit資料給server
server會把資料再回傳給AB，此時如果B收到，B就會再emit一個資料給server，告訴A說B已讀囉
同時資料庫也要去更新，這樣在reload網頁或是進入頁面的時候才可以把舊訊息都顯示已讀
其實之前在用聊天室的時候，就覺得socketio雖然是說可以達到即時通訊，但還是有一點延遲(可能0.3秒)
這部分的機制我真的不是很懂，當初我在跑的時候，就叫我也安裝eventlet，聽說什麼這是最快的
可是我能發現用flask是單線程的同步，也就是說如果A發送了一個請求，B也發送的話，必須等到A完成
然後再處理B，我自己在測試的時候姑且都會塞車了，何況這個網頁之後如果要給幾十人幾百人幾千人用？
尤其是處理一個Send_Token的post請求就要將近10秒，這樣的話伺服器一定大塞車，上網查了一堆資料
人家說flask可以用threaded=True還是啥的，可是flask-socketio卻一直找不到，後來直接看__init__.py
在SocketIO這個class裡面的一個參數裡面是這樣說：
:param async_mode: The asynchronous model to use. See the Deployment
                       section in the documentation for a description of the
                       available options. Valid async modes are
                       ``threading``, ``eventlet``, ``gevent`` and
                       ``gevent_uwsgi``. If this argument is not given,
                       ``eventlet`` is tried first, then ``gevent_uwsgi``,
                       then ``gevent``, and finally ``threading``. The
                       first async mode that has all its dependencies installed
                       is then one that is chosen.
反正大概就是說，預設會先給你用eventlet，難怪當初python叫我安裝eventlet，還說什麼這最快
結果我才剛把socketio = SocketIO(app)改成socketio = SocketIO(app,async_mode='threading')
這個速度我簡直嚇到，一樣是A先emit，等到on的接收器收到server回傳的訊息後，再用js新增元素
這幾乎無延遲的速度，讓我開始懷疑eventlet到底在幹嘛，而且A上傳圖片的同時，B也能傳訊息
這簡直是天堂下來的解決辦法，之後再來研究看看這幾種方法到底有啥不一樣==底層通訊協定真複雜

8/20
聊天室點選訊息之後，若是自己的訊息，可選擇【收回、複製】，反之，可選擇【回覆、複製】
收回的部分已經算完成，做法是把要收回的訊息的index位置emit過去，這時server再emit回去
雙方都收到第index的訊息要收回。第二部分是重整網頁的時候，也要去判斷訊息是否已經收回

8/21
回覆的功能實作，樣式基本上都參考line的，然後再用我自己所學的語法轉成html原始碼
我覺得寫久了真的會練出一種，看到某個排版，大概就知道要用什麼元素跟套用哪些css了
回覆完之後，還得考慮的事情有很多，第一個是重整網頁後，怎麼判定這則資料484回覆的
然後再來就是，如果我回覆A講的XXX，但是A把XXX收回了，那麼連帶我回覆的ResponseOrigin
都要變成訊息已收回，這算是幾個比較細節的部份，還有回覆的回覆，這部分也是狗幹麻煩

尚未實作：
收回A訊息，要連帶把回覆A訊息的ResponseOrigin也都變成"訊息已收回"(8/22完成)

8/22
收回、回覆的bug修正
如果我回覆B的那句話，也屬於我講的話，所以不能回覆，收回之後，該筆reply的部分清空
且歷史紀錄會留下，再來就是如果我回覆B的那句話，但是B收回了，那麼就代表根源已空
所以ResponseOrigin也該變成"訊息已收回"、圖片只能收回

我想知道，如果現在所有事情都交給socket.emit來做的話，因為eventlet是async
這樣有沒有辦法讓速度變快？但這要把程式碼全部砍掉重寫，是一個很浩大的工程！
尚未實作：
複製
這感覺太簡單了，純前端的技術，到時候再來弄

8/23
把目前的聊天室部署到server，差點忘記imgurpython要自行新增upload_from_b64
另，對於手機板的用戶，打開textarea，要自動轉到頁面最下方，除了是在"回覆"訊息

尚未實作：
socket.on，如果username !=自己，先確認對方的scrollTop484在最底，不是的話
就跳出"您有新訊息↓"，點選箭頭就可以smooth移動到最底，明天再來弄吧！

8/24
資料庫先把之前去竹山的那群人清空，今天把忘記帳密的頁面搭起來，header一樣複製貼上
忘記帳號/忘記密碼的按鈕就跟mail.html一模一樣，不知道為啥td會inherit font-size
所以放hr的td變成固定18px高，我後來就把font-size改成0，就可以了，真的超奇怪==

尚未實作：
ResetPassword

8/25
ResetPassword完成，本來想用PasswordHash來當作驗證碼，但這樣會變成每次的都一樣
所以後來我改成10位數的random數字，一樣寄Email到註冊信箱，再用這組驗證碼來重設密碼
ChatRoom聊天邏輯優化，如果A傳訊息給B(包含文字、回覆、圖片)，此時會根據B的頁面scroll
如果clientHeight > scrollHeight-scrollTop-clientHeight，代表B也在底部，所以直接下拉卷軸
反之，代表B不在底部，可能在回看歷史訊息，這時候就跳出"您有新訊息↓"，是不是很人性化呢？

8/26
為減輕伺服器負擔，在retrieve.html忘記密碼的部分，會先透過js正則表達式判斷驗證碼是否合法
另外，為了避免在跟後端交互期間使用者亂按or不小心按到其他按鈕，所以會用一個全螢幕視窗擋著
background-color = gray,opacity = 0.8，同時再加個fa fa spin，讓使用者知道現在正在等待中
mail.html一些css小細節優化(top:118px;最後一個FlexDiv的border-bottom取消)

8/27
BountyBoard介面重作，Accept之後的js跟後端串接還沒做好，另外PublishBounty也要重做
第一階段目標可能就是先把任務都先設定在當天，所以可能就不會分PublishTime跟Time這麼精準

8/28
嘗試用3個以上的滑動底線，但失敗了，因為display none跟float left的設定，會導致底線一律靠左
如果是visibility hidden還可以保有元素在頁面上的空間，但是jqueryUi動的是display，所以很麻煩

8/29
休息

8/30
BountyBoard的介面合併，把Manage跟Publish都搬來同個頁面，上下各用一個雙button的底線控制
目前顯示的是哪個分頁，只是目前sendtoken那邊又有錯，這次是400 Bad Request Invaild Token
我其實很想知道助教那組他們到底在幹嘛，他們之前有說如果想加入他們的節點管理，有興趣可以聯絡
我很想加入，但又怕之後開學要打工又要當助教又要管理我自己的網頁，我可能會忙不過來...

8/31
為了避免有些人惡意修改cookie值，針對一些重要的資料，可以在載入頁面的時候，就設定const
不過會牽扯到async的ajax，所以這部分還得再研究

9/1
trade.html的功能優化、Bug修正
尚未實作：如果點選texts，(收回or複製)，這時候再到進度，就會變成header已經消失(9/12修正)

9/2
由於async會影響js的效能，所以trade.html跟ChatRoom.html一樣，網址會帶_id跟RoomID
尚未實作：
mail回報進度
在"管理任務"直接查看交易中的任務？(ok)
交易進度(ok)
聊天室複製功能(ok)

9/3
取消任務，本來是希望雙方取消任務的原因可以吻合，如果不吻合，但是雙方又取消，那就得再看看
有幾點邏輯控制要注意：
1.小明取消任務之後，不可再次取消任務(OK)
2.小明完成任務之後，不可再次完成任務，也不可再次取消任務(ok)

9/4
完成任務之後，不可再次完成任務，也不可再次取消任務
在CheckBuyerAndSeller這邊，如果判斷到user已經有取消任務or完成任務，就把那兩個button
換成別的alert function，如此就可以避免例外情況產生
SignUp抓Bug

尚未實作：
任務完成(取消)之後，轉帳給對應的人
聊天室複製功能(ok)
任務聊天室reset
配對聊天室reset

SignUp 按下驗證信箱、註冊之後，要有fa fa-spin讓使用者知道要等待
##信箱484有被註冊，後端會去查看EmailHash，但是這樣每次的驗證碼都一樣
所以可能要改成去new_user那邊find_one？！ 不然ABC都用同個信箱驗證
因為驗證碼都相同，這樣還是無法實名化控管帳號數量
另，由於目前sendtoken問題超多，是否開個頁面統一讓使用者領取receive失敗的token？

9/5
信箱驗證，先去new_user查看email是否已註冊，再到emailhash查看，如果已有，重新生成驗證碼
如果emailhash沒有，就生成一組驗證碼，若使用者成功用這組email創立帳號，emailhash刪除這筆

9/6
retrieve在前端js多一些判斷，過濾不正確格式的帳密跟email，可以減輕伺服器的負擔
contact.html一些小bug修正
pair.html一些小bug修正，並且把部分alert事件改掉
chatroom.html複製功能

尚未實作：
圖片應該要可以收回(9/7完成)

9/7
chatroom.html圖片可以收回了
publishparagraph.html子板新增
publishparagraph.html圖片上傳失敗的error handle
因為現在是debug = true的情況
只要相關py檔有更動，就會reload server
有時候剛好在發送請求就reload server
會導致那份請求沒有結果，所以可以在ajax裡面設定timeout

EditResponse一些bug修正，包含img src抓的不正確
以及edit完，應該把content.placeholder修正成"回覆文章..."
由於<a這種錯誤的標籤如果放到innerHTML會自動判斷成一個標籤
所以例如這種標題：<a是我的最愛，如果要放到標題，就改成innerText即可
考慮到paragraph是很多行文字跟圖片的集合體，所以就像ChatRoom一樣
遇到\n就用div.innerText包住，但是這邊更複雜，img不需要被div包住，所以很麻煩
這個演算法我寫到將近12.才寫完，太累了先睡

9/8
PublishParagraph.html小細節修正，主要是因為空白符跟特殊符號在頁面上呈現的問題
textarea的空白符號存進資料庫，再讀取變成div區塊，這邊的工程比較麻煩，很多要考慮

9/9
SeeParagraph.html在InsertNewResponse這邊，一樣要針對textarea文字轉div文字的情況
衍生出其他很多細節要修改的，原本只要直接.innerHTML = content.value
現在只要遇到\n就要斷開，用一組div包出來，遇到回覆留言的更麻煩，因為頭還會有個B標籤

尚未實作：
編輯留言之後，應該馬上回到那樓的高度(9/10完成)

9/10
編輯留言之後，應該要回到那樓的高度，而不是所有情況都套用scrollTop = scrollHeight
如果是回覆or新增，那麼確實可以套用，所以結論就是，要在FullScreenEdit這邊多些判斷式

9/11
games.js的細節修正，如果猜數字的獎勵發送失敗，頁面會自動重新整理，使用者只要再進入猜數字
系統就會自動判斷此玩家是否已經領取獎勵，如果沒有，就重新發送，如此循環，但現在的問題是
使用者如果是進入今彩539，一樣會重新發送，這不符合常理，所以修正成進入猜數字才會發送獎勵

9/12
trade.html的ChatRoom一些問題修正：
尚未實作：如果點選texts，(收回or複製)，這時候再到進度，就會變成header已經消失(9/12修正)
另，同樣的元素，在不同裝置、瀏覽器，其height可能有些許差異，在聊天室這種overflow的情況
這1 2px可能就會造成畫面捲動的斷層，所以css設定的時候不能直接用固定px，而是要去計算差
例如BottomArea的top就會是header的高度 + TwoBtnTable的高度，這樣可能比較能符合多種裝置

接單的時候要先確認這筆任務484存在
刪除、接單，都要等待，所以要給個fa fa spin

尚未實作：
發佈懸賞需要消耗一顆東吳幣
Contact.html新增一個可以領取東吳幣的地方(SignUpReward、懸賞取消、刪除、完成)
任務聊天室reset
配對聊天室reset

9/13
在BountyBoard.html，本來是用td1~td4的display來控制4個區域以及底線的變化
但是JQUERY的缺點是，在動畫結束之前，是不會改變元素的display的，例如這樣講好了
如果現在td1.style["display"] == "none"，給定td1.slide()，假設要400ms，那麼要等到
400ms過去之後，td1.style["display"]才會 == ""，缺點是如果使用者手速很快的話
可能會造成同時觸發兩個td的顯現，所以必須要用相對應的4個區域的display來當判斷點!
在BountyBoard.html的管理任務，可以查看進行中的任務了

9/14
無

9/15
無

9/16
SignUp在驗證信箱的Bug修正
Contact.html新增一個可以領取東吳幣的地方(註冊獎勵、懸賞取消、刪除、完成)做到一半(9/21ok)

9/17
無

9/18
# -*- coding:utf-8 -*-

9/19
Contact.html新增一個可以領取東吳幣的地方(SignUpReward、懸賞取消、刪除、完成)接著做

9/20
同上，今天開始串前端js跟後端python的部分

尚未實作：
任務完成之後，應該要把ChatRoom清空

9/21
Contact.html完成
任務聊天室reset，會牽扯到TradingConfirm還有UnsendHistory
應該把UnsendHistory變成document的一個key，而不是把所有聊天室的收回紀錄都放在一起，太雜
UnsendHistory(ok)
TradingConfirm會有一個問題，在接單的時候，指派ChatRoom的時候，不能用count_document
因為假設1001~1004，結果1003先完成任務，那麼接下來如果用count_document，就會指派到1004
正常情況就是count_document，例外情況，用一個array儲存EmptyRoom，如果array是空的
那就count_document，反之，就先從EmptyRoom來用，另外，TradingStatus應該要及時
例如A完成交易，這時會把任務移動到完成交易的部分，並且把ChatRoom清空，但如果B這時還在trade
他這時候還是能夠用聊天室打字，所以我們應該要及時的用socket把B請出這個頁面！

尚未實作：
發佈懸賞需要消耗一顆東吳幣
任務聊天室reset(Complete、Cancel)(9/21 ok)
TradingStatus改成用socket掌管(9/22測試中)
配對聊天室reset
配對聊天室時間內才能進入

9/22
TradingStatus改成用socket掌管，持續debug中...
A同學取消or完成任務後，預設會把A同學的那兩個BUTTON替換成warning的function
避免重複取消、完成任務，所以socket.on那邊要確認username == username才執行！
另，我發現我小台筆電的imgurpython並沒有upload_from_b64這個函式
因為之前暑假都用msi筆電寫網頁，想說怎麼上傳圖片都失敗，還以為imgurpython炸裂了

9/23
TradingStatus持續debug

9/29
ChatRoom.html的textarea轉到div，關於空白符號，在.texts要新增white-space: pre-wrap;

https://stackoverflow.com/questions/24970502/what-is-the-width-of-empty-space-in-html
這篇文章有說到空白符號的寬度，所以我後來把textarea的font設定也改成跟.texts一樣的大小、字型

9/30
ChatRoom.html現在收回、回覆、複製，也套用跟trade.html一樣的html css js效果外觀了

10/3
原本在ChatRoom History這邊是用對方的username來當作key，value則是對方的頭像系級
但是這樣在清空聊天室會很麻煩，因為這個key是變數，所以我們沒辦法用統一的方法來清除
後來我想到一個方法，改成names:[{"name1":"name2_detail","name2":"name1_detail"}]
這樣的話key就是固定的names，然後如果要清空聊天室，只要把dict清空即可，完全不用管key

然後我不懂我當初為啥這樣寫，在ChatRoom發送text_message的時候，如果是自己發送的
就要先把message.split("\n")，然後再分別塞入div，但是如果不是自己發送的話，就直接用
btn.innerText = message，我真的不懂我當初為啥這樣寫，前者可以解決<a的問題，但是
無法解決空白分行的問題，但是如果直接把\n丟到btn.innerText，卻可以正常的轉換成<br>
總之，直接用innerText就好了，我之前在8/19的做法應該是有先把\n replace成<br>
之後再用.innerText就會讓<br>失效，其實根本是多此一舉，\n就可以直接用.innerText了

同理，在Trade.html也同步更新，把white-space:pre-wrap跟.innerText的部分都改好了

10/4
尚未實作：
SeeParagraph.html 新增的留言應該要在"沒有更多留言了"的前面(10/5 ok )

10/5
PublishParagraph，如果內文長這樣
<img1>
哈囉
會是case3：只有後面有分行
代入paragraph = paragraph.slice(0,i) + "\n" + clone.outerHTML + "\n" + paragraph.slice(i+6)
但是萬一paragraph.slice(0,i)是空的(就是代表i == 0)，這時候就會多出一個"\n"
所以要額外判斷i是否==0，再來決定是否要paragraph.slice(0,i) + "\n"

在SeeParagraph.html這邊，InsertNewParagraph的部分，username的img
如果是default的img，那麼就不要用絕對路徑(測試的時候，因為server不固定)
但是之後如果部署上線，那麼網址就會是固定的ip
現在判斷484是default的img的方法是看網址是http還是https
因為我們現在server是用http，但是上傳的圖片會到imgur，是https的

不同的font-family會有不同的space width，所以textarea的文字若要轉成div
在font-family的設定可能就要統一

尚未實作：
SeeParagraph.html這邊如果按了 "編輯留言" 是否要有取消編輯的按鈕?!

10/7
EditParagraph不應該是每次編輯就Insert New Document吧(?
這樣感覺很快就會達到Document = 500的上限，而且不方便閱讀跟查找
後來查了一下，但個document的容量上限是16MB，純文字要16MB應該也很難

SeeParagraph的留言部分，判斷是否為tag只有用string.slice(0,2) == "<b"不夠嚴謹
所以加上string.indexOf("</b>") != -1，確定<b>標籤是有成對出現的，才判斷是否為tag

10/8
A在SeeParagraph留言，但是到B那邊會多了一行空行，尋找了一下原因，是因為在tagperson
那邊新增了空元素 + "\n"，所以如果沒有tagperson，就維持原本的content就好

統計目前尚未實作：
首頁的設定
發文的預覽
小屋的頁面
發佈任務的轉帳
回報進度

10/10
django初探，部分語法跟flask類似，例如render template
另外，這種由後端渲染的網頁，route不一定要用.html
我之前開發flask的時候，舉凡是return render_template的route
我都會這樣寫
@app.route('/retrieve.html')
def retrieve():
	return render_template('retrieve.html')
但其實可以這樣寫
@app.route('/retrieve')
def retrieve():
	return render_template('retrieve.html')
這樣網址就不需要用.html結尾，一樣可以訪問到指定的網頁

django的MTV(Model、Template、Views)是構成APP的三大元素
比起Flask把所有app都寫在同一個.py檔，雖然建構起來很方便
語法、規則也算寬鬆，但是缺乏統一的專案管理，該怎麼說呢？
就是如果你程式碼編排不好、註解很爛的話，那沒人看得懂你在寫啥
因為所有app都塞在同一隻.py檔，但是django的專案管理規則很嚴謹
我可以把同個app所需要用到的template、def、static都放在同個資料夾
同時，也有urls.py跟views.py跟model.py來管理動線，真的很嚴謹!!!

後來我在研究csrf，Cross Site Request Forgery，跨站請求偽造
django預設會開啟，server端會產生一組token，post的時候會一起帶
如果符合，才接受Post請求，反之給予403forbidden
但是django的token似乎不是每次reload都會重新生成一組
好像是有4小時的時效，而且會直接放在cookie
但是flask的extension(flask-wtf)不會把token放在cookie
而是要開發者在template設置標籤來存放，如hidden input value = token
且每次reload page token都會改變，跟django的做法有一點不一樣
開啟之後，ajax post只要在headers帶上token，就可以成功post資料了
如果想透過cross lite來post表單，由於沒有session token，所以照樣會被擋住

10/11
如果傳送到server的資料帶有敏感資訊，應該改用post，並且用csrf保護

另外，其實在samelite的情況，cookie本身就會在headers一起被送出
可以用request.cookies.get(key)來取得，很多APP的寫法其實都可以推翻
我現在的後端資安部分太弱了，至少也要學會怎麼用flask套件來保護使用者資訊
經過我不專業的測試，flask的session應該也是跟cookie很類似，每個人都有獨立的session
然後一樣是瀏覽器全部關閉之後，session就會expire，這樣的話就很好管理了耶!!!

另外，使用ajax接收flask的redirect(url_for("def名稱"))，雖然會return render_template
但是並不會自動轉址，只會把對應路徑的.html文檔return回去，所以還是在js重新導向即可

另外，我之前就很想知道能不能在return render_template的時候就把html的檔案編輯
例如今天我希望在首頁顯示"哈囉，xxx"，但是xxx = 使用者姓名，我大可把使用者姓名
set cookie，在到前端選取標籤然後用標籤.innerHTML = 使用者姓名，但前端js的程式碼
大家都可以看的到，比較隱私的東西、js程式碼邏輯若不想被人看到，是否在後端就先完成

10/12
如果每次在UserCenter Reload Page都要重新get_balance是不是沒有這個必要呢？
在login的時候就先get_balance，之後把balance存在session然後紀錄現金流
另外，UnreadMailLength可以在後端直接完成，用jinja2語法寫進UserCenter.html
可以減少一次post的時間，有了session之後，前端很多ajax都不需要再送一堆資料了
在contact.html這邊，上傳的image會先丟到js的AllUrl，但是這個很容易可以被竄改
可能會導致後端程式執行錯誤，所以我打算也是先用session佔存，成功SendAdvise之後
再把session清除，盡量避免資料的反覆傳輸
session刪除可以用 session.pop(key,None) 或者全部刪除 session.clear()
session新增可以用 session[key] = value
session修改可以用 session[key] = value 然後 session.modified = True

10/13
Paragraph.html的相關app與前端js修正完畢
另外，其實可以把GetCertainParagraph跟PublishParagraph.html合併
但是由於牽扯到太多進階的js操作DOM元素，用python寫不是那麼的方便
為了避免先return template再把文章內容利用js寫進元素內，中間造成的時間差(0.x秒)
我的做法是先把body style display = none，等GetCertainParagraph完，再恢復display
這樣的話，當使用者看到畫面的時候，就已經是包含文章內容的頁面了，感覺像是同時產生的

另外，GetCertainParagraph改成用post，這樣沒有帶csrf_token就直接400 bad request
如果用爬蟲get的方式，可能會因為session沒有username這個key導致raise KeyValueError

InsertNewParagraph這個function，優化了對於paragraph的斷行邏輯判斷，有<img>的情況
前後的文字就要用\n隔開，但是又要細分是否有前後文字、前後文字是否本來就已經斷行了

另外，由於session，所以InsertEmotionToResponse之後可以馬上判斷是否發送mail
就可以不用發送兩個post，程式碼也可以更精簡，針對FloorAndEmotion由於是元素id
是可以被更改的，所以在發送到後端之前，可以先用js判斷FloorAndEmotion是否合法
如果不合法，直接reload，合法的話，才把資料送到後端去做處理，可以減輕後端的壓力
也可以避免後端的程式碼error的情況產生

10/14
SeeParagraph前端js以及後端app的優化，InsertNewResponse跟MailFromTagResponse
還有MailFromParagraphResponse三者可合併，但是我覺得TagResponse的判斷可再優化
我覺得可以像PublishParagraph一樣，如果新增圖片，只要在內文新增<img>就好
那麼留言的話，可能只要用"15F"的prefix，就會自動判斷這是標記別人的留言

10/15
BountyBoard前端js以及後端app優化
突然想到，如果使用者忘記密碼，在我們這邊可以重設密碼，但是區塊鏈那邊的new_did呢？
沒有相關的api能夠重設密碼、找回密碼，那麼我們錢包端就只能直接把密碼明碼的存在DB了

10/16
暫時先把密碼改成明碼存在DB，如果有那種雙向的加密方法當然會更好
UserCenter這邊會儲存session["Unread_Mail"]，目的是避免每次重整網頁，都額外去訪問
資料庫，所以只有當使用者點進mail.html，這時就會更新session，之後回到UserCenter
就可以直接調用session["Unread_Mail"]，省下一次對資料庫請求的成本

另外，目前應該只剩下ChatRoom跟Trade這兩個帶有socket的頁面要處理

10/19
ChatRoom跟Trade的頁面優化完成

10/20
errorhandler為何無法處理500的訊息？
因為在debug = True的情況，error的處理會不一樣
其中又有區分使用ajax pull request跟使用瀏覽器的get，回傳error的地方又不一樣
目前由於使用者資料已經由session掌管，所以會有internal server error通常是keyError
缺少username的情況，代表使用者在未登入的情況嘗試使用各app，才會出現這錯誤

假設errorhandler(500)處理的都是KeyError，通常會出錯都是在post request，且需要跟
資料庫進行交流，所以在設計頁面的時候，一般get的頁面通常不會有InternalServerError
所以訪客是可以登入的，但是如果牽扯到資料庫的新增刪除查詢修改，就會要使用者登入
由於我幾乎都是用ajax post不會改變網址，所以後端就算return redirect or render_template 
也都是回傳到success:function(python_result)，所以.html就會變成字串or物件，隨便啦
結論是，還是得透過操作前端js來讓使用者的網頁轉向

ChatRoom.html的網址應該不用帶RoomID，先在Confirm確認_id跟username有match
這時就可以知道RoomID，在return render_template這邊就可以帶過去，並且寫入js const
不然每次request.args.get都還要在那邊字串切割，真的有夠麻煩==
另外在Confirm這邊，key ChatRoom對應的value希望可以改成string，不然int str互轉麻煩

10/23
原本如果偵測到使用者沒有登入，會另開新頁面，登入之後再關閉，但這樣會有一個小問題
就是部分頁面在登入後是需要重新整理的，所以我後來改成window.location.replace的方式
這樣可以避免使用者登入之後又跳到上一頁(還沒refresh的訪客狀態)也可以在使用者登入之後
重新redirect到他原本的頁面，方法是Login.html?redirect=原本的location.href，使用者
登入成功之後，檢查網址後面有沒有帶參數，有的話就redirect到指定地點，反之UserCenter

Contact、Paragraph、Pair優化完成，本次優化的重點：
1. HTML跟CSS分離
2. 需要認證身分(require session["username"])的APP，如果是用ajax post，其js要優化
3. csrf-token於前端傳遞的優化
4. 單純向資料庫請求資料，並且寫進HTML，這些APP基本上可以和return render_template
的那些APP去做合併，例如ChatRoom.html就可以和GetAllChatHistory去做合併
減少一次POST的時間，也可以讓後端的程式碼更加精簡，而不會說充斥著太多不必要的route

目前尚未完成：
trade.html跟GetAllChatHistory合併、BountyBoard跟GetAllBounty還有GetMyBounty合併
Games跟Mail也要優化，之後再做一次完整的debug，把目前網頁沒有的功能一次統整起來

10/26
trade.html跟GetAllChatHistory合併。交易狀態(log)如果為None，則前端的js就不要執行
BountyBoard跟GetAllBounty還有GetMyBounty合併，如果沒有session["username"]
那麼就無法瀏覽這個頁面，所以其他post的request，例如deleteBounty等等，就不用更改了

10/27
Games優化、Mail優化，只剩最後的地毯式debug
