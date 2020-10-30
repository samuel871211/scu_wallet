const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/pair/style.css";
    head.appendChild(mycss);
};

function UserCenter() {window.location.assign("/UserCenter.html")}

function hide(arg){
    if (arg.style["color"] == "rgb(59, 176, 255)"){
        arg.style["color"] = "#cccccc";
        if (arg.children[1].innerHTML == "顯示學系"){
            arg.children[1].innerHTML = "隱藏學系";
        } else {arg.children[1].innerHTML = "隱藏頭像"};
    } else {
        arg.style["color"] = "rgb(59, 176, 255)";
        if (arg.children[1].innerHTML == "隱藏學系"){
            arg.children[1].innerHTML = "顯示學系";
        } else {arg.children[1].innerHTML = "顯示頭像"};
    };
}

function JoinDailyPair() {
    var major = document.getElementsByClassName("hide")[0].children[1].innerHTML;
    var selfie = document.getElementsByClassName("hide")[1].children[1].innerHTML;
    var r = confirm("報名身分："+major+"、"+selfie+"\n"+"是否消耗1顆東吳幣參與配對？");
    if (r == false){return false}
    document.querySelector("#header button").disabled = true;
    document.querySelector("#JoinArea button").disabled = true;
    document.querySelector("#StartToChat button").disabled = true;
    document.getElementById("notice").innerHTML = '<b>報名中，請稍後 </b><i class="fa fa-spinner fa-spin fa-pulse"></i>';
    document.getElementById("notice").style["visibility"] = "";
    $.ajax({
        url:"/JoinDailyPair",
        headers:{"X-CSRFToken":token},
        type:"POST",
        data:{"major":major,"selfie":selfie},
        success: function(python_result){
            if (python_result == "Duplicate request."){
                document.getElementById("notice").innerHTML = "<b>您今日已經報名成功囉~</b>";
            } else if (python_result == "Get Txn Failed."){
                document.getElementById("notice").innerHTML = "<b>獲取東吳幣失敗，請重新嘗試</b>";
            } else if (python_result == "Send Token Failed."){
                document.getElementById("notice").innerHTML = "<b>轉帳失敗，請重新嘗試</b>";
            } else if (python_result == "OK."){
                document.getElementById("notice").innerHTML = "<b>報名成功~</b>";
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                return;
            };
            document.querySelector("#header button").disabled = false;
            document.querySelector("#JoinArea button").disabled = false;
            document.querySelector("#StartToChat button").disabled = false;
        },
        error: function(error) {
            document.getElementById("notice").innerHTML = "<b>報名失敗，請重新嘗試</b>";
            document.querySelector("#header button").disabled = false;
            document.querySelector("#JoinArea button").disabled = false;
            document.querySelector("#StartToChat button").disabled = false;
        }
    });
}

function EnterChatRoom() {
    $.ajax({
        url:"/EnterChatRoom",
        headers:{"X-CSRFToken":token},
        type:"POST",
        success: function(python_result){
            if (python_result == "User didn't join"){
                alert("您今日還沒參與配對哦~");          
            } else if (python_result == "No Match"){
                alert("您今日還沒配對到對象哦~");
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
            } else {window.location.assign("/ChatRoom.html?_id="+python_result)};
        },
        error: function(error){
            console.log(error);
            alert("聊天室進入失敗，請重新嘗試");
        }
    })
}