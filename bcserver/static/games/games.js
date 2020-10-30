const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

function GetToday(){
    var a = new Date();             
    var month = String(a.getMonth()+1);
    var date = String(a.getDate());
    if (month.length == 1){month = "0" + month};
    if (date.length == 1){date = "0" + date};
    return String(a.getFullYear() + "-" + month  + "-" + date);
}

function GetCurTime(){
    var a = new Date();             
    var hour = String(a.getHours())
    var minute = String(a.getMinutes())
    if (hour.length == 1){hour = "0" + hour};
    if (minute.length == 1){minute = "0" +minute};
    return String(hour + ":" + minute);
}
var IsJoinAB = false;
var FiveNumber = [];

$(document).ready(function(){
    var CurTime = GetCurTime();
    $("#FirstArea").slideDown("slow");
    document.getElementById("date").value = GetToday();
    if ("23:59" >= CurTime && CurTime >= "20:00"){
        document.getElementById("WinningNumbersBtn").style["color"] = "black";
        document.getElementById("WinningNumbersBtn").innerHTML = "今日開獎";
        document.getElementById("Btn40").disabled = true;
    } else if ("20:00" > CurTime && CurTime >= "00:00"){
        document.getElementById("WinningNumbersBtn").style["color"] = "#878787";
        document.getElementById("WinningNumbersBtn").innerHTML = "尚未開獎";
        document.getElementById("WinningNumbersBtn").disabled = true;
    };
})

function UserCenter() {window.location.assign("/UserCenter.html")}

function up(arg){
    $("#FirstArea").slideUp("slow");  
    setTimeout(function(){
        if (arg=="DisplayAB"){
            if (IsJoinAB == false){JoinABGame()};
            $("#SecondArea").toggle("slide");
        } else {
            $("#ThirdArea").toggle("slide");
        };
    },700);
}

function down(arg){
    $("#"+arg).toggle("slide");
    setTimeout(function(){$("#FirstArea").slideDown("slow")},700);
}

function GameInstructions(arg){
    if (arg == "AB"){
        alert("系統會隨機生成一個四位數\n\
            且四個位數不會重複\n\
            如5667、5555這類數字皆不會出現\n\
            您所猜測的四個位數也不可重複！\n\
            只要在10次內(含)猜到這個四位數\n\
            就可以獲得1顆東吳幣！");
    } else if (arg == "539"){
        alert("從1~39的數字中，選不重複的5個數字\n\
            每期開獎時，系統將隨機開出5個號碼\n\
            活動時間：每日00:00~19:59\n\
            開獎時間：每日20:00~23:59\n\
            獎勵分級制度:\n\
            頭獎--猜中五個數字\n\
            貳獎--猜中四個數字\n\
            參獎--猜中三個數字\n\
            肆獎--猜中兩個數字\n\
            伍獎--猜中一個數字\n\
            陸獎--猜中零個數字\n\
            獲得東吳幣的條件：\n\
            1.肆獎(含)以上才有機會可以獲得東吳幣\n\
            2.猜對最多獎號的玩家，即可獲得東吳幣1枚\n\
            3.如無人在參獎(含)以上，則肆獎只取第一人獲獎")
    };
}

function KeyIn(arg){
    var number = document.getElementById("Predict").innerHTML;
    if (arg == "back"){
        document.getElementById("Predict").innerHTML = number.slice(0,number.length-1);
    } else if (arg == "ok"){
        if (number.length == 4){
            document.getElementById("Predict").innerHTML = "";
            if (document.querySelectorAll("#PredictAB div").length == 0 || document.querySelectorAll("#PredictAB div")[document.querySelectorAll("#PredictAB div").length-1].innerHTML != "4A0B"){DetermineAB(number)};
        } else {
            alert("請輸入四位數!");
        };
    } else {
        if (number.length == 4){
            alert("數字長度不可大於四位數!");
        } else {
            if (number.indexOf(arg) == -1){
                document.getElementById("Predict").innerHTML = number + arg;
            } else {
                alert("輸入的四個位數不可重複!");
            };
        };
    };
}

