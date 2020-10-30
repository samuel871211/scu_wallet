const _id = location.href.split("_id=")[1];
var sockets = io.connect();
const ChatRoomID = $('meta[name=ChatRoomID]').attr('content');
const username = $('meta[name=MyName]').attr('content');
$('meta[name=ChatRoomID]')[0].remove();
$('meta[name=MyName]')[0].remove();
document.getElementById("BottomArea").style["top"] = (document.getElementById("header").clientHeight+document.getElementById("TwoBtnTable").clientHeight)+"px";
document.getElementById("ShowArea").style["top"] = (document.getElementById("header").clientHeight+document.getElementById("TwoBtnTable").clientHeight)+"px";
document.getElementById("ShowArea").style["bottom"] = document.getElementById("InputArea").clientHeight + "px";

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/trade/style.css";
    head.appendChild(mycss);
};

$(document).ready(function(){
    if ($('meta[name=log]').attr('content') != "None"){
        var python_result = JSON.parse($('meta[name=log]').attr('content'));
        var table = document.getElementById("LogTable");
        for (i=0;i<python_result.username.length;i++){
            
            var tr = table.insertRow(table.rows.length);
            var td = tr.insertCell(0);
            
            var LogDiv = document.createElement("div");
            LogDiv.setAttribute("class","LogDiv");

            var TimeDiv = document.createElement("div");
            TimeDiv.align = "right";
            TimeDiv.innerText = python_result.time[i];
            if (python_result.action[i].split(",")[0] == "CancelReason"){                 
                var b = document.createElement("b");
                b.innerText = "#原因:"+python_result.action[i].split(",")[1];
                LogDiv.innerHTML = python_result.username[i]+"提出了取消任務的請求"+b.outerHTML;
                if (python_result.username[i] == username){
                    document.querySelectorAll("#TwoBtnDiv button")[0].setAttribute("onclick","Warning('Case0')");
                    document.querySelectorAll("#TwoBtnDiv button")[1].setAttribute("onclick","Warning('Case1')");
                };
            } else {
                LogDiv.innerHTML = python_result.username[i]+"表示任務已完成";
                if (python_result.username[i] == username){
                    document.querySelectorAll("#TwoBtnDiv button")[0].setAttribute("onclick","Warning('Case2')");
                    document.querySelectorAll("#TwoBtnDiv button")[1].setAttribute("onclick","Warning('Case3')");
                };
            };
            td.appendChild(LogDiv);
            td.appendChild(TimeDiv);
        };
    };
    $('meta[name=log]')[0].remove();

    var python_result = JSON.parse($('meta[name=history]').attr('content'));
    $('meta[name=history]')[0].remove();
    document.getElementById("partner").innerHTML = python_result.names[0][username].split(",")[0];
    document.getElementById("SelfieDiv").src = python_result.names[0][username].split(",")[2];
    for (i=0;i<python_result.username.length;i++){
        if (python_result.reply[i] != "n"){
            var parent = document.getElementById("StartFromHere");
            var MessageAreaDiv = document.createElement("div");
            MessageAreaDiv.setAttribute("class","MessageAreaDiv");
            var Btn = document.createElement("button");
            Btn.setAttribute("class","texts")
            Btn.setAttribute("onclick","Actions(this)");
            var img = document.createElement("img");
            img.setAttribute("class","selfie");
            img.style = "float:left;padding-right:5px;margin-left:0";
            img.src = python_result.reply[i].split(",")[1];
            var ResponseOrigin = document.createElement("div");
            ResponseOrigin.style = "padding-left:45px;min-height:40px";
            ResponseOrigin.setAttribute("class","ResponseOrigin,"+python_result.reply[i].split(",")[0]);
            ResponseOrigin.innerText = python_result.reply[i].split(",")[2];
            if (ResponseOrigin.innerText == "Message Unavailable"){ResponseOrigin.innerText = "訊息已收回"};
            var hr = document.createElement("hr");
            var TimeFont = document.createElement("font");
            TimeFont.innerHTML = python_result.time[i];
            var ResponseDiv = document.createElement("div");
            ResponseDiv.innerText = python_result.message[i];
            Btn.appendChild(img);
            Btn.appendChild(ResponseOrigin);
            Btn.appendChild(hr);
            Btn.appendChild(ResponseDiv);
            if (python_result.username[i] == username){
                TimeFont.setAttribute("class","MyTimeFont");
                MessageAreaDiv.align = "right";
                MessageAreaDiv.appendChild(TimeFont);
                MessageAreaDiv.appendChild(Btn);
            } else if (python_result.username[i] != username){
                TimeFont.setAttribute("class","YourTimeFont");
                TimeFont.style["display"] = "inline-block";
                MessageAreaDiv.appendChild(Btn);
                MessageAreaDiv.appendChild(TimeFont);
            };
            parent.appendChild(MessageAreaDiv);
        } else {
            var parent = document.getElementById("StartFromHere");    
            var MessageAreaDiv = document.createElement("div");
            MessageAreaDiv.setAttribute("class","MessageAreaDiv");
            var TimeFont = document.createElement("font");
            var Btn = document.createElement("button");
            Btn.setAttribute("onclick","Actions(this)");
            
            if (python_result.username[i] == username){
                TimeFont.setAttribute("class","MyTimeFont");
                MessageAreaDiv.align = "right";
                if (python_result.read[i] == "y"){
                    TimeFont.innerHTML = "Read<br>"+python_result.time[i];
                } else {TimeFont.innerHTML = python_result.time[i]};
                if (python_result.message[i].slice(0,9) == "<img src="){
                    Btn.setAttribute("class","Images");
                    Btn.innerHTML = python_result.message[i];
                } else{
                    Btn.setAttribute("class","texts")
                    Btn.innerText = python_result.message[i];
                };
                MessageAreaDiv.appendChild(TimeFont);
                MessageAreaDiv.appendChild(Btn);
            } else if (python_result.username[i] != username){
                var selfie = document.createElement("img");
                selfie.setAttribute("class","selfie");
                selfie.src = document.getElementById("SelfieDiv").src;
                TimeFont.setAttribute("class","YourTimeFont")
                TimeFont.innerHTML = python_result.time[i];
                MessageAreaDiv.align = "left";
                if (python_result.message[i].slice(0,9) == "<img src="){
                    Btn.setAttribute("class","Images");
                    Btn.removeAttribute("onclick");
                    Btn.style["cursor"] = "default";
                    Btn.innerHTML = python_result.message[i];
                } else{
                    Btn.setAttribute("class","texts");
                    Btn.innerText = python_result.message[i];
                };
                MessageAreaDiv.appendChild(selfie);
                MessageAreaDiv.appendChild(Btn);
                MessageAreaDiv.appendChild(TimeFont);
            };
            if (python_result.message[i] == "Unsent a message" &&  python_result.time[i] == ""){
                Btn.removeAttribute("onclick");
                Btn.style["cursor"] = "default";
                Btn.innerHTML = "訊息已收回";
                TimeFont.style["display"] = "none";
            }
            parent.appendChild(MessageAreaDiv);
        };
    };
    document.querySelectorAll(".MessageAreaDiv button")[0].removeAttribute("onclick");
    document.querySelectorAll(".MessageAreaDiv button")[0].style["cursor"] = "default";
    document.querySelectorAll(".MessageAreaDiv button")[1].removeAttribute("onclick");
    document.querySelectorAll(".MessageAreaDiv button")[1].style["cursor"] = "default";
    document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
    sockets.emit('EnterOrReload',ChatRoomID,document.getElementById("partner").innerHTML,document.getElementsByClassName("MessageAreaDiv").length);
})

