const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

$.extend($.support, { touch: "ontouchend" in document });
if ($.support.touch == false){
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement('link');
    mycss.type = 'text/css';
    mycss.rel = 'stylesheet';
    mycss.href = "/static/retrieve/style.css";
    head.appendChild(mycss);
};

function Back(){window.location.assign("/Login.html")};

function ForgetUsername(){
    if (document.getElementsByClassName("UnderLine")[0].style["display"] == "none"){
        var td1 = document.getElementsByClassName("UnderLine")[0];
        var td2 = document.getElementsByClassName("UnderLine")[1];
        $(td1).show("slide",{direction:"right"});
        $(td2).hide("slide",{direction:"left"});
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("Email").value = "";
        document.getElementById("username").style["display"] = "none";
        $("#password").fadeToggle();
        document.getElementById("Retrieve").style["display"] = "none";
        document.getElementById("Retrieve").innerText = "找回帳號";
        $("#Retrieve").fadeToggle();
    };
}

function ForgetPassword(){
    if (document.getElementsByClassName("UnderLine")[1].style["display"] == "none"){
        var td1 = document.getElementsByClassName("UnderLine")[0];
        var td2 = document.getElementsByClassName("UnderLine")[1];
        $(td1).hide("slide",{direction:"right"});
        $(td2).show("slide",{direction:"left"});
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("Email").value = "";
        document.getElementById("password").style["display"] = "none";
        $("#username").fadeToggle();
        document.getElementById("Retrieve").style["display"] = "none";
        document.getElementById("Retrieve").innerText = "找回密碼";
        $("#Retrieve").fadeToggle();
    };
}

function Retrieve(){
    var data = {
        "username":document.getElementById("username").value,
        "password":document.getElementById("password").value,
        "Email":document.getElementById("Email").value
    };
    var check  = new RegExp(/[^a-z^A-Z^0-9]/);
    if (data.Email == ""){
        alert("Email沒輸入");
        return;
    } else if (data.username == "" && data.password == ""){
        alert("帳號或密碼沒輸入");
        return;
    } else if ((data.username.length<6 || data.username.length > 12) && data.password == ""){
        alert("帳號長度錯誤");
        return;
    } else if ((data.password.length<6 || data.password.length > 20) && data.username == ""){
        alert("密碼長度錯誤");
        return;
    } else if (check.test(data.username)==true || check.test(data.password)==true){
        alert("帳號或密碼格式錯誤");
        return;
    } else if (data.Email.split("@")[1] != "scu.edu.tw" && data.Email.split("@")[1] != "gm.scu.edu.tw"){
        alert("信箱格式錯誤");
        return;
    }
    $("#Notice").fadeToggle();
    $.ajax({
        url:'/Retrieve',
        headers:{"X-CSRFToken":token},
        type:'POST',
        data:data,
        success:function(python_result){
            if (python_result == "Rejected"){
                alert("您輸入的資料有錯誤");
                $("#Notice").fadeToggle();
                return;
            } else if (python_result == "請求失敗" || python_result == "Invaild Login Status"){
                alert(python_result);
                window.location.reload();
                return;
            };
            Email.send({
                SecureToken : "6e8753ed-5bee-4007-9403-6840c64e35c0",
                To : data.Email,
                From : "東吳人錢包管理者<soochownoreply@gmail.com>",
                Subject : "東吳人錢包_retrieve",
                Body : "您的"+python_result.split(",")[0]+"是"+python_result.split(",")[1]
            }).then(
                function(message){
                    if(message == "OK"){
                        alert("已寄信到您的信箱");
                        $("#Notice").fadeToggle();
                        window.location.assign("/Login.html");
                    } else {
                        alert(message);
                        $("#Notice").fadeToggle();
                    };
                }
            );
        },
        error:function(error){
            console.log(error);
            document.getElementById("Notice").innerText = "失敗，請重新嘗試";
        }
    })
}

// function ResetPassword(){
//     var NewPassword = document.getElementById("NewPassword").value;
//     var confirm = document.getElementById("confirm").value;
//     var VerificationCode = document.getElementById("VerificationCode").value;
//     var check  = new RegExp(/[^a-z^A-Z^0-9]/);
//     var check2 = new RegExp(/[^0-9]/);
//     if (NewPassword == ""){alert("新密碼不可為空")}
//     else if (confirm == ""){alert("請再次輸入新密碼")}
//     else if (VerificationCode == ""){alert("請輸入驗證碼")}
//     else if (VerificationCode.length != 10){alert("驗證碼有誤")}
//     else if (check2.test(VerificationCode) == true){alert("驗證碼有誤!!")}
//     else if (NewPassword.length<6 || NewPassword.length>20){alert("新密碼長度須為6~20")}
//     else if (check.test(NewPassword) == true){alert("新密碼只能由英文數字組合")}
//     else if (NewPassword != confirm){alert("兩次輸入的新密碼不一致")}
//     else {
//         $.ajax({
//             url:'/ResetPassword',
//             headers:{"X-CSRFToken":$('meta[name=csrf-token]').attr('content')},
//             type:'POST',
//             data:{
//                 "NewPassword":NewPassword,
//                 "VerificationCode":VerificationCode
//             },
//             success:function(python_result){
//                 if (python_result == "VerificationCode is wrong"){
//                     alert("驗證碼有誤!!!");
//                 } else {
//                     alert("密碼重設成功~");
//                     window.location.assign("/Login.html");
//                 };
//             },
//             error:function(error){
//                 console.log(error);
//                 alert("密碼重設失敗，請重試");
//             }
//         })
//     }
// }


