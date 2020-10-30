const token = $('meta[name=csrf-token]').attr('content');
const redirect = $('meta[name=redirect]').attr('content');
$('meta[name=csrf-token]')[0].remove();
$('meta[name=redirect]')[0].remove();

function AboutUs(){
	alert("我們是來自東吳巨資系的一個團隊\n致力於推廣區塊鏈的發展、應用");
}

function SignUp() {window.location.assign("/SignUp.html")}

function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "" || password == ""){
        alert("帳號或密碼沒輸入!");
        return false;
    };
    document.getElementById("login").disabled = true;
    $.ajax({
        url:"/login",
        type:'POST',
        headers:{"X-CSRFToken":token},
        data:{"username":username,"password":password},
        success: function (python_result){
            if (python_result == "Username is wrong."){
                document.getElementById("username").value = "";
                alert("帳號錯誤");
                document.getElementById("login").disabled = false;
            } else if (python_result == "Password is wrong."){
                document.getElementById("password").value = "";
                alert("密碼錯誤");
                document.getElementById("login").disabled = false;
            } else if (python_result == "請求失敗" || python_result == "Invaild Login Status"){
                alert(python_result);
                window.location.reload();
            } else {
                if (redirect != ""){
                    alert("登入成功，將為您自動轉向");
                    window.location.assign(redirect);
                } else if (redirect == ""){window.location.assign("/UserCenter.html")};
            };
        },
        error: function (error){
            alert("登入失敗，請檢查網路連線，再重新嘗試");
            document.getElementById("login").disabled = false;
        }
    })
}