function Warning(arg){
    if (arg == "Case0"){alert("您先前已經提出取消任務的請求了，請耐心等待對方回應")}
    else if (arg == "Case1"){
        r = confirm("您先前已經提出取消任務的請求了，是否確定任務已完成？");
        if (r==true){CompleteTrade()};
    }
    else if (arg == "Case2"){alert("您先前已經表示任務已完成了，無法取消任務")}
    else if (arg == "Case3"){alert("您先前已經表示任務已完成了，請耐心等待對方回應")}
}

function UserCenter(){window.location.assign("/UserCenter.html")}

function star(arg){
    for (i=0;i<3;i++){
        document.querySelectorAll("#ReviewDiv i")[i].style["color"] = "#fff830";
        if (document.querySelectorAll("#ReviewDiv i")[i] == arg){
            for (j=i+1;j<3;j++){document.querySelectorAll("#ReviewDiv i")[j].style["color"] = ""};
            break;
        };
    };
}

function DisplayChatRoom(){
    var td1 = document.getElementsByClassName("UnderLine")[0];
    var td2 = document.getElementsByClassName("UnderLine")[1];
    if (td1.style["display"] == "none"){
        document.getElementById("ChatRoom").style["display"] = "";
        document.getElementById("progress").style["display"] = "none";
        $(td1).show("slide",{direction:"right"});
        $(td2).hide("slide",{direction:"left"});
    };
}

