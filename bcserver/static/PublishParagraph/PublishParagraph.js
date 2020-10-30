const _id = location.href.split("_id=")[1];
const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

$(document).ready(function(){
    var python_result = $('meta[name=res]').attr('content');
    if (python_result == ""){
        document.body.style["display"] = "";
        return;
    };
    python_result = JSON.parse(python_result);
    document.getElementById("ClassList").value =  python_result.class;
    document.getElementById("title").value = python_result.title;
    if(python_result.username.split(",")[1] == "東吳大學"){document.getElementsByClassName("hide")[0].click()};
    if(python_result.username.split(",")[2] == "/static/emoji.svg"){document.getElementsByClassName("hide")[1].click()};
    for (i=0;i<python_result.paragraph.length;i++){
        if (python_result.paragraph[i] == "<"){
            if (python_result.paragraph.slice(i,i+4) == '<img'){
                for (k=i;k<=i+100;k++){
                    if (python_result.paragraph[k] == ">"){
                        var div = document.createElement("div");
                        div.innerHTML = python_result.paragraph.slice(i,k+1);
                        var img = div.children[0];
                        if (img != undefined && img.className == "ParagraphImg"){
                            img.style = "width:100%;height:100%";
                            img.removeAttribute("class");
                            img.removeAttribute("onclick");
                            for (j=0;j<5;j++){
                                if (document.getElementsByClassName("InputClick")[j].children[0].outerHTML == img.outerHTML){
                                    python_result.paragraph = python_result.paragraph.slice(0,i)+"<img"+(j+1)+">"+python_result.paragraph.slice(k+1,python_result.paragraph.length);
                                    break;
                                } else if (document.getElementsByClassName("InputClick")[j].children[0].outerHTML == '<i class="fa fa-file-image-o fa-lg"></i>'){
                                    document.getElementsByClassName("InputClick")[j].innerHTML = img.outerHTML;
                                    python_result.paragraph = python_result.paragraph.slice(0,i)+"<img"+(j+1)+">"+python_result.paragraph.slice(k+1,python_result.paragraph.length);
                                    break;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    document.getElementById("paragraph").value = python_result.paragraph;
    document.body.style["display"] = "";
})

function Back(){window.location.assign("/Paragraph.html")}
function UserCenter(){window.location.assign("/UserCenter.html")}

function InsertNewParagraph() {
    if (document.getElementById("paragraph").value == "" ||　document.getElementById("title").value == ""){
        alert("請務必填寫標題跟內文!");
        return false;
    }
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
    
    var paragraph = document.getElementById("paragraph").value;
    var ImgTags = ["<img1>","<img2>","<img3>","<img4>","<img5>"];
    i = 0;
    while (i<paragraph.length){
      var det = true;
      if (paragraph[i] == "<" && ImgTags.includes(paragraph.slice(i,i+6))){
        var Img = document.querySelectorAll(".InputClick")[parseInt(paragraph.slice(i+4,i+5))-1].children[0];
        if (Img.outerHTML == '<i class="fa fa-file-image-o fa-lg"></i>'){
            alert("您並沒有上傳"+paragraph.slice(i,i+6)+",請移除此標籤");
            return;
        };
        var clone = Img.cloneNode(false);
        clone.removeAttribute("style");
        clone.setAttribute("class","ParagraphImg");
        clone.setAttribute("onclick","Zoom(this)");
        if (paragraph[i-1] == "\n"){
            if (paragraph[i+6] == "\n"){
                console.log("前後都有分行");
                paragraph = paragraph.slice(0,i) + clone.outerHTML + paragraph.slice(i+6);
            } else {
                console.log("只有前面有分行");
                paragraph = paragraph.slice(0,i) + clone.outerHTML + "\n" + paragraph.slice(i+6);
                if (paragraph[paragraph.length-1] == "\n"){paragraph = paragraph.slice(0,paragraph.length-1)};
                det = false;
                i += 2;
            };
        } else {
            if (paragraph[i+6] == "\n"){
                console.log("只有後面有分行");
                paragraph = paragraph.slice(0,i) + "\n" + clone.outerHTML + paragraph.slice(i+6);
                if (paragraph[0] == "\n"){paragraph = paragraph.slice(1)};
            } else {
                console.log("前後都沒分行");
                paragraph = paragraph.slice(0,i) + "\n" + clone.outerHTML + "\n" + paragraph.slice(i+6);
                if (paragraph[0] == "\n"){paragraph = paragraph.slice(1)};
                if (paragraph[paragraph.length-1] == "\n"){paragraph = paragraph.slice(0,paragraph.length-1)};
                det = false;
                i += 2;
            };
        };
      };
      if (det){i += 1};
    };

    var data = {
        "major":document.getElementsByClassName("hide")[0].children[1].innerHTML,
        "selfie":document.getElementsByClassName("hide")[1].children[1].innerHTML,
        "title":document.getElementById("title").value,
        "paragraph":paragraph,
        "class":document.getElementById("ClassList").value,
        "time":time,
        "_id":"None"
    };
    if (_id != undefined){
        data._id = _id;
        $.ajax({
            url:"/EditParagraph",
            headers:{"X-CSRFToken":token},
            type:'POST',
            data:data,
            success: function(python_result){
                if (python_result == "No"){
                    alert("文章讀取失敗，將為您重新轉向");
                    window.location.assign("/ManageMyParagraph.html");
                } else if (python_result == "請求失敗"){
                    alert(python_result);
                    window.location.reload();
                    return;
                } else if (python_result == "Invaild Login Status"){
                    alert("偵測到您尚未登入，系統將為您導向登入頁面");
                    window.location.replace("Login.html?redirect="+location.href.split("5000/")[1]);
                } else {
                    alert("編輯完成，將為您重新轉向");
                    window.location.assign("/SeeParagraph.html?_id="+python_result);
                }
            },
            error: function(error){
                alert("編輯失敗，請重試");
            }
        })
    } else {
        $.ajax({
            url:"/InsertNewParagraph",
            headers:{"X-CSRFToken":token},
            type:'POST',
            data:data,
            success: function(python_result){
                if (python_result == "OK"){
                    alert("新增成功，即將為您轉向");
                    window.location.assign('/Paragraph.html');
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
                alert("新增失敗，請重試");
            }
        })
    };
}

function InputClick(arg){
    if (document.querySelectorAll('input[type=file]')[arg].files[0]){return};
    document.querySelectorAll('input[type=file]')[arg].click();
}

function UploadImage(arg){
    if (document.getElementById("wait").style["display"] == "none"){
        $("#wait").fadeToggle();
        $("#BottomArea").fadeToggle();
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
                url:'/UploadImage',
                headers:{"X-CSRFToken":token},
                type:'POST',
                timeout:20000,
                data:{"b64":compressed.split("base64,")[1]},
                success:function(python_result){
                    if (python_result == "Image Upload Failed"){
                        alert("圖片上傳失敗，請重新嘗試");
                        document.getElementsByClassName("InputClick")[arg].innerHTML = '<i class="fa fa-file-image-o fa-lg"></i><br><b>img'+(parseInt(arg)+1)+'</b>';
                        document.querySelectorAll('input[type=file]')[arg].outerHTML = document.querySelectorAll('input[type=file]')[arg].outerHTML;
                    } else if (python_result == "請求失敗"){
                        alert(python_result);
                        window.location.reload();
                        return;
                    } else {
                        var img = document.createElement("img");
                        img.style = "width:100%;height:100%";
                        img.src = python_result;
                        document.getElementsByClassName("InputClick")[arg].innerHTML = "";
                        document.getElementsByClassName("InputClick")[arg].appendChild(img);
                        document.getElementById("paragraph").value = document.getElementById("paragraph").value+"<img"+(parseInt(arg)+1).toString()+">";
                    };
                    $("#wait").fadeToggle();
                    $("#BottomArea").fadeToggle();
                },
                error:function(error){
                    console.log(error);
                    alert("圖片上傳失敗，請重新嘗試");
                    document.getElementsByClassName("InputClick")[arg].innerHTML = '<i class="fa fa-file-image-o fa-lg"></i><br><b>img'+(parseInt(arg)+1)+'</b>';
                    document.querySelectorAll('input[type=file]')[arg].outerHTML = document.querySelectorAll('input[type=file]')[arg].outerHTML;
                    $("#wait").fadeToggle();
                    $("#BottomArea").fadeToggle();
                }
            })
        } else {
            UploadImage(arg);
        }
    })
}

function Alert(){alert("插入的圖片會在內文區塊會以<img>來表示\n您可以在內文區塊修改<img>的位置\n來改變圖片在文章中的位置")}

function hide(arg){
    if (arg.style["color"] == "" || arg.style["color"] == "black"){
        arg.style["color"] = "#cccccc";
        if (arg.children[1].innerHTML == "顯示學系"){
            arg.children[1].innerHTML = "隱藏學系";
        } else {arg.children[1].innerHTML = "隱藏頭像"};
    } else {
        arg.style["color"] = "black";
        if (arg.children[1].innerHTML == "隱藏學系"){
            arg.children[1].innerHTML = "顯示學系";
        } else {arg.children[1].innerHTML = "顯示頭像"};
    };
}

function preview(){
    alert("功能尚未開放，請見諒!");
}