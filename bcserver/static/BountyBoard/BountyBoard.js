const token = $('meta[name=csrf-token]').attr('content');
const username = $('meta[name=username]').attr('content');
$('meta[name=csrf-token]')[0].remove();
$('meta[name=username]')[0].remove();

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/BountyBoard/style.css";
    head.appendChild(mycss);
};

function WriteMyBountyToHTML(python_result,index){
    var TableObj = document.getElementById("MyBounty");
    for(i=0;i<index.length;i++){
        var tr = TableObj.insertRow(TableObj.rows.length);
        var td = tr.insertCell(0);
        td.setAttribute("onclick","DeleteBounty(this)");
        
        var MyTiTleDiv = document.createElement("div");
        MyTiTleDiv.setAttribute("class","MyTiTleDiv");
        MyTiTleDiv.innerText = "【"+python_result.class[index[i]]+"】"+python_result.thing[index[i]];
        
        var FourDiv = document.createElement("div");
        FourDiv.setAttribute("class","FourDiv");
        var reward = document.createElement("b");
        reward.innerText = python_result.reward[index[i]];
        var time = document.createElement("b");
        time.innerText = python_result.time[index[i]];
        var place = document.createElement("b");
        place.innerText = python_result.place[index[i]];
        var status = document.createElement("b");
        status.innerText = "等待中";
        FourDiv.innerHTML = '<i class="fa fa-dollar"></i>'+reward.outerHTML+'<i class="fa fa-clock-o"></i>'+time.outerHTML+'<i class="fa fa-university"></i>'+place.outerHTML+' <i class="fa fa-hourglass"></i>'+status.outerHTML;
        td.appendChild(MyTiTleDiv);
        td.appendChild(FourDiv);
    };
}

$(document).ready(function(){
    var python_result = JSON.parse($('meta[name=AllBounty]').attr('content'));
    $('meta[name=AllBounty]')[0].remove();
    var TableObj = document.getElementById("AllBounty");
    var MyIndex = [];
    for(i=0;i<python_result.thing.length;i++){
        if (python_result.poster[i] == username){MyIndex.push(i)};
        var tr = TableObj.insertRow(TableObj.rows.length);
        var td = tr.insertCell(0);
        td.id = python_result.poster[i]+","+i;
        td.setAttribute("onclick","Accept(this.id)");
        
        var TiTleDiv = document.createElement("div");
        TiTleDiv.setAttribute("class","TiTleDiv");
        TiTleDiv.innerText = "【"+python_result.class[i]+"】"+python_result.thing[i];
        
        var ThreeDiv = document.createElement("div");
        ThreeDiv.setAttribute("class","ThreeDiv");
        var reward = document.createElement("b");
        reward.innerText = python_result.reward[i];
        var time = document.createElement("b");
        time.innerText = python_result.time[i];
        var place = document.createElement("b");
        place.innerText = python_result.place[i];
        ThreeDiv.innerHTML = '<i class="fa fa-dollar"></i>'+reward.outerHTML+'<i class="fa fa-clock-o"></i>'+time.outerHTML+'<i class="fa fa-university"></i>'+place.outerHTML;
        td.appendChild(TiTleDiv);
        td.appendChild(ThreeDiv);
    };
    WriteMyBountyToHTML(python_result,MyIndex);

    var python_result = JSON.parse($('meta[name=MyBounty]').attr('content'));
    $('meta[name=MyBounty]')[0].remove();
    var TableObj = document.getElementById("MyBounty");
    for(i=0;i<python_result.class.length;i++){
        var tr = TableObj.insertRow(TableObj.rows.length);
        var td = tr.insertCell(0);
        var a = document.createElement("a");
        a.href = "trade.html?_id="+python_result._id[i];
        
        var MyTiTleDiv = document.createElement("div");
        MyTiTleDiv.setAttribute("class","MyTiTleDiv");
        MyTiTleDiv.innerText = "【"+python_result.class[i]+"】"+python_result.thing[i];
        
        var FourDiv = document.createElement("div");
        FourDiv.setAttribute("class","FourDiv");
        var reward = document.createElement("b");
        reward.innerText = python_result.reward[i];
        var time = document.createElement("b");
        time.innerText = python_result.time[i];
        var place = document.createElement("b");
        place.innerText = python_result.place[i];
        var status = document.createElement("b");
        status.innerText = "進行中";
        FourDiv.innerHTML = '<i class="fa fa-dollar"></i>'+reward.outerHTML+'<i class="fa fa-clock-o"></i>'+time.outerHTML+'<i class="fa fa-university"></i>'+place.outerHTML+'<i class="fa fa-gg"></i>'+status.outerHTML;
        a.appendChild(MyTiTleDiv);
        a.appendChild(FourDiv);
        td.appendChild(a);
    };
})