function DisplayProgress(){
    var td1 = document.getElementsByClassName("UnderLine")[0];
    var td2 = document.getElementsByClassName("UnderLine")[1];
    if (td2.style["display"] == "none"){
        document.getElementById("ChatRoom").style["display"] = "none";
        document.getElementById("progress").style["display"] = "";
        $(td1).hide("slide",{direction:"right"});
        $(td2).show("slide",{direction:"left"});
    };
}

function TriggerSelect(){$("#CancelDiv").fadeToggle()}

function CancelConfirm(){
    setTimeout(function(){
        if (document.querySelector("#ReviewDiv textarea").value == ""){
            alert("請留下一些評價給對方吧~");
            document.getElementById("CancelDiv").style["display"] = "none";
            document.querySelector("#CancelDiv select").value = "請選擇取消原因";
            return;
        } else if (document.querySelector("#ReviewDiv i").style["color"] == ""){
            alert("請留下評價星等給對方吧~");
            document.getElementById("CancelDiv").style["display"] = "none";
            document.querySelector("#CancelDiv select").value = "請選擇取消原因";
            return;
        };

        var review = document.querySelector("#ReviewDiv textarea").value;
        var stars = 1;
        for (i=0;i<3;i++){
            if (document.querySelectorAll("#ReviewDiv i")[i].style["color"] == ""){
                stars = i+1;
                break;
            };
        };

        r = confirm("取消任務原因："+document.querySelector("#CancelDiv select").value+"\n注意：當您發起取消任務之後，需等待對方也同意取消任務，此筆任務才會撤銷!");
        if (r==true){

            document.querySelector("#ReviewDiv textarea").value = "";
            for (i=0;i<3;i++){document.querySelectorAll("#ReviewDiv i")[i].style["color"] = ""};
            sockets.emit('TradingStatus',ChatRoomID,_id,username,String(new Date()).split(" ")[4].slice(0,5),stars+"stars"+review,document.querySelector("#CancelDiv select").value);
        } else if (r==false) {
            document.getElementById("CancelDiv").style["display"] = "none";
            document.querySelector("#CancelDiv select").value = "請選擇取消原因";
        };
    },300)
}

function CompleteTrade(){
    if (document.getElementById("CancelDiv").style["display"] == ""){
        TriggerSelect();
        return;
    };
    if (document.querySelector("#ReviewDiv textarea").value == ""){
        alert("請留下一些評價給對方吧~");
        return;
    } else if (document.querySelector("#ReviewDiv i").style["color"] == ""){
        alert("請留下評價星等給對方吧~");
        return;
    };

    var review = document.querySelector("#ReviewDiv textarea").value;
    var stars = 1;
    for (i=0;i<3;i++){
        if (document.querySelectorAll("#ReviewDiv i")[i].style["color"] == ""){
            stars = i+1;
            break;
        };
    };
    r = confirm("請確定任務已完成，再按下確認!\n注意：當您表示任務已完成之後，需等待對方也表示任務已完成，此筆任務才算完成!");
        if (r==true){

            document.querySelector("#ReviewDiv textarea").value = "";
            for (i=0;i<3;i++){document.querySelectorAll("#ReviewDiv i")[i].style["color"] = ""};
            sockets.emit('TradingStatus',ChatRoomID,_id,username,String(new Date()).split(" ")[4].slice(0,5),stars+"stars"+review,"");
        };
}

function SmoothScroll(){
    document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"});
    $("#NewMessage").slideToggle();
};

function Scroll(){
    if (document.getElementById("SendMessage").placeholder != "" && document.getElementById("SendMessage").placeholder.slice(0,2) == "回覆"){return}
    else{
        window.addEventListener("resize",function(){
            document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
        });
    };
}

function copy(){
    var TextRange = document.createRange();
    TextRange.selectNode(target);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(TextRange);
    document.execCommand("copy");
    Actions();
}