function DetermineAB(number){
    $.ajax({
        url:'/DetermineAB',
        headers:{"X-CSRFToken":token},
        type:"POST",
        data:{"number":number,"today":GetToday()},
        success: function(python_result){
            if (python_result == "AlreadyReceived"){
                return;
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                return;
            };
            var DivNumber = document.createElement("div");
            var DivAB =document.createElement("div");
            DivNumber.innerHTML = number;
            DivNumber.align = "center";
            DivNumber.style["display"] = "none";
            DivAB.innerHTML = python_result.split(",")[1];
            DivAB.align = "center";
            DivAB.style["display"] = "none";
            document.getElementById("PredictNumber").appendChild(DivNumber);
            document.getElementById("PredictAB").appendChild(DivAB);
            $("#PredictNumber div").slice(-1).toggle("slide");
            $("#PredictAB div").slice(-1).toggle("slide");
            document.getElementById("PredictArea").scrollTop = document.getElementById("PredictArea").scrollHeight;
            if (python_result.split(",")[1] == "4A0B"){
                if (python_result.split(",")[0] <= 10){
                    alert("恭喜您在10次以內答對~");
                    down('SecondArea');
                    document.getElementById("PleaseWait").style["display"] = "";
                    ReceiveABGameReward();
                } else if (python_result.split(",")[0] > 10){
                    alert("恭喜您答對了，可惜沒有獎勵!~");
                    down('SecondArea');
                };
            };
        },
        error: function(error){
            console.log(error);
            alert("網路不穩定，請重新輸入");
        }
    })
}

function JoinABGame(){
    var today = GetToday();
    $.ajax({
        url:'/JoinABGame',
        headers:{"X-CSRFToken":token},
        type:'POST',
        data:{"today":today},
        success: function(python_result){
            IsJoinAB = true;
            if (python_result == "new client" || python_result == "today first join"){
                return;
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                return;
            } else if (python_result[today].length == 1){
                return;
            };
            var PredictNumber = document.getElementById("PredictNumber");
            var PredictAB = document.getElementById("PredictAB");
            for (i=1;i<python_result[today].length;i++){
                var DivNumber = document.createElement("div");
                var DivAB =document.createElement("div");
                DivNumber.innerHTML = python_result[today][i].split(",")[0];
                DivNumber.align = "center";
                DivAB.innerHTML = python_result[today][i].split(",")[1];
                DivAB.align = "center";
                PredictNumber.appendChild(DivNumber);
                PredictAB.appendChild(DivAB);
            };
            if (python_result[today][python_result[today].length-1].split(",")[1] == "4A0B" && 
                python_result[today][0].split(",")[1] != "received" && 
                python_result[today].length-1 <= 10){
                setTimeout(function(){
                    alert("重新發送獎勵");
                    down('SecondArea');
                    document.getElementById("PleaseWait").style["display"] = "";
                    ReceiveABGameReward();
                },2000)
            } else if (python_result[today][python_result[today].length-1].split(",")[1] == "4A0B"){
                document.getElementById("ok").disabled = true;
            };
        },
        error: function(error){
            console.log(error);
        }
    })
}

function ReceiveABGameReward(){
    var today = GetToday();
    document.getElementById("DisplayAB").disabled = true;
    document.getElementById("Display539").disabled = true;
    document.querySelector("#HomeIconTd button").disabled = true;
    $.ajax({
        url:'/ReceiveABGameReward',
        headers:{"X-CSRFToken":token},
        type:'POST',
        data:{"today":today},
        success: function(python_result){
            if (python_result == "OK"){
                alert("轉帳成功");
                window.location.assign("/games.html");
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                return;
            } else {
                alert("轉帳失敗，請到會員中心>回報>領取東吳幣");
                window.location.assign("/games.html");
            };
        },
        error: function(error){
            alert("轉帳失敗");
            window.location.assign("/games.html");
        }
    })
}

function ThirdArea(arg){
    $("#ThirdArea_Main").slideToggle();
    $("#"+arg).slideToggle();
}

function DateChange(arg){
    var today = GetToday();
    var CurTime = GetCurTime();
    if (today > arg){
        document.getElementById("WinningNumbersBtn").innerHTML = "歷史查詢";
        document.getElementById("WinningNumbersBtn").style["color"] = "black";
        document.getElementById("WinningNumbersBtn").disabled = false;
    } else if (today == arg){
        if ("23:59" >= CurTime && CurTime >= "20:00"){
            document.getElementById("WinningNumbersBtn").innerHTML = "今日開獎";
            document.getElementById("WinningNumbersBtn").style["color"] = "black";
            document.getElementById("WinningNumbersBtn").disabled = false;
        } else if ("20:00" > CurTime && CurTime >= "00:00"){
            document.getElementById("WinningNumbersBtn").innerHTML = "尚未開獎";
            document.getElementById("WinningNumbersBtn").style["color"] = "#878787";
            document.getElementById("WinningNumbersBtn").disabled = true;
        };
    } else if (today < arg){
        document.getElementById("WinningNumbersBtn").innerHTML = "無法查詢";
        document.getElementById("WinningNumbersBtn").style["color"] = "#878787";
        document.getElementById("WinningNumbersBtn").disabled = true;
    }
}

