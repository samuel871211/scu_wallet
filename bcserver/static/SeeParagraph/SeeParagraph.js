$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/SeeParagraph/style.css";
    head.appendChild(mycss);
};
const _id = location.href.split("_id=")[1];
const username = $("#MyInfo div")[1].innerHTML.split("<br>")[0];
const major = $("#MyInfo div")[1].innerHTML.split("<br>")[1];
const selfie = $("#MyInfo img")[0].src;
const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

function UserCenter(){window.location.assign("/UserCenter.html")}
function Paragraph(){window.location.assign("/Paragraph.html")}
function Scroll(){document.getElementById("BottomArea").scrollTop = document.getElementById("BottomArea").scrollHeight}

$(document).ready(function(){
    var python_result = JSON.parse($('meta[name=res]').attr('content'));
    $('meta[name=res]')[0].remove;
    if (python_result.like.indexOf(username) != -1){document.querySelectorAll("#ThreeTd i")[0].style["color"] = "#249cff"}
    else if (python_result.dislike.indexOf(username) != -1){document.querySelectorAll("#ThreeTd i")[1].style["color"] = "#249cff"};
    
    var array = python_result.paragraph.split("\n");
    var TempNode = document.createElement("div");
    for (i=0;i<array.length;i++){
        if (array[i].slice(0,4) == "<img"){
            check = $.parseHTML(array[i])[0];
            if (check.className == "ParagraphImg" && check.getAttribute("onclick") == "Zoom(this)"){TempNode.innerHTML = TempNode.innerHTML + array[i]};
        } else {
            var div = document.createElement("div");
            if (array[i] != ""){div.innerText = array[i]}
            else {div.innerHTML = "<br>"};
            TempNode.appendChild(div);
        };
    };
    document.getElementById("paragraph").innerHTML = TempNode.innerHTML;

    for(i=0;i<python_result.response[0].content.length;i++){
        
        var TableObj = document.getElementById("AllResponse");

        var tr1 = TableObj.insertRow(TableObj.rows.length);
        
        var ResponserInfo = tr1.insertCell(0); //頭貼、姓名、學系
        ResponserInfo.setAttribute("class","ResponserInfo");
        var div1 = document.createElement("div");
        var img = document.createElement("img");  
        var div2 = document.createElement("div");
        img.src = python_result.response[0].username[i].split(",")[2];
        div2.innerHTML = python_result.response[0].username[i].split(",")[0]+"<br>"+python_result.response[0].username[i].split(",")[1];
        if (div2.innerHTML.split("<br>")[0] == "unknown" && div2.innerHTML.split("<br>")[1] == "SCU"){div2.innerHTML = "匿名<br>東吳大學"};

        div1.appendChild(img);
        div1.appendChild(div2);
        ResponserInfo.appendChild(div1);

        var ResponserThree = tr1.insertCell(1); //讚數、噓數、時間
        var div1 = document.createElement("div");
        div1.setAttribute("class","ThreeDiv");
        div1.align = "right";                       
        var div2 = document.createElement("div"); 
        var LikeBtn = document.createElement("i");
        LikeBtn.id = String(i+1)+",like"; 
        LikeBtn.setAttribute("class","fa fa-thumbs-up fa-lg fa-fw");
        LikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)"); 
        var likeCount = document.createElement("b");
        likeCount.id = String(i+1)+",likeCount";
        likeCount.innerHTML = python_result.response[0].like[i].length;
        var DislikeBtn = document.createElement("i");
        DislikeBtn.id = String(i+1)+",dislike";
        DislikeBtn.setAttribute("class","fa fa-thumbs-down fa-lg fa-fw");
        DislikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)");    
        var DislikeCount = document.createElement("b");
        DislikeCount.id = String(i+1)+",dislikeCount";
        DislikeCount.innerHTML = python_result.response[0].dislike[i].length;
        div2.innerHTML = python_result.response[0].time[i];
        if (python_result.response[0].like[i].indexOf(username) != -1){LikeBtn.style["color"] = "#249cff"}
        else if (python_result.response[0].dislike[i].indexOf(username) != -1){DislikeBtn.style["color"] = "#249cff"};
        div1.appendChild(LikeBtn);
        div1.appendChild(likeCount);
        div1.appendChild(DislikeBtn);
        div1.appendChild(DislikeCount);
        div1.appendChild(div2);
        ResponserThree.appendChild(div1);

        var tr2 = TableObj.insertRow(TableObj.rows.length); //回覆內容
        var Response = tr2.insertCell(0);
        Response.setAttribute("colspan","2");
        Response.setAttribute("class","Response");
        Response.setAttribute("onclick","ReplyOrReport(this)");
        var content = python_result.response[0].content[i];
        if (content == "This response has been deleted"){
            Response.innerHTML = "此留言已被本人刪除";
            Response.removeAttribute("onclick");
            Response.style["cursor"] = "default";
            DislikeBtn.removeAttribute("onclick");
            DislikeBtn.style["cursor"] = "default";
            LikeBtn.removeAttribute("onclick");
            LikeBtn.style["cursor"] = "default";
        } else {
            var TempNode = document.createElement("div");
            var array = content.split("\n");
            console.log(array);
            for (j=0;j<array.length;j++){
                if (array[j].slice(0,2) == "<b" && array[j].indexOf("</b>") != -1){
                    check = $.parseHTML(array[j])[0];
                    if (check.className == "TagPerson"){TempNode.innerHTML = TempNode.innerHTML + array[j]};
                } else {
                    var div = document.createElement("div");
                    if (array[j] == ""){div.innerHTML = "<br>"} 
                    else {div.innerText = array[j]};
                    TempNode.appendChild(div);
                };
            };
            Response.innerHTML = TempNode.innerHTML;
        };
    };
    document.body.style["display"] = "";
})