function unsend(){
    for (i=0;i<document.querySelectorAll(".MessageAreaDiv").length;i++){
        if (document.querySelectorAll(".MessageAreaDiv button")[i] == target){
            sockets.emit('unsend',ChatRoomID,i);
            Actions();
        };
    };
}

function UploadImage(){
    var file = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    if(file){reader.readAsDataURL(file)};
    reader.addEventListener("load",function(){
        var img = document.createElement("img");
        img.src = reader.result;
        document.getElementById("ImgContainer").appendChild(img);
        if (img.width>0 && (file.size/1024/1024<=1 || img.width<=1024)){
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            var compressed = canvas.toDataURL('image/jpeg');
            sockets.emit('ImageUpload',ChatRoomID,username,String(new Date()).split(" ")[4].slice(0,5),compressed.split("base64,")[1])
        } else {
            UploadImage();
        };
    })
}

function NewData() {
    if (document.getElementById("SendMessage").placeholder == ""){
        var message = document.getElementById("SendMessage").value;
        if(message != ""){
            sockets.emit('TextMessage',ChatRoomID,username,String(new Date()).split(" ")[4].slice(0,5),message);
            document.getElementById("SendMessage").value = "";
        };
    } else if (document.getElementById("SendMessage").placeholder.slice(0,3) == "回覆【" && target != ""){
        if (target.innerText == "訊息已收回" && target.getAttribute("onclick") == null){
            document.getElementById("SendMessage").placeholder = "";
            NewData();
        } else {reply()};
    };
}

function ReplyMode(){
    if (target.innerText == "訊息已收回" && target.getAttribute("onclick") == null){
        Actions();
        target = "";
        return;
    }
    for (i=0;i<target.children.length;i++){
        if (target.children[i].outerHTML == "<hr>"){
            document.getElementById("SendMessage").placeholder = "回覆【"+target.lastChild.innerText+"】";
            Actions();
            return;
        };
    };
    document.getElementById("SendMessage").placeholder = "回覆【"+target.innerText+"】";
    Actions();
}

function reply(){
    var message = document.getElementById("SendMessage").value;
    if (message != ""){
        for (i=0;i<document.querySelectorAll(".MessageAreaDiv").length;i++){
            if (document.querySelectorAll(".MessageAreaDiv button")[i] == target){
                var src = document.querySelectorAll(".MessageAreaDiv")[i].getElementsByTagName("img")[0].src;
                var det = true;
                for (j=0;j<document.querySelectorAll(".MessageAreaDiv button")[i].children.length;j++){
                    if (document.querySelectorAll(".MessageAreaDiv button")[i].children[j].outerHTML == "<hr>"){
                        var origin = document.querySelectorAll(".MessageAreaDiv button")[i].lastChild.innerText;
                        sockets.emit('reply',ChatRoomID,username,String(new Date()).split(" ")[4].slice(0,5),i,message,src,origin);
                        document.getElementById("SendMessage").value = "";
                        return;
                    };
                };
                var origin = document.querySelectorAll(".MessageAreaDiv button")[i].innerText;
                sockets.emit('reply',ChatRoomID,username,String(new Date()).split(" ")[4].slice(0,5),i,message,src,origin);
                document.getElementById("SendMessage").value = "";
            };
        };
    }
}

target = "";
function Actions(arg){
    $("#GrayBackground").fadeToggle();
    $("#Actions").fadeToggle();
    if (arg != undefined){
        if (arg.parentNode.align == "right"){
            document.querySelectorAll(".ThreeBtn")[0].style["display"] = "";
            document.querySelectorAll(".ThreeBtn")[1].style["display"] = "none";
            document.querySelectorAll(".ThreeBtn")[2].style["display"] = "";
            if (arg.className == "Images"){
                document.querySelectorAll(".ThreeBtn")[0].style["display"] = "none";
                arg.style["border"] = "3px solid #57d8ff";
            } else {arg.style["background-color"] = "#57d8ff"};
        } else {
            document.querySelectorAll(".ThreeBtn")[1].style["display"] = "";
            document.querySelectorAll(".ThreeBtn")[1].style["display"] = "";
            document.querySelectorAll(".ThreeBtn")[2].style["display"] = "none";
            arg.style["background-color"] = "#57d8ff";
        };
        target = arg;
    } else {
        target.style["background-color"] = "";
        target.style["border"] = "";
    };
}

function LeaveChatRoom(){window.location.assign('/UserCenter.html')}

