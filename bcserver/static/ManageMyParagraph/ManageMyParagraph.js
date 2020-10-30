const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/ManageMyParagraph/style.css";
    head.appendChild(mycss);
};

$(document).ready(function(){
    var python_result = JSON.parse($('meta[name=res]').attr('content'));
    $('meta[name=res]')[0].remove();
    for(i=0;i<python_result.title.length;i++){
        var table = document.getElementById("AllParagraph");
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

        var FoldIconDiv = document.createElement("div");
        FoldIconDiv.align = "center";
        FoldIconDiv.innerHTML = '<i class="fa fa-angle-double-down fa-fw fa-2x" onclick="fold(this)"></i>';

        var FoldDiv = document.createElement("div");
        FoldDiv.style["display"] = "none";
        var DeleteEditDiv = document.createElement("div");
        DeleteEditDiv.setAttribute("class","DeleteEditDiv");
        var DeleteDiv = document.createElement("div");
        DeleteDiv.className = "DeleteDiv"
        DeleteDiv.align = "center";
        DeleteDiv.innerHTML = '<i class="fa fa-close fa-fw fa-lg" onclick="Delete(this)"></i><b onclick="Delete(this)">刪除</b>'
        var EditDiv = document.createElement("div");
        EditDiv.className = "EditDiv";
        EditDiv.align = "center";
        EditDiv.innerHTML = '<i class="fa fa-pencil fa-fw fa-lg" onclick="Edit(this)"></i><b onclick="Edit(this)">編輯</b>';
        
        DeleteEditDiv.appendChild(DeleteDiv);
        DeleteEditDiv.appendChild(EditDiv);
        FoldDiv.appendChild(DeleteEditDiv);

        Td.appendChild(FoldIconDiv);
        Td.appendChild(FoldDiv);
    };
    table.rows[table.rows.length-1].cells[0].style["border-bottom"] = "0";
})

function Back() {window.location.assign("/Paragraph.html")}
function UserCenter() {window.location.assign("/UserCenter.html")}
function fold(arg){
    if (arg.className == "fa fa-angle-double-down fa-fw fa-2x"){
        arg.className = "fa fa-angle-double-up fa-fw fa-2x";
    } else {arg.className = "fa fa-angle-double-down fa-fw fa-2x"};
    $(arg).parent().next().slideToggle();
}

function Delete(arg){
    var check  = new RegExp(/[^a-z^A-Z^0-9]/);
    var post = arg.parentNode.parentNode.parentNode.previousSibling.previousSibling.href.split("_id=")[1];
    if (post.slice(0,21) == "pbkdf2:sha256:150000$" && post.length == 94 && check.test(post.slice(30)) == false){
        r = confirm("是否要刪除這篇文章？(此動作不可復原)");
        if (r == true){
            $.ajax({
                url:'/DeleteParagraph',
                type:"POST",
                headers:{"X-CSRFToken":token},
                data:{"_id":post},
                success:function(python_result){
                    if(python_result == "_id has been modified"){
                        window.location.reload();
                        return;
                    } else {
                        alert("文章已刪除");
                        window.location.reload();
                    };
                },
                error:function(error){
                    console.log(error);
                    alert("網路不穩，請重新嘗試");
                }
            })   
        };
    };
}

function Edit(arg){
    var check  = new RegExp(/[^a-z^A-Z^0-9]/);
    var post = arg.parentNode.parentNode.parentNode.previousSibling.previousSibling.href.split("_id=")[1];
    if (post.slice(0,21) == "pbkdf2:sha256:150000$" && post.length == 94 && check.test(post.slice(30)) == false){
        window.location.assign("/PublishParagraph.html?_id="+post);
    };
}