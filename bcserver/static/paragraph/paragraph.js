$("#SearchArea").toggle("slide");
document.getElementsByClassName("fa fa-search fa-3x")[0].style["color"] = "#ffff00";
var CurrentDiv = "SearchArea";
var CurrentCls = "fa fa-search fa-3x";
var SearchIndex = [];
var table = document.getElementById("AllParagraph");

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/paragraph/style.css";
    head.appendChild(mycss);
};

function ManageMyParagraph() {window.location.assign("/ManageMyParagraph.html")}
function PublishParagraph() {window.location.assign("/PublishParagraph.html")}
function UserCenter() {window.location.assign("/UserCenter.html")}
function Display(div,cls){
    if (CurrentDiv == ""){
        $("#"+div).toggle("slide");
        document.getElementsByClassName(cls)[0].style["color"] = "#ffff00";
        CurrentDiv = div;
        CurrentCls = cls;
    } else if (CurrentDiv != ""){
        if (CurrentDiv == div){
            $("#"+CurrentDiv).toggle("fade");
            document.getElementsByClassName(CurrentCls)[0].style["color"] = "white";
            CurrentDiv = "";
            CurrentCls = "";
        } else if (CurrentDiv != div){
            $("#"+CurrentDiv).toggle("fade");
            document.getElementsByClassName(CurrentCls)[0].style["color"] = "white";
            $("#"+div).toggle("slide");
            document.getElementsByClassName(cls)[0].style["color"] = "#ffff00";
            CurrentDiv = div;
            CurrentCls = cls;
        };
    };
}

$(document).ready(function(){
    var python_result = JSON.parse($('meta[name=res]').attr('content'));
    $('meta[name=res]')[0].remove();
    for(i=0;i<python_result.title.length;i++){
        var Tr = table.insertRow(table.rows.length);
        var Td = Tr.insertCell(0);
        Td.setAttribute("class",python_result.class[i]);
        
        var NewA = document.createElement("a");
        NewA.setAttribute("href","/SeeParagraph.html?_id="+python_result._id[i]);

        var TitleDiv = document.createElement("div");
        TitleDiv.setAttribute("class","TitleDiv");
        TitleDiv.innerText = "【"+python_result.class[i]+"】"+python_result.title[i];
        
        var DetailDiv = document.createElement("div");
        DetailDiv.setAttribute("class","DetailDiv");

        var LikeIcon = document.createElement("i");
        LikeIcon.setAttribute("class","fa fa-thumbs-up fa-fw");
        var LikeCount = document.createElement("b");
        LikeCount.setAttribute("class","LikeCount")
        LikeCount.innerHTML = python_result.like[i];
        var DislikeIcon = document.createElement("i");
        DislikeIcon.setAttribute("class","fa fa-thumbs-down fa-fw");
        var DisLikeCount = document.createElement("b");
        DisLikeCount.setAttribute("class","DisLikeCount");
        DisLikeCount.innerHTML = python_result.dislike[i];
        var ResponseIcon = document.createElement("i");
        ResponseIcon.setAttribute("class","fa fa-comment fa-fw");
        var ResponseCount = document.createElement("b");
        ResponseCount.setAttribute("class","ResponseCount");
        ResponseCount.innerHTML = python_result.ResponseLength[i];

        var ThreeDiv = document.createElement("div");
        ThreeDiv.align = "left";
        ThreeDiv.setAttribute("class","ThreeDiv");
        ThreeDiv.appendChild(LikeIcon);
        ThreeDiv.appendChild(LikeCount);
        ThreeDiv.appendChild(DislikeIcon);
        ThreeDiv.appendChild(DisLikeCount);
        ThreeDiv.appendChild(ResponseIcon);
        ThreeDiv.appendChild(ResponseCount);

        var TimeDiv = document.createElement("div");
        TimeDiv.align = "right";
        TimeDiv.setAttribute("class","TimeDiv");
        TimeDiv.innerHTML = python_result.time[i];

        DetailDiv.appendChild(ThreeDiv);
        DetailDiv.appendChild(TimeDiv);
        NewA.appendChild(TitleDiv);
        NewA.appendChild(DetailDiv);
        Td.appendChild(NewA);
        SearchIndex.push(i);
    };
})