function Back(){window.location.assign("/Pair.html")}

var socket = io();

socket.on(ChatRoomID+'TradingStatus',function(python_result){
    if (python_result.CancelReason == ""){
        if (python_result.username == username){
            document.querySelectorAll("#TwoBtnDiv button")[0].setAttribute("onclick","Warning('Case2')");
            document.querySelectorAll("#TwoBtnDiv button")[1].setAttribute("onclick","Warning('Case3')");
        };
        if (python_result.status == "Cannot Find"){
            alert("此筆任務已完成!");
            window.location.assign("/UserCenter.html");
        } else if (python_result.status == "Duplicate Request" && python_result.username == username){
            alert("您先前已經表示任務已完成了，請耐心等待對方回應");
        } else {
            var table = document.getElementById("LogTable");
            var tr = table.insertRow(table.rows.length);
            var td = tr.insertCell(0);
            
            var LogDiv = document.createElement("div");
            LogDiv.setAttribute("class","LogDiv");
            LogDiv.innerHTML = python_result.username+"表示任務已完成";

            var TimeDiv = document.createElement("div");
            TimeDiv.align = "right";
            TimeDiv.innerText = python_result.time;

            td.appendChild(LogDiv);
            td.appendChild(TimeDiv);

            if (python_result.status == "TradingCompleted"){
                if (python_result.poster != username && python_result.IsReceived == "n"){
                    alert("任務已完成~東吳幣發送失敗...請到會員中心>回報>領取東吳幣");
                } else {
                    console.log("任務已完成");
                    alert("任務已完成~");
                };
                window.location.assign("/UserCenter.html");
            };
        };
    } else if (python_result.CancelReason != ""){
        if (python_result.username == username){
            document.getElementById("CancelDiv").style["display"] = "none";
            document.querySelector("#CancelDiv select").value = "請選擇取消原因";
            document.querySelectorAll("#TwoBtnDiv button")[0].setAttribute("onclick","Warning('Case0')");
            document.querySelectorAll("#TwoBtnDiv button")[1].setAttribute("onclick","Warning('Case1')");
        };
        if (python_result == "Cannot Find"){
            alert("此筆任務已完成!");
            window.location.assign("/UserCenter.html");
        } else if (python_result == "Duplicate Request" && python_result.username == username){
            alert("您先前已經提出取消任務的請求了，請耐心等待對方回應");
        } else {
            var table = document.getElementById("LogTable");
            var tr = table.insertRow(table.rows.length);
            var td = tr.insertCell(0);
            
            var LogDiv = document.createElement("div");
            LogDiv.setAttribute("class","LogDiv");
            var b = document.createElement("b");
            b.innerText = "#原因:"+python_result.CancelReason;
            LogDiv.innerHTML = python_result.username+"提出了取消任務的請求"+b.outerHTML;

            var TimeDiv = document.createElement("div");
            TimeDiv.align = "right";
            TimeDiv.innerText = python_result.time;

            td.appendChild(LogDiv);
            td.appendChild(TimeDiv);

            if (python_result.status == "TradingCanceled"){
                if (python_result.poster == username && python_result.IsReceived == "n"){
                    alert("任務已取消~東吳幣發送失敗...請到會員中心>回報>領取東吳幣");
                } else {
                    console.log("任務已取消");
                    alert("任務已取消~");
                };
                window.location.assign("/UserCenter.html");
            };
        };
    };
})

