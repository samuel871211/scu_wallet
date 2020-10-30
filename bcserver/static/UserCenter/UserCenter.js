const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

function LogOut() {
    $.ajax({
        url:"/LogOut",
        type:"POST",
        headers:{"X-CSRFToken":token},
        success:function(res){
            if (res == "OK"){window.location.assign("/Login.html")}
            else {alert(res)};
        },
        error:function(error){
            console.log(error);
        }
    })
}

function mail() {window.location.assign('/mail.html');}
function BountyBoard() {window.location.assign("/BountyBoard.html")}
function Paragraph() {window.location.assign("/Paragraph.html")}
function Pair() {window.location.assign("/Pair.html")}
function Diary() {window.location.assign("/Diary.html")}
function games() {window.location.assign("/games.html")}
function Contact() {window.location.assign("/Contact.html")}
function MyHouse() {alert("功能尚未開放，請見諒!")}

function ChangeSelfie(){
    if ($("#SelfieTd img")[0].src.split(":5000")[1] == "/static/emoji.svg"){
        document.getElementsByClassName("TwoBtn")[1].style["display"] = "none";
    } else {
        document.getElementsByClassName("TwoBtn")[1].style["display"] = "";
    };
    $("#GrayBackground").fadeToggle();
    $("#Actions").fadeToggle();
}

function DeleteSelfie(){
    r = confirm("是否刪除頭像？");
    if (r==true){
        $.ajax({
            url:'/DeleteSelfie',
            type:"POST",
            headers:{"X-CSRFToken":token},
            success:function(python_result){
                if (python_result == "請求失敗"){
                    alert(python_result);
                    window.location.reload();
                    return;
                } else if (python_result == "Invaild Login Status"){
                    alert("偵測到您尚未登入，將為您轉向登入頁面");
                    window.location.assign("Login.html");
                } else {
                    $("#SelfieTd img")[0].src = "/static/emoji.svg";
                    ChangeSelfie();
                };
            },
            error:function(error){
                console.log(error);
                alert("刪除頭像失敗，請重試");
                ChangeSelfie();
            }
        })
    };
}

function UploadSelfie(){
    r = confirm("請自行先將頭貼裁切成正方形，再進行上傳");
    if (r==false){ChangeSelfie()}
    else {$("input[type=file]").click()};
}

function UploadImage(){
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();
    if (file){reader.readAsDataURL(file)};
    reader.addEventListener("load",function(){
        var img = document.createElement("img");
        img.src = reader.result;
        document.getElementById("ImgContainer").appendChild(img);
        if (img.width>0 && (file.size/1024/1024<=1 || img.width<=1024)){
            if (img.width != img.height){
                alert("圖片尺寸不符合規定!");
                return;
            }
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            var compressed = canvas.toDataURL('image/jpeg');
            if (document.getElementById("Waiting").style["display"] == "none"){
                $("#Actions").fadeToggle();
                $("#Waiting").fadeToggle();
            };
            $.ajax({
                url:'/ModifySelfie',
                type:'POST',
                headers:{"X-CSRFToken":token},
                data:{"b64":compressed.split("base64,")[1]},
                success:function(python_result){
                    if (python_result == "Image Upload Failed"){
                        alert("頭像上傳失敗，請重試");
                    } else if (python_result == "請求失敗"){
                        alert(python_result);
                        window.location.reload();
                        return;
                    } else if (python_result == "Invaild Login Status"){
                        alert("偵測到您尚未登入，將為您轉向登入頁面");
                        window.location.assign("Login.html");
                        return;
                    } else {
                        $("#SelfieTd img")[0].src = python_result;
                    }
                    $("#GrayBackground").fadeToggle();
                    $("#Waiting").fadeToggle();
                },
                error:function(error){
                    console.log(error);
                    alert("頭像上傳失敗，請重試");
                    $("#GrayBackground").fadeToggle();
                    $("#Waiting").fadeToggle();
                }
            })
        } else {
            UploadImage();
        }
    })
}