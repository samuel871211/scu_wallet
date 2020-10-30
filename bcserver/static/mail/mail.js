function UserCenter(){window.location.assign("/UserCenter.html")}

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/mail/style.css";
    head.appendChild(mycss);
};

document.getElementById("TwoBtnTable").style["top"] = document.getElementById("header").clientHeight + "px";
document.getElementById("BottomArea").style["top"] = (document.getElementById("header").clientHeight+document.getElementById("TwoBtnTable").clientHeight) + "px";
const username = $('meta[name=username]').attr('content');
$('meta[name=username]').remove();

$(document).ready(function(){
    var python_result = JSON.parse($('meta[name=res]').attr('content'));
    $('meta[name=res]')[0].remove();
    var tableObj = document.getElementById("SystemMail");
    for(i=0;i<python_result.thing.length;i++){
        var tr = tableObj.insertRow(tableObj.rows.length);
        var td = tr.insertCell(0);
        var a = document.createElement("a");
        a.setAttribute("href",python_result.href[i]);
        var FlexDiv = document.createElement("div");
        FlexDiv.setAttribute("class","FlexDiv");

        var img = document.createElement("i");
        if (python_result.thing[i].split(",")[0] == "like"){
            img.setAttribute("class","fa fa-thumbs-up fa-fw fa-3x");
        } else if (python_result.thing[i].split(",")[0] == "dislike"){
            img.setAttribute("class","fa fa-thumbs-down fa-fw fa-3x");
        } else if (python_result.thing[i].split(",")[0] == "response"){
            img.setAttribute("class","fa fa-comment fa-fw fa-3x");
        } else if (python_result.thing[i].split(",")[0] == "tag"){
            img.setAttribute("class","fa fa-tags fa-fw fa-3x");
        } else if (python_result.thing[i].split(",")[0] == "accept"){
            img.setAttribute("class","fa fa-gg fa-fw fa-3x");
        };

        var TitleTimeDiv = document.createElement("div");
        TitleTimeDiv.setAttribute("class","TitleTimeDiv");
        
        var behavior = python_result.thing[i].split(",")[0];
        var object = python_result.thing[i].split(",")[1];
        if (behavior == "like"){
            behavior = "讚";
        } else if (behavior == "dislike"){
            behavior = "噓";
        } else if (behavior == "response"){
            behavior = "回覆";
        } else if (behavior == "tag"){
            behavior = "標記";
        } else if (behavior == "accept"){
            behavior = "接";
        };
        if (object == "paragraph"){
            object = "文章";
        } else if (object == "response"){
            object = "留言";
        } else if (object == "bounty"){
            object = "任務";
        };
        if (python_result.initiator[i] == username){
            python_result.initiator[i] = "您";
        };
        if (python_result.author[i] == username){
            python_result.author[i] = "您";
        };
        
        var TitleDiv = document.createElement("div");
        TitleDiv.align = "left";
        TitleDiv.setAttribute("class","TitleDiv");
        TitleDiv.innerHTML = python_result.initiator[i]+behavior+"了"+python_result.author[i]+"的"+object;

        var TimeDiv = document.createElement("div");
        TimeDiv.align = "right";
        TimeDiv.setAttribute("class","TimeDiv");
        TimeDiv.innerHTML = python_result.time[i];

        TitleTimeDiv.appendChild(TitleDiv);
        TitleTimeDiv.appendChild(TimeDiv);
        FlexDiv.appendChild(img);
        FlexDiv.appendChild(TitleTimeDiv);
        a.appendChild(FlexDiv);
        td.appendChild(a);
    };
    $("#SystemMail").fadeToggle();
    document.getElementById("Waiting").style["display"] = "none";
    document.getElementsByClassName("TwoBtnTd")[1].children[0].disabled = false;
    document.getElementsByClassName("FlexDiv")[document.getElementsByClassName("FlexDiv").length-1].style["border"] = "none";   
})

function DisplaySystemMail(){
    if (document.getElementsByClassName("UnderLine")[0].style["display"] == "none"){
        var td1 = document.getElementsByClassName("UnderLine")[0];
        var td2 = document.getElementsByClassName("UnderLine")[1];
        $(td1).show("slide",{direction:"right"});
        $(td2).hide("slide",{direction:"left"});
    };
}

function DisplayContactMail(){
    if (document.getElementsByClassName("UnderLine")[1].style["display"] == "none"){
        var td1 = document.getElementsByClassName("UnderLine")[0];
        var td2 = document.getElementsByClassName("UnderLine")[1];
        $(td1).hide("slide",{direction:"right"});
        $(td2).show("slide",{direction:"left"});
    };
}