socket.on(ChatRoomID+"reply",function(python_result){
    var parent = document.getElementById("StartFromHere");
    var MessageAreaDiv = document.createElement("div");
    MessageAreaDiv.setAttribute("class","MessageAreaDiv");
    var Btn = document.createElement("button");
    Btn.setAttribute("class","texts")
    Btn.setAttribute("onclick","Actions(this)");
    var img = document.createElement("img");
    img.setAttribute("class","selfie");
    img.style = "float:left;padding-right:5px;margin-left:0";
    img.src = python_result.src;
    var ResponseOrigin = document.createElement("div");
    ResponseOrigin.style = "padding-left:45px;min-height:40px";
    ResponseOrigin.setAttribute("class","ResponseOrigin,"+python_result.curlen);
    if (document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].innerHTML.indexOf("<hr>") == -1){
        ResponseOrigin.innerHTML = document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].innerHTML;
    } else {ResponseOrigin.innerHTML = document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].lastChild.innerHTML};
    var hr = document.createElement("hr");
    var TimeFont = document.createElement("font");
    TimeFont.innerHTML = python_result.time;
    var ResponseDiv = document.createElement("div");
    ResponseDiv.innerText = python_result.message;
    // var array = python_result.message.split("\n");
    // for(i=0;i<array.length;i++){
    //     var div = document.createElement("div");
    //     div.innerText = array[i];
    //     ResponseDiv.appendChild(div);
    // }; 
    Btn.appendChild(img);
    Btn.appendChild(ResponseOrigin);
    Btn.appendChild(hr);
    Btn.appendChild(ResponseDiv);
    if (python_result.username == username){
        TimeFont.setAttribute("class","MyTimeFont");
        MessageAreaDiv.align = "right";
        MessageAreaDiv.appendChild(TimeFont);
        MessageAreaDiv.appendChild(Btn);
        parent.appendChild(MessageAreaDiv);
        document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"});
        target = "";
        document.getElementById("SendMessage").placeholder = "";
    } else if (python_result.username != username){
        TimeFont.setAttribute("class","YourTimeFont");
        TimeFont.style["display"] = "inline-block";
        MessageAreaDiv.appendChild(Btn);
        MessageAreaDiv.appendChild(TimeFont);
        sockets.emit('InstantRead',ChatRoomID,document.getElementById("partner").innerHTML,document.getElementsByClassName("MessageAreaDiv").length);
        parent.appendChild(MessageAreaDiv);
        var LastMsgHeight = document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].clientHeight;
        var CurrentHeight = document.getElementById("ShowArea").scrollHeight - document.getElementById("ShowArea").scrollTop - document.getElementById("ShowArea").clientHeight;
        if (document.getElementById("ShowArea").clientHeight > CurrentHeight){
            console.log(document.getElementById("ShowArea").clientHeight,CurrentHeight);
            document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
        } else {
            console.log(document.getElementById("ShowArea").clientHeight,CurrentHeight);
            $("#NewMessage").fadeToggle();
        };
    };
})

socket.on(ChatRoomID+"unsend",function(python_result){
    document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].innerText = "訊息已收回";
    document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].removeAttribute("onclick");
    document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].setAttribute("class","texts");
    document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen].style["cursor"] = "default";
    document.querySelectorAll(".MessageAreaDiv font")[python_result.curlen].style["display"] = "none";

    var ReplyLength = document.getElementsByClassName("ResponseOrigin,"+python_result.curlen).length;
    var ReplyArray = [];
    for (i=0;i<ReplyLength;i++){document.getElementsByClassName("ResponseOrigin,"+python_result.curlen)[i].innerText = "訊息已收回"};
    for (i=0;i<document.getElementsByClassName("MessageAreaDiv").length;i++){
        if (document.getElementsByClassName("MessageAreaDiv")[i].getElementsByTagName("div").length != 0){
            if (document.getElementsByClassName("MessageAreaDiv")[i].getElementsByTagName("div")[0].className == "ResponseOrigin,"+python_result.curlen){
                ReplyArray.push(i);
                if (ReplyArray.length == ReplyLength){
                    sockets.emit('UpdateReply',ChatRoomID,JSON.stringify(ReplyArray));
                    break;
                };
            };
        };
    };

    if (document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen] == target && document.getElementById("header").style["display"] == "none"){Actions(target)};
})

socket.on(ChatRoomID+username+"EnterOrReload",function(python_result){
    for (i=0;i<python_result.curlen;i++){
        if (document.querySelectorAll(".MessageAreaDiv font")[i].className == "MyTimeFont" && document.querySelectorAll(".MessageAreaDiv font")[i].innerText.length == 5){
            document.querySelectorAll(".MessageAreaDiv font")[i].innerHTML = "Read<br>"+document.querySelectorAll(".MessageAreaDiv font")[i].innerHTML;
        };
    };
})