function DeleteBounty(arg){
    r = confirm(arg.children[0].innerText+"\n是否刪除此筆任務？\n刪除後，系統將自動將東吳幣退還給您");
    if (r == true){
        data = {
            "thing":arg.children[0].innerHTML.split("】")[1].replace(/<br>/g,"\n"),
            "reward":arg.children[1].getElementsByTagName("b")[0].innerText,
            "time":arg.children[1].getElementsByTagName("b")[1].innerText,
            "place":arg.children[1].getElementsByTagName("b")[2].innerText,
            "class":arg.children[0].innerText.split("【")[1].split("】")[0],
            "DeleteTime":GetDateAndTime()
        };
        $("#GrayArea").fadeToggle();
        $.ajax({
            url:'/DeleteBounty',
            headers:{"X-CSRFToken":token},
            type:'POST',
            data:data,
            success:function(python_result){
                $("#GrayArea").fadeToggle();
                if (python_result == "Rejected"){
                    alert("不合法的操作!");
                    window.location.assign("/BountyBoard.html");
                } else {
                    alert("轉帳失敗，請到會員中心>回報>重新領取");
                    window.location.assign("/UserCenter.html");
                };
            },
            error:function(error){
                $("#GrayArea").fadeToggle();
                alert("伺服器回應超時...請重新嘗試");
            }
        })
    }
}

function DisplayAllBounty(){
    var td1 = document.getElementsByClassName("UnderLine")[0];
    var td2 = document.getElementsByClassName("UnderLine")[1];
    var td3 = document.getElementsByClassName("UnderLine2")[0];
    var td4 = document.getElementsByClassName("UnderLine2")[1];

    var one = document.getElementById("AllBounty");
    var two = document.getElementById("Rules");
    var three = document.getElementById("PublishBounty");
    var four = document.getElementById("MyBounty");
    
    if (one.style["display"] != "none"){
        console.log("無變化");
    } else if (two.style["display"] != "none"){
        $(td2).hide("slide",{direction:"left"});
        two.style["display"] = "none";
        $(td1).show("slide",{direction:"right"});
        one.style["display"] = "";
        console.log("2-1");
    } else if (three.style["display"] != "none"){
        $(td3).hide("slide",{direction:"left"});
        three.style["display"] = "none";
        $(td1).show("slide",{direction:"left"});
        one.style["display"] = "";
        console.log("3-1");
    } else if (four.style["display"] != "none"){
        $(td4).hide("slide",{direction:"right"});
        four.style["display"] = "none";
        $(td1).show("slide",{direction:"left"});
        one.style["display"] = "";
        console.log("4-1");
    }
}