function WinningNumbers(){
    var today = GetToday();
    var CurTime = GetCurTime();
    var date = document.getElementById("date").value;
    if (date > today){return} 
    else if (date == today && "20:00" > CurTime && CurTime >= "00:00"){return};
    for (i=0;i<6;i++){
        document.getElementsByClassName("NameList")[i].innerHTML = "";
        if (document.getElementsByClassName("BlockBtn")[i].style["color"] == "red"){
            document.getElementsByClassName("BlockBtn")[i].style["color"] = "black";
            document.getElementsByClassName("BlockBtn")[i].style["font-size"] = "18px";
            document.getElementById("WallOfLegend").style["display"] = "none";
        };
    };
    $.ajax({
        url:"/WinningNumbers",
        headers:{"X-CSRFToken":token},
        type:'POST',
        data:{"today":date},
        success: function(python_result){
            if (python_result == "None"){
                alert(date+"沒人參加今彩539");
                $(".Btn10").toggle("");
                for (i=0;i<10;i++){document.getElementsByClassName("Btn10")[i].innerHTML = ""}
                $(".Btn10").toggle("");
                return;
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                return;
            };
            $(".Btn10").toggle("");
            for (i=0;i<5;i++){document.getElementsByClassName("Btn10")[i].innerHTML = python_result.WinningNumbers[i]};
            if (python_result.MyNumbers != "None"){for (i=5;i<10;i++){document.getElementsByClassName("Btn10")[i].innerHTML = python_result.MyNumbers[i-5]}};
            for (i=0;i<python_result.Rank.length;i++){
                var div = document.createElement("div");
                var num = python_result.Rank[i].split(";")[1];
                div.innerHTML = (document.querySelectorAll("#NameList"+num+" div").length+1)+". "+python_result.Rank[i].split(";")[0];
                document.getElementById("NameList"+num).appendChild(div);
            };
            $(".Btn10").toggle("");
        },
        error: function(error){
            console.log(error);
        }
    })
}

function AddNumber(arg,arg2){
    var CurTime = GetCurTime();
    if (arg2 == "ok"){
        if ("23:59" >= CurTime && CurTime >= "20:00"){return};
        Join539();
    } else if(arg2 != "ok"){
        if (arg.style["background-color"] == "" && FiveNumber.length < 5){
            arg.style["background-color"] = "white";
            FiveNumber.push(arg2);
            if (FiveNumber.length == 5){
                $("#Btn40").toggle("slide");
            };
        } else if (arg.style["background-color"] == "white"){
            arg.style["background-color"] = "";
            FiveNumber.splice(FiveNumber.indexOf(arg2),1);
            if (FiveNumber.length == 4){
                $("#Btn40").toggle("slide");
            };
        };
    };
}

function Join539(){
    var today = GetToday();
    $.ajax({
        url:'/Join539',
        headers:{"X-CSRFToken":token},
        type:'POST',
        data:{"numbers":String(FiveNumber),"today":today},
        success: function(python_result){
            if (python_result == "ok"){
                alert("傳送成功，晚上8點開獎~");
                window.location.reload();
            } else if (python_result == "no"){
                alert("您今天已經參加過囉~");
                window.location.reload();
            } else if (python_result == "請求失敗"){
                alert(python_result);
                window.location.reload();
                return;
            } else if (python_result == "Invaild Login Status"){
                alert("偵測到您尚未登入，系統將為您導向登入頁面");
                window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                return;
            };
        },
        error: function(error){
            console.log(error);
            alert("網路問題");
        }
    })
}

function DisplayLevel(arg,arg2){
    if (arg.style["color"] == "" || arg.style["color"] == "black"){
        for (i=0;i<document.getElementsByClassName("BlockBtn").length;i++){
            if (document.getElementsByClassName("BlockBtn")[i].style["color"] == "red"){
                document.getElementsByClassName("BlockBtn")[i].style["color"] = "black";
                document.getElementsByClassName("BlockBtn")[i].style["font-size"] = "18px";
                document.getElementById("WallOfLegend").style["display"] = "none";
                document.getElementById("NameList"+(5-i)).style["display"] = "none";
                break;
            };
        };
        arg.style["color"] = "red";
        arg.style["font-size"] = "20px";
        $("#WallOfLegend").fadeIn();
        document.getElementById("LevelTitle").innerHTML = arg.innerHTML + "名單";
        document.getElementById("NameList"+arg2).style["display"] = "";
    } else {
        $("#WallOfLegend").fadeOut();
        arg.style["color"] = "black";
        arg.style["font-size"] = "18px";
        document.getElementById("NameList"+arg2).style["display"] = "none";
    }
}