socket.on(ChatRoomID+"ImageUpload",function(python_result){
    if (python_result.message == "Image Upload Failed"){return};
    var parent = document.getElementById("StartFromHere");
    var MessageAreaDiv = document.createElement("div");
    MessageAreaDiv.setAttribute("class","MessageAreaDiv");
    var TimeFont = document.createElement("font");
    TimeFont.innerHTML = python_result.time;
    var Btn = document.createElement("button");
    Btn.setAttribute("class","Images");
    Btn.innerHTML = python_result.message;
    if (python_result.username == username){
        Btn.setAttribute("onclick","Actions(this)");
        TimeFont.setAttribute("class","MyTimeFont");
        MessageAreaDiv.align = "right";
        MessageAreaDiv.appendChild(TimeFont);
        MessageAreaDiv.appendChild(Btn);
        parent.appendChild(MessageAreaDiv);
        document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"}); 
    } else if (python_result.username != username){
        var selfie = document.createElement("img");
        selfie.setAttribute("class","selfie");
        selfie.src = document.getElementById("SelfieDiv").src;
        TimeFont.setAttribute("class","YourTimeFont")
        Btn.style["cursor"] = "default";
        MessageAreaDiv.appendChild(selfie);
        MessageAreaDiv.appendChild(Btn);
        MessageAreaDiv.appendChild(TimeFont);
        sockets.emit('InstantRead',ChatRoomID,document.getElementById("partner").innerHTML,document.getElementsByClassName("MessageAreaDiv").length);
        parent.appendChild(MessageAreaDiv);
        var LastMsgHeight = document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].clientHeight;
        var CurrentHeight = document.getElementById("ShowArea").scrollHeight - document.getElementById("ShowArea").scrollTop - document.getElementById("ShowArea").clientHeight;
        if (document.getElementById("ShowArea").clientHeight > CurrentHeight){
            console.log(document.getElementById("ShowArea").clientHeight,CurrentHeight);
            document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
        } else {
            console.log(document.getElementById("ShowArea").clientHeight,CurrentHeight);
            $("#NewMessage").fadeToggle();
        };
    };
})

socket.on(ChatRoomID,function(python_result){
    if (python_result.message == "Image Upload Failed"){return};
    var parent = document.getElementById("StartFromHere");
    var MessageAreaDiv = document.createElement("div");
    MessageAreaDiv.setAttribute("class","MessageAreaDiv");
    var TimeFont = document.createElement("font");
    TimeFont.innerHTML = python_result.time;
    var Btn = document.createElement("button");
    Btn.setAttribute("class","texts")
    Btn.setAttribute("onclick","Actions(this)");
    if (python_result.username == username){
        TimeFont.setAttribute("class","MyTimeFont");
        MessageAreaDiv.align = "right";
        Btn.innerText = python_result.message;  
        MessageAreaDiv.appendChild(TimeFont);
        MessageAreaDiv.appendChild(Btn);
        parent.appendChild(MessageAreaDiv);
        document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"});  
    } else if (python_result.username != username){
        var selfie = document.createElement("img");
        selfie.setAttribute("class","selfie");
        selfie.src = document.getElementById("SelfieDiv").src;
        TimeFont.setAttribute("class","YourTimeFont")
        Btn.innerText = python_result.message;
        MessageAreaDiv.appendChild(selfie);
        MessageAreaDiv.appendChild(Btn);
        MessageAreaDiv.appendChild(TimeFont);
        sockets.emit('InstantRead',ChatRoomID,document.getElementById("partner").innerHTML,document.getElementsByClassName("MessageAreaDiv").length);
        parent.appendChild(MessageAreaDiv);
        var LastMsgHeight = document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].clientHeight;
        var CurrentHeight = document.getElementById("ShowArea").scrollHeight - document.getElementById("ShowArea").scrollTop - document.getElementById("ShowArea").clientHeight;
        if (document.getElementById("ShowArea").clientHeight > CurrentHeight){
            console.log(document.getElementById("ShowArea").clientHeight,CurrentHeight);
            document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
        } else {
            console.log(document.getElementById("ShowArea").clientHeight,CurrentHeight);
            $("#NewMessage").fadeToggle();
        };
    };
})

socket.on(ChatRoomID+username+"InstantRead",function(python_result){
    document.querySelectorAll(".MessageAreaDiv font")[python_result.curlen].innerHTML = "Read<br>"+document.querySelectorAll(".MessageAreaDiv font")[python_result.curlen].innerHTML;
})

$("#ShowArea").scroll(function(){
    var CurrentHeight = document.getElementById("ShowArea").scrollHeight - document.getElementById("ShowArea").scrollTop - document.getElementById("ShowArea").clientHeight;
    if (CurrentHeight < 1 && document.getElementById("NewMessage").style["display"] == ""){$("#NewMessage").fadeToggle();console.log("自行滑到底部")};
});