function DisplayRules(){
    var td1 = document.getElementsByClassName("UnderLine")[0];
    var td2 = document.getElementsByClassName("UnderLine")[1];
    var td3 = document.getElementsByClassName("UnderLine2")[0];
    var td4 = document.getElementsByClassName("UnderLine2")[1];

    var one = document.getElementById("AllBounty");
    var two = document.getElementById("Rules");
    var three = document.getElementById("PublishBounty");
    var four = document.getElementById("MyBounty");

    if (td1.style["display"] != "none"){
        $(td1).hide("slide",{direction:"right"});
        one.style["display"] = "none";
        $(td2).show("slide",{direction:"left"});
        two.style["display"] = "";
        console.log("1-2");
    } else if (two.style["display"] != "none"){
        console.log("無變化");
    } else if (three.style["display"] != "none"){
        $(td3).hide("slide",{direction:"left"});
        three.style["display"] = "none";
        $(td2).show("slide",{direction:"right"});
        two.style["display"] = "";
        console.log("3-2");
    } else if (four.style["display"] != "none"){
        $(td4).hide("slide",{direction:"right"});
        four.style["display"] = "none";
        $(td2).show("slide",{direction:"right"});
        two.style["display"] = "";
        console.log("4-2");
    }
}

function DisplayPublishBounty(){
    var td1 = document.getElementsByClassName("UnderLine")[0];
    var td2 = document.getElementsByClassName("UnderLine")[1];
    var td3 = document.getElementsByClassName("UnderLine2")[0];
    var td4 = document.getElementsByClassName("UnderLine2")[1];

    var one = document.getElementById("AllBounty");
    var two = document.getElementById("Rules");
    var three = document.getElementById("PublishBounty");
    var four = document.getElementById("MyBounty");

    if (one.style["display"] != "none"){
        $(td1).hide("slide",{direction:"left"});
        one.style["display"] = "none";
        $(td3).show("slide",{direction:"left"});
        three.style["display"] = "";
        console.log("1-3");
    } else if (two.style["display"] != "none"){
        $(td2).hide("slide",{direction:"right"});
        two.style["display"] = "none";
        $(td3).show("slide",{direction:"left"});
        three.style["display"] = "";
        console.log("2-3");
    } else if (three.style["display"] != "none"){
        console.log("無變化");
    } else if (four.style["display"] != "none"){
        $(td4).hide("slide",{direction:"left"});
        four.style["display"] = "none";
        $(td3).show("slide",{direction:"right"});
        three.style["display"] = "";
        console.log("4-3");
    };
    document.getElementById("time").value = GetTime();
}

function DisplayMyBounty(){
    var td1 = document.getElementsByClassName("UnderLine")[0];
    var td2 = document.getElementsByClassName("UnderLine")[1];
    var td3 = document.getElementsByClassName("UnderLine2")[0];
    var td4 = document.getElementsByClassName("UnderLine2")[1];

    var one = document.getElementById("AllBounty");
    var two = document.getElementById("Rules");
    var three = document.getElementById("PublishBounty");
    var four = document.getElementById("MyBounty");

    if (one.style["display"] != "none"){
        $(td1).hide("slide",{direction:"left"});
        one.style["display"] = "none";
        $(td4).show("slide",{direction:"right"});
        four.style["display"] = "";
        console.log("1-4");
    } else if (two.style["display"] != "none"){
        $(td2).hide("slide",{direction:"right"});
        two.style["display"] = "none";
        $(td4).show("slide",{direction:"right"});
        four.style["display"] = "";
        console.log("2-4");
    } else if (three.style["display"] != "none"){
        $(td3).hide("slide",{direction:"right"});
        three.style["display"] = "none";
        $(td4).show("slide",{direction:"left"});
        four.style["display"] = "";
        console.log("3-4");
    } else if (four.style["display"] != "none"){
        console.log("無變化");
    };
}

function UserCenter() {window.location.assign("/UserCenter.html")}

function GetDateAndTime(){
    var a = new Date();
                
    var month = String(a.getMonth()+1);
    var date = String(a.getDate());
    if (month.length == 1){month = "0" + month};
    if (date.length == 1){date = "0" + date};

    var hour = String(a.getHours());
    var minute = String(a.getMinutes());
    if (hour.length == 1){hour = "0"+hour};
    if (minute.length == 1){minute = "0" + minute};
    return month+"/"+date+" "+hour+":"+minute;
}

function GetDate(){
    var a = new Date();
                
    var month = String(a.getMonth()+1);
    var date = String(a.getDate());
    if (month.length == 1){month = "0" + month};
    if (date.length == 1){date = "0" + date};
    return month+"/"+date;
}

