const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

$(document).ready(function(){
    document.getElementById("TwoBtnTable").style["top"] = document.getElementById("header").clientHeight + "px";
    document.getElementById("BottomArea").style["top"] = (document.getElementById("header").clientHeight+document.getElementById("TwoBtnTable").clientHeight) + "px";
    document.getElementById("FirstArea").style["width"] = document.getElementById("BottomArea").clientWidth;
    document.getElementById("SecondArea").style["width"] = document.getElementById("BottomArea").clientWidth;
})

function DisplayReceive(){
    if (document.getElementsByClassName("UnderLine")[0].style["display"] == "none"){
        var td1 = document.getElementsByClassName("UnderLine")[0];
        var td2 = document.getElementsByClassName("UnderLine")[1];
        $(td1).show("slide",{direction:"right"});
        $(td2).hide("slide",{direction:"left"});
        document.getElementById("FirstArea").style["display"] = "";
        document.getElementById("SecondArea").style["display"] = "none";
        document.querySelectorAll("#TwoBtnTable button")[0].style["color"] = "blue";
        document.querySelectorAll("#TwoBtnTable button")[1].style["color"] = "#808080";
    };
}

function DisplayContact(){
    if (document.getElementsByClassName("UnderLine")[1].style["display"] == "none"){
        var td1 = document.getElementsByClassName("UnderLine")[0];
        var td2 = document.getElementsByClassName("UnderLine")[1];
        $(td1).hide("slide",{direction:"right"});
        $(td2).show("slide",{direction:"left"});
        document.getElementById("FirstArea").style["display"] = "none";
        document.getElementById("SecondArea").style["display"] = "";
        document.querySelectorAll("#TwoBtnTable button")[0].style["color"] = "#808080";
        document.querySelectorAll("#TwoBtnTable button")[1].style["color"] = "blue";
    };
}

function UserCenter() {window.location.assign("/UserCenter.html")}

function InputClick(arg){
    var allow = ["0","1","2","3","4"];
    if (allow.indexOf(arg) == -1){window.location.reload()};
    if (document.querySelectorAll('input[type=file]')[arg].files[0]){return};
    document.querySelectorAll('input[type=file]')[arg].click();
}

function confirm(){
    var reason = document.getElementById("reason").value;
    setTimeout(function(){
        if (reason == "請選擇領取項目"){
            alert(reason);
        } else {
            $("#GrayBackground").fadeToggle();
            $("#WaitSpin").fadeToggle();
            $.ajax({
                url:'/ReceiveToken',
                type:'POST',
                headers:{"X-CSRFToken":token},
                data:{"reason":reason},
                success:function(python_result){
                    if (python_result == "AlreadyReceived"){
                        alert("您已經領取過註冊獎勵了");
                    } else if (python_result == "Send Token Failed" || python_result == "Get Txn Failed"){
                        alert("轉帳失敗，請重新嘗試");
                    } else if (python_result == "CannotFind"){
                        alert("您目前並沒有待領取的東吳幣");
                    } else if (python_result == "OK"){
                        alert("領取成功~");
                    } else if (python_result == "請求失敗"){
                        alert(python_result);
                        window.location.reload();
                        return;
                    } else if (python_result == "Invaild Login Status"){
                        alert("偵測到您尚未登入，系統將為您導向登入頁面");
                        window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                    };
                    $("#GrayBackground").fadeToggle();
                    $("#WaitSpin").fadeToggle();
                },
                error:function(error){
                    console.log(error);
                    alert("領取失敗，請重新嘗試");
                    $("#GrayBackground").fadeToggle();
                    $("#WaitSpin").fadeToggle();
                }
            })
        }
    },100)
}

function UploadImage(arg){
    var allow = ["0","1","2","3","4"];
    if (allow.indexOf(arg) == -1){
        window.location.reload();
        return;
    };
    var file = document.querySelectorAll('input[type=file]')[arg].files[0];
    var reader = new FileReader();
    if (file){reader.readAsDataURL(file)};
    reader.addEventListener("load",function(){
        var img = document.createElement("img");
        img.src = reader.result;
        document.getElementById("ImgContainer").appendChild(img);
        if (img.width>0 && (file.size/1024/1024<=1 || img.width<=1440)){
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            var compressed = canvas.toDataURL('image/jpeg');
            $.ajax({
                url:'/SendAdvise',
                type:'POST',
                headers:{"X-CSRFToken":token},
                data:{"b64":compressed.split("base64,")[1]},
                success:function(python_result){
                    if (python_result == "Image Upload Failed"){
                        alert("圖片上傳失敗");
                    } else if (python_result == "請求失敗"){
                        alert(python_result);
                        window.location.reload();
                        return;
                    } else if (python_result == "Invaild Login Status"){
                        alert("偵測到您尚未登入，系統將為您導向登入頁面");
                        window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                    } else {
                        var img = document.createElement("img");
                        img.style = "width:100%;height:100%";
                        img.src = python_result;
                        document.getElementsByClassName("InputClick")[arg].innerHTML = "";
                        document.getElementsByClassName("InputClick")[arg].appendChild(img);
                    };
                },
                error:function(error){
                    console.log(error);
                    alert("圖片上傳失敗");
                }
            })
        } else {
            UploadImage(arg);
        }
    })
}

function SendAdvise() {
    var title = document.getElementById("title").value;
    var description = document.getElementById("description").value;
    if (title == "" || description == ""){
        alert("請輸入意見反饋跟詳細描述!");
        return;
    }
    if (title.length <=50 && description.length<=500){
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
        
        $.ajax({
            url:"/SendAdvise",
            type:"POST",
            headers:{"X-CSRFToken":token},
            data:{
                "time":time,
                "title":title,
                "description":description
            },
            success: function(python_result){
                if (python_result == "OK"){
                    alert("回報成功，團隊將會盡快處理!");
                } else if (python_result == "請求失敗"){
                    alert(python_result);
                    window.location.reload();
                    return;
                } else if (python_result == "Invaild Login Status"){
                    alert("偵測到您尚未登入，系統將為您導向登入頁面");
                        window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                };
            },
            error: function(error){
                alert("傳送失敗，請重新嘗試");
            }
        })
    } else{
        alert("字數超過限制!");
        return;
    }
}