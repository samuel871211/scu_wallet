const _id = location.href.split("_id=")[1];
const partner = document.getElementById("partner").innerHTML;
const room = $('meta[name=room]').attr('content');
const SelfieDiv = $('meta[name=SelfieDiv]').attr('content');
const username = $('meta[name=MyName]').attr('content');
const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();
$('meta[name=SelfieDiv]')[0].remove();
$('meta[name=MyName]')[0].remove();
$('meta[name=room]')[0].remove();
var sockets = io.connect();

$(document).ready(function(){
    var python_result = JSON.parse($('meta[name=python_result]').attr('content'));
    $('meta[name=python_result]')[0].remove();
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
                selfie.src = SelfieDiv;
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
    document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
    sockets.emit('EnterOrReload',room,partner,document.getElementsByClassName("MessageAreaDiv").length);
})

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

function unsend(){
    for (i=0;i<document.querySelectorAll(".MessageAreaDiv").length;i++){
        if (document.querySelectorAll(".MessageAreaDiv button")[i] == target){
            sockets.emit('unsend',room,i);
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
            sockets.emit('ImageUpload',room,username,String(new Date()).split(" ")[4].slice(0,5),compressed.split("base64,")[1])
        } else {
            UploadImage();
        }
    })
}

function NewData() {
    if (document.getElementById("SendMessage").placeholder == ""){
        var message = document.getElementById("SendMessage").value;
        if(message != ""){
            sockets.emit('TextMessage',room,username,String(new Date()).split(" ")[4].slice(0,5),message);
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
                        sockets.emit('reply',room,username,String(new Date()).split(" ")[4].slice(0,5),i,message,src,origin);
                        document.getElementById("SendMessage").value = "";
                        return;
                    };
                };
                var origin = document.querySelectorAll(".MessageAreaDiv button")[i].innerText;
                sockets.emit('reply',room,username,String(new Date()).split(" ")[4].slice(0,5),i,message,src,origin);
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

function copy(){
    var TextRange = document.createRange();
    TextRange.selectNode(target);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(TextRange);
    document.execCommand("copy");
    Actions();
}

function LeaveChatRoom(){window.location.assign('/UserCenter.html')}

function Back(){window.location.assign("/Pair.html")}

var socket = io();

socket.on(room+"reply",function(python_result){
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
        // Actions(target);
        target = "";
        document.getElementById("SendMessage").placeholder = "";
        parent.appendChild(MessageAreaDiv);
        document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"});
    } else if (python_result.username != username){
        TimeFont.setAttribute("class","YourTimeFont");
        TimeFont.style["display"] = "inline-block";
        MessageAreaDiv.appendChild(Btn);
        MessageAreaDiv.appendChild(TimeFont);
        sockets.emit('InstantRead',room,partner,document.getElementsByClassName("MessageAreaDiv").length);
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

socket.on(room+"unsend",function(python_result){
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
                    sockets.emit('UpdateReply',room,JSON.stringify(ReplyArray));
                    break;
                };
            };
        };
    };

    if (document.querySelectorAll(".MessageAreaDiv button")[python_result.curlen] == target && document.getElementById("header").style["display"] == "none"){Actions(target)};
})

socket.on(room+username+"EnterOrReload",function(python_result){
    for (i=0;i<python_result.curlen;i++){
        if (document.querySelectorAll(".MessageAreaDiv font")[i].className == "MyTimeFont" && document.querySelectorAll(".MessageAreaDiv font")[i].innerText.length == 5){
            document.querySelectorAll(".MessageAreaDiv font")[i].innerHTML = "Read<br>"+document.querySelectorAll(".MessageAreaDiv font")[i].innerHTML;
        };
    };
})

socket.on(room+"ImageUpload",function(python_result){
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
        TimeFont.setAttribute("class","MyTimeFont");
        MessageAreaDiv.align = "right";
        MessageAreaDiv.appendChild(TimeFont);
        Btn.setAttribute("onclick","Actions(this)");
        MessageAreaDiv.appendChild(Btn);
        parent.appendChild(MessageAreaDiv);
        document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"}); 
    } else if (python_result.username != username){
        var selfie = document.createElement("img");
        selfie.setAttribute("class","selfie");
        selfie.src = SelfieDiv;
        TimeFont.setAttribute("class","YourTimeFont")
        Btn.style["cursor"] = "default";
        MessageAreaDiv.appendChild(selfie);
        MessageAreaDiv.appendChild(Btn);
        MessageAreaDiv.appendChild(TimeFont);
        sockets.emit('InstantRead',room,partner,document.getElementsByClassName("MessageAreaDiv").length);
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
    // parent.appendChild(MessageAreaDiv);
    // document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
})

socket.on(room,function(python_result){
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
        // var array = python_result.message.split("\n");
        // for(i=0;i<array.length;i++){
        //     var div = document.createElement("div");
        //     div.innerText = array[i];
        //     Btn.appendChild(div);
        // };     
        MessageAreaDiv.appendChild(TimeFont);
        MessageAreaDiv.appendChild(Btn);
        parent.appendChild(MessageAreaDiv);
        document.getElementsByClassName("MessageAreaDiv")[document.getElementsByClassName("MessageAreaDiv").length-1].scrollIntoView({behavior:"smooth"});  
    } else if (python_result.username != username){
        var selfie = document.createElement("img");
        selfie.setAttribute("class","selfie");
        selfie.src = SelfieDiv;
        TimeFont.setAttribute("class","YourTimeFont")
        Btn.innerText = python_result.message;
        MessageAreaDiv.appendChild(selfie);
        MessageAreaDiv.appendChild(Btn);
        MessageAreaDiv.appendChild(TimeFont);
        sockets.emit('InstantRead',room,partner,document.getElementsByClassName("MessageAreaDiv").length);
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
    // document.getElementById("ShowArea").scrollTop = document.getElementById("ShowArea").scrollHeight;
})

socket.on(room+username+"InstantRead",function(python_result){
    document.querySelectorAll(".MessageAreaDiv font")[python_result.curlen].innerHTML = "Read<br>"+document.querySelectorAll(".MessageAreaDiv font")[python_result.curlen].innerHTML;
})


// window.addEventListener(scroll,function(){
//     var scrollint = $(window).scrollTop();
//     if ($(window).height() + $(window).scrollTop() == $(document).height()) {
//        console.log('到底了喔'+scrollint );
//     }
// })
$("#ShowArea").scroll(function(){
    var CurrentHeight = document.getElementById("ShowArea").scrollHeight - document.getElementById("ShowArea").scrollTop - document.getElementById("ShowArea").clientHeight;
    if (CurrentHeight < 1 && document.getElementById("NewMessage").style["display"] == ""){$("#NewMessage").fadeToggle();console.log("自行滑到底部")};
});