function GetTime(){
    var a = new Date();

    var hour = String(a.getHours());
    var minute = String(a.getMinutes());
    if (hour.length == 1){hour = "0"+hour};
    if (minute.length == 1){minute = "0" + minute};
    return hour+":"+minute;
}

function PublishBounty() {
    var time = document.getElementById("time").value;
    var place = document.getElementById("place").value;
    var category = document.getElementById("category").value;
    var thing = document.getElementById("thing").value;
    if (place == ""){alert("地點須填寫")}
    else if (place.length > 20){alert("地點不可超過20字")}
    else if (category == ""){alert("類別須填寫")}
    else if (category.length > 6){alert("類別不可超過6字")}
    else if (thing == ""){alert("內容須填寫")}
    else if (thing.length > 80){alert("內容不可超過80字")}
    else if (category.indexOf("【") != -1 || category.indexOf("】") != -1){alert("類別不得包含特殊字元 '【' 或 '】' ")}
    else if (thing.indexOf("【") != -1 || thing.indexOf("】") != -1){alert("內容不得包含特殊字元 '【' 或 '】' ")}
    else {
        document.getElementById("send").disabled = true;
        $.ajax({
            url:'http://52.44.57.177:8888/get_balance?user='+username,
            success:function(result){
                var arr = result.split("\n");
                if (arr.length == 0){alert("您目前沒有東吳幣囉!")}
                else {
                    $.ajax({
                        url:"/PublishBounty",
                        headers:{"X-CSRFToken":token},
                        type:"POST",
                        data:{
                            "class":category,
                            "thing":thing,
                            "reward":"1",
                            "time":GetDate()+" "+time,
                            "place":place
                        },
                        success: function(result) {
                            if (result == "OK"){
                                alert("新增成功，將自動幫您重新整理頁面");
                                window.location.assign("/BountyBoard.html");
                            } else {
                                alert("轉帳失敗，請重新嘗試!");
                                document.getElementById("send").disabled = false;
                            };
                        },
                        error: function(error) {
                            alert("新增失敗，請檢查網路連線，再重新嘗試");
                            window.location.assign("/BountyBoard.html");
                        }
                    })
                }
            },
            error:function(error){
                console.log(error);
                alert("請求失敗，請重新嘗試");
                document.getElementById("send").disabled = false;
            }
        })
    }
}

function Accept(publisher){
    if (username == publisher.split(",")[0]){
        alert("您不可接自己的任務！");
        return false;
    }
    var r = confirm(document.getElementsByClassName("TiTleDiv")[publisher.split(",")[1]].innerText+"\n確定接取任務？");
    if (r == true){
        var index = publisher.split(",")[1];
        var table = document.getElementById("AllBounty");
        var data = {
            "poster":publisher.split(",")[0],
            "class":document.getElementsByClassName("TiTleDiv")[index].innerText.split("【")[1].split("】")[0],
            "thing":document.getElementsByClassName("TiTleDiv")[index].innerHTML.split("】")[1].replace(/<br>/g,"\n"),
            "reward":document.getElementsByClassName("ThreeDiv")[index].getElementsByTagName("b")[0].innerText,
            "time":document.getElementsByClassName("ThreeDiv")[index].getElementsByTagName("b")[1].innerText,
            "AcceptTime":GetDateAndTime(),
        };
        $("#GrayArea").fadeToggle();
        $.ajax({
            url:'/MailFromBounty',
            headers:{"X-CSRFToken":token},
            type:'POST',
            data:data,
            success: function(python_result){
                $("#GrayArea").fadeToggle();
                if (python_result == "Cannot Find"){
                    alert("此筆任務已被刪除!");
                    window.location.assign("/BountyBoard.html");
                } else {window.location.assign(python_result)};

            },
            error: function(error){
                $("#GrayArea").fadeToggle();
                alert("網路錯誤");
            }
        })
    };
}