function Zoom(arg){
    if (arg.style["width"] == "50%" || arg.style["width"] == ""){
        arg.style["width"] = "100%";
        arg.style["margin-right"] = "0%";
    } else {
        arg.style["width"] = "50%";
        arg.style["margin-right"] = "50%";
    };
}

function InsertEmotionToResponse(FloorAndEmotion){
    if (FloorAndEmotion.split(",")[1] != "like" && 
        FloorAndEmotion.split(",")[1] != "dislike"){
        window.location.reload();
        return};
    if (isNaN(parseInt(FloorAndEmotion.split(",")[0])) == true || 
        parseInt(FloorAndEmotion.split(",")[0]) > $("#AllResponse")[0].rows.length/2 || 
        parseInt(FloorAndEmotion.split(",")[0]) < 1){
        window.location.reload();
        return};
    $.ajax({
        url:"/InsertEmotionToResponse",
        headers:{"X-CSRFToken":token},
        type:"POST",
        data:{"_id":_id,"FloorAndEmotion":FloorAndEmotion},
        success: function(python_result){
            if (python_result == "Duplicate sending emotion"){
                alert("您已經針對這則回覆給予過評價了");
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split(":5000/")[1]);
            } else if (python_result == "OK"){
                document.getElementById(FloorAndEmotion+"Count").innerHTML = Number(document.getElementById(FloorAndEmotion+"Count").innerHTML)+1;          
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}

function InsertEmotionToParagraph(emotion){
    if (emotion != "like" && emotion != "dislike"){
        window.location.reload();
        return;
    };
    $.ajax({
        url:"/InsertEmotionToParagraph",
        headers:{"X-CSRFToken":token},
        type:"POST",
        data:{"_id":_id,"emotion":emotion},
        success: function(python_result){
            if (python_result == "Duplicate sending emotion"){
                alert("您已經針對這篇文章給予過評價了");
            } else if (python_result == "OK"){
                document.getElementById(emotion).innerHTML = Number(document.getElementById(emotion).innerHTML)+1;
                if (emotion == 'like'){document.querySelectorAll("#ThreeTd i")[0].style["color"] = "#249cff"}
                else {document.querySelectorAll("#ThreeTd i")[1].style["color"] = "#249cff"};
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split(":5000/")[1]);
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}

function InsertNewResponse() {
    if (document.getElementById("content").value == ""){return false}
    var time = GetCurrentTime();
    var content = document.getElementById("content").value;
    var TempNode = document.createElement("div");
    var array = content.split("\n");
    for (i=0;i<array.length;i++){
        var div = document.createElement("div");
        if (array[i] == ""){div.innerHTML = "<br>"} 
        else {div.innerText = array[i]};
        TempNode.appendChild(div);
    };
    if (document.getElementById("content").placeholder.slice(0,2) == "編輯"){
        if (document.getElementsByClassName("Response")[floor-1].children[0].tagName == "B"){
            content = document.getElementsByClassName("Response")[floor-1].children[0].outerHTML + "\n" +content;
            TempNode.insertBefore(document.getElementsByClassName("Response")[floor-1].children[0],TempNode.children[0]);   
        };
        $.ajax({
            url:'/EditResponse',
            headers:{"X-CSRFToken":token},
            type:"POST",
            data:{
                "_id":_id,
                "content":content,
                "time":time,
                "floor":parseInt(floor)-1,
                "major":$(".hide b")[0].innerText,
                "selfie":$(".hide b")[1].innerText
            },
            success:function(python_result){
                if (python_result == "請求失敗"){
                    alert(python_result);
                    window.location.reload();
                    return;
                } else if (python_result == "Invaild Login Status"){
                    alert("偵測到您尚未登入，系統將為您導向登入頁面");
                    window.location.replace("Login.html?redirect="+location.href.split(":5000/")[1]);
                    return;
                };
                document.querySelectorAll(".ResponserInfo div img")[floor-1].src = python_result.split(",")[2];
                document.querySelectorAll(".ResponserInfo div div")[floor-1].innerHTML = python_result.split(",")[0]+"<br>"+python_result.split(",")[1];
                document.querySelectorAll(".ThreeDiv div")[floor-1].innerHTML = time;
                document.getElementsByClassName("Response")[floor-1].innerHTML = TempNode.innerHTML;
                document.getElementById("content").value = "";
                document.getElementById("content").placeholder = "留言...";
                if (document.getElementById("content").style["height"] != ""){FullScreenEdit('EditOk')};
                var tr1 = $("#AllResponse tr")[floor*2-1];
                var tr2 = $("#AllResponse tr")[floor*2-2];
                setTimeout(function(){
                    tr1.style["display"] = "none";
                    tr2.style["display"] = "none";
                    $(tr1).fadeToggle();
                    $(tr2).fadeToggle();
                },300)
            },
            error:function(error){
                console.log(error);
                alert("留言編輯失敗，請重試");
            }
        })
        return;
    }
    var TableObj = document.getElementById("AllResponse");
    var i = TableObj.rows.length/2;
    var tr1 = TableObj.insertRow(TableObj.rows.length);
    tr1.style["display"] = "none";
    
    var ResponserInfo = tr1.insertCell(0); //頭貼、姓名、學系
    ResponserInfo.setAttribute("class","ResponserInfo");
    var div1 = document.createElement("div");
    var img = document.createElement("img");  
    var div2 = document.createElement("div");
    img.src = document.querySelector("#MyInfo div img").src;
    div2.innerHTML = document.querySelector("#MyInfo div div").innerHTML;
    div1.appendChild(img);
    div1.appendChild(div2);
    ResponserInfo.appendChild(div1);

    var ResponserThree = tr1.insertCell(1); //讚數、噓數、時間
    var div1 = document.createElement("div");
    div1.setAttribute("class","ThreeDiv");
    div1.align = "right";                       
    var div2 = document.createElement("div"); 
    var LikeBtn = document.createElement("i");
    LikeBtn.id = String(i+1)+",like"; 
    LikeBtn.setAttribute("class","fa fa-thumbs-up fa-lg fa-fw");
    LikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)"); 
    var likeCount = document.createElement("b");
    likeCount.id = String(i+1)+",likeCount";
    likeCount.innerHTML = "0";
    var DislikeBtn = document.createElement("i");
    DislikeBtn.id = String(i+1)+",dislike";
    DislikeBtn.setAttribute("class","fa fa-thumbs-down fa-lg fa-fw");
    DislikeBtn.setAttribute("onclick","InsertEmotionToResponse(this.id)");    
    var DislikeCount = document.createElement("b");
    DislikeCount.id = String(i+1)+",dislikeCount";
    DislikeCount.innerHTML = "0";
    div2.innerHTML = time;
    div1.appendChild(LikeBtn);
    div1.appendChild(likeCount);
    div1.appendChild(DislikeBtn);
    div1.appendChild(DislikeCount);
    div1.appendChild(div2);
    ResponserThree.appendChild(div1);

    var tr2 = TableObj.insertRow(TableObj.rows.length); //回覆內容
    tr2.style["display"] = "none";
    var Response = tr2.insertCell(0);
    Response.setAttribute("colspan","2");
    Response.setAttribute("class","Response");
    Response.setAttribute("onclick","ReplyOrReport(this)");

    var placeholder = document.getElementById("content").placeholder;
    if (placeholder.slice(0,2) == "回覆"){
        var TagPerson = document.createElement("b");
        TagPerson.setAttribute("class","TagPerson");
        TagPerson.innerHTML = placeholder.split("樓")[1].split("的留言")[0]+" ";
        Response.appendChild(TagPerson);
    };
    var TagAndContent = Response.innerHTML + "\n" + content;
    if (Response.innerHTML == ""){TagAndContent = content};
    Response.innerHTML = Response.innerHTML+TempNode.innerHTML;
    if (document.getElementById("content").style["height"] != ""){FullScreenEdit("InsertOk")};
    setTimeout(function(){
        $(tr1).fadeToggle();
        $(tr2).fadeToggle();
    },300)
    $.ajax({
        url:"/InsertNewResponse",
        headers:{"X-CSRFToken":token},
        type:"POST",
        data:{
            "major":$(".hide b")[0].innerText,
            "selfie":$(".hide b")[1].innerText,
            "content":TagAndContent,
            "time":time,
            "_id":_id,
            "placeholder":placeholder
        },
        success: function(python_result){
            if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split(":5000/")[1]);
                TableObj.deleteRow(TableObj.rows.length-1);
                TableObj.deleteRow(TableObj.rows.length-1);
            };
        },
        error: function(error){
            TableObj.deleteRow(TableObj.rows.length-1);
            TableObj.deleteRow(TableObj.rows.length-1);
            alert("留言上傳失敗，請重新嘗試");
        }
    })
    document.getElementById("content").value = "";
    document.getElementById("content").placeholder = "留言...";
    document.getElementById("response").innerHTML = parseInt(document.getElementById("response").innerHTML)+1;
}

var target = "";
var action = "";
function ReplyOrReport(arg){
    target = arg.parentNode.previousSibling;
    var TagPerson = arg.parentNode.previousSibling.children[0].children[0].children[1].innerHTML.split("<br>")[0];
    floor = "";
    for(i=0;i<document.getElementsByClassName("Response").length;i++){
        if (document.getElementsByClassName("Response")[i] == arg){
            floor = i+1;
            break;
        };
    };
    if (TagPerson == username){
        document.getElementById("ReplyOrReportTable").style["display"] = "none";
        document.getElementById("DeleteOrEditTable").style["display"] = "";
    } else {
        document.getElementById("ReplyOrReportTable").style["display"] = "";
        document.getElementById("DeleteOrEditTable").style["display"] = "none";
    };
    $("#FourActionDiv").fadeToggle();
}

function Close(){$("#FourActionDiv").fadeToggle()}

function report(){
    $("#ReportDiv").fadeToggle();
    document.getElementById("GrayArea").removeAttribute("onclick");
}

function OnchangeReport(){
    if (document.querySelector("#ReportDiv select").value == "檢舉原因"){return};
    if (document.querySelector("#ReportDiv select").value == "其他原因"){
        document.getElementById("ReportDiv").style["display"] = "none";
        $("#OtherReasonDiv").fadeToggle();
        return;
    }
    setTimeout(function(){
        var reason = document.querySelector("#ReportDiv select").value;
        r = confirm("檢舉原因："+reason+"\n確認檢舉？(如果您惡意檢舉他人的留言，將會被禁止檢舉功能)");
        if (r == true){
            SendReport();
        } else {
            document.getElementById("GrayArea").setAttribute("onclick","Close()");
            document.getElementById("GrayArea").click();
            $("#ReportDiv").fadeToggle();
            setTimeout(function(){document.querySelector("#ReportDiv select").value = "檢舉原因"},500)
        };
    }) 
}

function SendReport(){
    var reason = document.querySelector("#ReportDiv select").value;
    if (reason == "其他原因"){reason = document.getElementById("ReportReason").value};
    if (reason == ""){return};
    $.ajax({
        url:"/Report",
        headers:{"X-CSRFToken":token},
        type:"POST",
        data:{
            "reason":reason,
            "origin":_id,
            "floor":parseInt(floor)-1,
            "username":document.getElementById("AllResponse").rows[floor*2-2].cells[0].children[0].children[1].innerHTML.split("<br>")[0]
        },
        success:function(python_result){
            if (python_result == "No"){
                window.location.reload();
                return;
            } else if (python_result == "Duplicate Sending Report"){
                alert("此留言已有人檢舉，我們將會盡快審核~");
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split(":5000/")[1]);
            } else {
                alert("檢舉成功");
            };
            document.getElementById("GrayArea").setAttribute("onclick","Close()");
            document.getElementById("GrayArea").click();
            if (document.getElementById("ReportDiv").style["display"] == "none"){
                $("#OtherReasonDiv").fadeToggle()
            } else {$("#ReportDiv").fadeToggle()};
        },
        error:function(error){
            console.log(error);
            alert("檢舉失敗，請重新嘗試");
            document.getElementById("GrayArea").setAttribute("onclick","Close()");
            document.getElementById("GrayArea").click();
            if (document.getElementById("ReportDiv").style["display"] == "none"){
                $("#OtherReasonDiv").fadeToggle()
            } else {$("#ReportDiv").fadeToggle()};
        }
    })
}

function Cancel(){
    document.getElementById("GrayArea").setAttribute("onclick","Close()");
    document.getElementById("GrayArea").click();
    $("#OtherReasonDiv").fadeToggle();
    setTimeout(function(){document.querySelector("#ReportDiv select").value = "檢舉原因"},500)
}
function reply(){
    action = "reply";
    var TagPerson = document.getElementById("AllResponse").rows[floor*2-2].cells[0].children[0].children[1].innerHTML.split("<br>")[0];
    var TagContent = document.getElementById("AllResponse").rows[floor*2-1].cells[0];
    
    var PreviousResponse = document.createElement("textarea");
    if (TagContent.children[0].tagName != "B"){PreviousResponse.value = TagContent.children[0].innerText+"\n"};
    for (i=1;i<TagContent.children.length;i++){PreviousResponse.value = PreviousResponse.value + TagContent.children[i].innerText+"\n"};
    
    document.getElementById("content").placeholder = "回覆"+floor+"樓"+TagPerson+"的留言：\n\n"+PreviousResponse.value.slice(0,PreviousResponse.value.length-1);
    Close();
    FullScreenEdit();
    document.getElementById("BottomArea").scrollTop = document.getElementById("BottomArea").scrollHeight;
}

function GetCurrentTime(){
    var a = new Date();
    var month = String(a.getMonth()+1);
    var date = String(a.getDate());
    var hour = String(a.getHours());
    var minute = String(a.getMinutes());
    if (month.length == 1){month = "0" + month};
    if (date.length == 1){date = "0" + date};
    if (hour.length == 1){hour = "0"+hour};
    if (minute.length == 1){minute = "0" + minute};
    var time = month  + "/" + date + " " + hour + ":" + minute;
    return time
}

function Delete(){
    r = confirm("確定刪除此留言？(此操作不可復原)");
    if (r == true){
        var time = GetCurrentTime();
        $.ajax({
            url:'/DeleteResponse',
            headers:{"X-CSRFToken":token},
            type:"POST",
            data:{
                "_id":_id,
                "floor":parseInt(floor)-1,
                "time":time
            },
            success:function(python_result){                  
                Close();
                var tr1 = $("#AllResponse tr")[floor*2-1];
                var tr2 = $("#AllResponse tr")[floor*2-2];
                tr1.style["visibility"] = "hidden";
                tr2.style["visibility"] = "hidden";
                document.querySelectorAll(".ResponserInfo div img")[floor-1].src = "/static/emoji.svg";
                document.querySelectorAll(".ResponserInfo div div")[floor-1].innerHTML = "匿名<br>東吳大學";
                document.querySelectorAll(".ThreeDiv div")[floor-1].innerHTML = time;
                document.getElementsByClassName("Response")[floor-1].innerHTML = "此留言已被本人刪除";
                
                document.getElementsByClassName("Response")[floor-1].removeAttribute("onclick");
                document.getElementsByClassName("Response")[floor-1].style["cursor"] = "default";
                document.getElementById(floor+",like").removeAttribute("onclick");
                document.getElementById(floor+",like").style["cursor"] = "default";
                document.getElementById(floor+",dislike").removeAttribute("onclick");
                document.getElementById(floor+",dislike").style["cursor"] = "default";

                setTimeout(function(){
                    tr1.style["visibility"] = "";
                    tr2.style["visibility"] = "";
                    tr1.style["display"] = "none";
                    tr2.style["display"] = "none";
                    $(tr1).fadeToggle();
                    $(tr2).fadeToggle();
                },300)
            },
            error:function(error){
                console.log(error);
                alert("文章刪除失敗，請重新嘗試");
            }
        })
    } else {Close()};
}

function edit(){
    action = "edit";
    var td1 = document.getElementsByClassName("ResponserInfo")[parseInt(floor)-1]
    var td2 = document.getElementsByClassName("Response")[parseInt(floor)-1]
    Close();
    FullScreenEdit();
    document.querySelector("#MyInfo div img").src = td1.children[0].children[0].src;
    document.querySelector("#MyInfo div div").innerHTML = td1.children[0].children[1].innerHTML;
    document.getElementById("content").placeholder = "編輯"+floor+"樓您的留言...";
    var PreviousResponse = document.createElement("textarea");
    if (td2.children[0].tagName != "B"){PreviousResponse.value = td2.children[0].innerText+"\n"};
    for (i=1;i<td2.children.length;i++){PreviousResponse.value = PreviousResponse.value + td2.children[i].innerText+"\n"};
    document.getElementById("content").value = PreviousResponse.value.slice(0,PreviousResponse.value.length-1); //remove the last "\n"
    if (td1.children[0].children[1].innerHTML.split("<br>")[1] == "東吳大學"){document.getElementsByClassName("hide")[0].click()};
    if (td1.children[0].children[0].src.split(":5000")[1] == "/static/emoji.svg"){document.getElementsByClassName("hide")[1].click()};
}

function FullScreenEdit(arg){
    if (document.getElementById("content").style["height"] == "40px" || document.getElementById("content").style["height"] == ""){
        document.getElementById("content").style = "border:none;width:96%;font-size:20px;font-weight:bold;font-family:Microsoft JhengHei";
        var height = document.getElementById("BottomArea").clientHeight - 100;
        document.getElementById("content").style["height"] = height+"px";
        document.getElementsByClassName("hide")[0].style["display"] = "";
        document.getElementsByClassName("hide")[1].style["display"] = "";
        document.getElementById("ParagraphInfo").style["display"] = "none";
        document.getElementById("AllResponse").style["display"] = "none";
        document.getElementById("NoMore").style["display"] = "none";
        document.getElementById("ResponseArea").style = "position:fixed;bottom:0;top:70px";
        document.getElementById("ResponseArea").style["display"] = "none";
        $("#ResponseArea").fadeToggle();
    }else {
        document.getElementById("content").style = "";
        document.getElementById("ParagraphInfo").style["display"] = "";
        document.getElementById("AllResponse").style["display"] = "";
        document.getElementById("NoMore").style["display"] = "";
        document.getElementById("ResponseArea").style["display"] = "";
        document.getElementById("ResponseArea").style = "";
        document.getElementsByClassName("hide")[0].style["display"] = "none";
        document.getElementsByClassName("hide")[1].style["display"] = "none";
        if (arg == "EditOk"){
            target.scrollIntoView({block:"center"});
            target = "";
            action = "";
        } else if (arg == "InsertOk" || arg == undefined){
            console.log("hello");
            document.getElementById("BottomArea").scrollTop = document.getElementById("BottomArea").scrollHeight;
            if (arg == "InsertOk"){
                target = "";
                action = "";
            };
        };
    };
}

function hide(arg){
    if (arg.style["color"] == "" || arg.style["color"] == "black"){
        arg.style["color"] = "#cccccc";
        if (arg.children[1].innerHTML == "顯示學系"){
            arg.children[1].innerHTML = "隱藏學系";
            document.querySelector("#MyInfo div div").innerHTML = document.querySelector("#MyInfo div div").innerHTML.split("<br>")[0] + "<br>" + "東吳大學";
        } else {
            arg.children[1].innerHTML = "隱藏頭像";
            document.querySelector("#MyInfo div img").src = "/static/emoji.svg";
        };
    } else {
        arg.style["color"] = "black";
        if (arg.children[1].innerHTML == "隱藏學系"){
            arg.children[1].innerHTML = "顯示學系";
            document.querySelector("#MyInfo div div").innerHTML = document.querySelector("#MyInfo div div").innerHTML.split("<br>")[0] + "<br>" + major;
        } else {
            arg.children[1].innerHTML = "顯示頭像";
            document.querySelector("#MyInfo div img").src = selfie;
        };
    };
}