function Filter(){
    var tag = document.querySelectorAll("#FilterArea select")[1].value;
    if (SearchIndex.length == 0){
        setTimeout(function(){alert("很抱歉，沒有搜索到相關結果")},300);
    } else if (SearchIndex.length == 1) {
        table.rows[SearchIndex[0]].cells[0].style["display"] = "none";
        if (table.rows[SearchIndex[0]].cells[0].getElementsByClassName("TitleDiv")[0].innerHTML.split("【")[1].split("】")[0] == tag || tag == "所有"){
            $("#AllParagraph td").slice(SearchIndex[0],SearchIndex[0]+1).toggle("slide");
            return true;
        };
        alert("很抱歉，沒有搜索到相關結果");
    } else if (SearchIndex.length > 1){
        if (tag == "所有"){
            SortBy(SearchIndex);
        } else if (tag != "所有"){
            var det = false;
            var FilterIndex = [];
            for (i=0;i<SearchIndex.length;i++){
                table.rows[SearchIndex[i]].cells[0].style["display"] = "none";
                if (table.rows[SearchIndex[i]].cells[0].getElementsByClassName("TitleDiv")[0].innerHTML.split("【")[1].split("】")[0] == tag){
                    FilterIndex.push(SearchIndex[i]);
                    det = true;
                }
            };
            if (det == false){
                alert("很抱歉，沒有搜索到相關結果");
                return det;
            };
            SortBy(FilterIndex);
        };
    };
}

function SortBy(arr){
    var sort = document.querySelectorAll("#FilterArea select")[0].value;
    table.rows[arr[0]].cells[0].style["display"] = "none";
    if (sort == "TimeDiv"){
        for (i=1;i<arr.length;i++){
            table.rows[arr[i]].cells[0].style["display"] = "none";
            if (table.rows[arr[i]].cells[0].getElementsByClassName(sort)[0].innerHTML > table.rows[arr[i-1]].cells[0].getElementsByClassName(sort)[0].innerHTML){
                for (j=0;j<=i-1;j++){
                    if (table.rows[arr[i]].cells[0].getElementsByClassName(sort)[0].innerHTML > table.rows[arr[j]].cells[0].getElementsByClassName(sort)[0].innerHTML){
                        var insert = table.insertRow(arr[j]);
                        insert.innerHTML = table.rows[arr[i]+1].innerHTML;
                        table.deleteRow(arr[i]+1);
                        var temp = [];
                        for (k=j;k<i;k++){temp.push(arr[k]+1)};
                        for (k=0;k<temp.length;k++){arr[k+j+1] = temp[k]};
                        break;
                    };
                };
            };
        }; 
    } else {
        for (i=1;i<arr.length;i++){
            table.rows[arr[i]].cells[0].style["display"] = "none";
            if (parseInt(table.rows[arr[i]].cells[0].getElementsByClassName(sort)[0].innerHTML) > parseInt(table.rows[arr[i-1]].cells[0].getElementsByClassName(sort)[0].innerHTML)){
                for (j=0;j<=i-1;j++){
                    if (parseInt(table.rows[arr[i]].cells[0].getElementsByClassName(sort)[0].innerHTML) > parseInt(table.rows[arr[j]].cells[0].getElementsByClassName(sort)[0].innerHTML)){
                        var insert = table.insertRow(arr[j]);
                        insert.innerHTML = table.rows[arr[i]+1].innerHTML;
                        table.deleteRow(arr[i]+1);
                        var temp = [];
                        for (k=j;k<i;k++){temp.push(arr[k]+1)};
                        for (k=0;k<temp.length;k++){arr[k+j+1] = temp[k]};
                        break;
                    };
                };
            };
        };
    };
    for (i=0;i<arr.length;i++){
        $("#AllParagraph td").slice(arr[i],arr[i]+1).toggle("slide");
    }
}

function search() {
    var det = false;
    if (event.keyCode == 13){
        var keyword = document.querySelector("#SearchArea input").value;
        if (keyword == ""){return false};
        SearchIndex = [];
        var query = new RegExp(keyword);
        var title = document.getElementsByClassName("TitleDiv");
        for (i=0;i<title.length;i++){
            table.rows[i].cells[0].style["display"] = "none";
            if (title[i].innerHTML.split("】")[1].match(query) != null){
                $("#AllParagraph td").slice(i,i+1).toggle("slide");
                SearchIndex.push(i);
                det = true;
            };
        };
        if (det == false){
            alert("很抱歉，沒有搜索到相關結果");
            document.querySelector("#SearchArea input").value = "";
        };
    };
}