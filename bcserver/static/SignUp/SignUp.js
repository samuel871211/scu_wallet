const token = $('meta[name=csrf-token]').attr('content');
$('meta[name=csrf-token]')[0].remove();

function Back(){window.location.assign("/Login.html")};

function ConfirmEmail(){
    var mail = document.getElementById("Email").value;
    // if (mail.split("@")[1] != "gm.scu.edu.tw" && mail.split("@")[1] != "scu.edu.tw"){
    //     alert("請使用學校信箱來驗證");
    //     return;
    // }
    $("#Waiting").fadeToggle();
    $.ajax({
        url:'/GenerateVerificationCode',
        headers:{"X-CSRFToken":token},
        type: 'POST',
        data:{"Email":mail},
        success:function(python_result){
            if (python_result == "NO"){
                alert("此信箱已被使用");
                $("#Waiting").fadeToggle();
                return;
            } else if (python_result == "請求失敗" || python_result == "Invaild Login Status"){
                alert(python_result);
                window.location.reload();
                return;
            };
            Email.send({
                SecureToken : "6e8753ed-5bee-4007-9403-6840c64e35c0",
                To : mail,
                From : "東吳人錢包管理者<soochownoreply@gmail.com>",
                Subject : "信箱驗證",
                Body : "您的驗證碼是"+python_result
            }).then(
                function(message){
                    if(message == "OK"){
                        alert("此信箱可以使用(驗證信已寄出)");
                        $("#Waiting").fadeToggle();
                    } else {
                        alert(message);
                        $("#Waiting").fadeToggle();
                    };
                }
            );
        },
        error:function(error){
            console.log(error);
            alert("網路不穩，請重新嘗試!");
            $("#Waiting").fadeToggle();
        }
    })
}

function NewDID() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm").value;
    var StudentId = document.getElementById("StudentId").value;
    var Email = document.getElementById("Email").value;
    var major = document.getElementById("major").value;
    var grade = document.getElementById("grade").value;
    var gender = document.getElementById("gender").value;
    var VerificationCode = document.getElementById("VerificationCode").value;
    var check  = new RegExp(/[^a-z^A-Z^0-9]/);
    
    if (username == ""){alert("帳號不可為空")} 
    else if (password == ""){alert("密碼不可為空")} 
    else if (confirm == ""){alert("請再次輸入密碼")} 
    else if (StudentId == ""){alert("學號不可為空")} 
    else if (Email== ""){alert("學校信箱不可為空")}
    else if (VerificationCode.length != 8 || check.test(VerificationCode)){alert("驗證碼格式錯誤")}
    else if (username.length<6 || username.length>12){alert("帳號長度須為6~12")}
    else if (password.length<6 || password.length>20){alert("密碼長度須為6~20")}
    else if (confirm != password){alert("密碼不一致！")}
    else if (check.test(username) == true){alert("帳號只能由英文數字組合")}
    else if (check.test(password) == true){alert("密碼只能由英文數字組合")} 
    else if (password == confirm){
        $("#Waiting").fadeToggle();
        var a = new Date();
        var month = String(a.getMonth()+1);
        var date = String(a.getDate());
        var hour = String(a.getHours());
        var minute = String(a.getMinutes());
        if (month.length == 1){month = "0" + month};
        if (date.length == 1){date = "0" + date};
        if (hour.length == 1){hour = "0"+hour};
        if (minute.length == 1){minute = "0" + minute};
        var time = a.getFullYear() + "-" + month  + "-" + date + " " + hour + ":" + minute;
        $.ajax({
            url:"/NewDID",
            type:"POST",
            headers:{"X-CSRFToken":token},
            data:{
                "username":username,
                "password":password,
                "StudentId":StudentId,
                "Email":Email,
                "VerificationCode":VerificationCode,
                "major":major,
                "grade":grade,
                "gender":gender,
                "DateAccountCreated":time
            },
            success: function(python_result){
                $("#Waiting").fadeToggle();
                if (python_result == "Account has been registered."){alert("此帳號已被註冊!")}
                else if (python_result == "VerificationCode is wrong."){alert("驗證碼錯誤")}
                else if (python_result == "Send Token Failed" || python_result == "Get Txn Failed"){
                    alert("註冊獎勵發送失敗，請到會員中心--->回報");
                    window.location.assign("/UserCenter.html");
                }
                else if (python_result == "OK"){
                    alert("註冊成功，獲得1顆東吳幣!");
                    window.location.assign("/UserCenter.html");
                } else {
                    alert(python_result);
                }
            },
            error: function(error) {
                console.log(error);
                alert("註冊失敗，請檢查網路連線，再重新嘗試");
                $("#Waiting").fadeToggle();
            }
        });
    }
}