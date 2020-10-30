balance = 0
list_balance = []
check = []

$.ajax({
    url: "http://52.44.57.177:8888/get_balance?user="+document.cookie.split("=")[1],
    type: 'GET',
    success: function(result) {
        list_balance = result.split("\n");
        if (result != "" && list_balance.length > 0){
            balance = list_balance.length;
        };
        document.getElementById("balance").innerHTML = "餘額："+balance;
    },
    error: function(error) {
        console.log(error);
    }
})

function GetInfo(arg){
	if (arg != "立即轉帳"){
		alert("施工中...");
	} else if (arg == "立即轉帳"){
		document.getElementById("ATM").style = "";
	}
}

function transfer(){
	var cost = parseInt(document.getElementById("cost").value);
	if (cost < 1){
		alert("轉帳金額最小為1");
		return false;
	} else if (cost > balance){
		alert("錢不夠= =");
		return false;
	} else if (document.getElementById("cost").value == "" || document.getElementById("receiver").value == "" || document.getElementById("password").value == ""){
		alert("有格子沒輸入");
		return false;
	}
	var password = document.getElementById("password").value;
	document.getElementById("password").value = "";
	document.getElementById("notice").innerHTML = "轉帳中，請稍後...";
	document.getElementById("transfer").disabled = true;
    for (i=1;i<=cost;i++){
    	var data = {
	        "sen":document.cookie.split("=")[1],
	        "rev":document.getElementById("receiver").value,
	        "method":"2",
	        "description":"東吳人錢包轉帳",
	        "txn":list_balance.pop()
	    }
    	$.ajax({
	        url: "http://52.44.57.177:8888/send_token",
	        type: 'POST',
	        headers:{
	            "contentType":"application/json;",
	            "X-API-Key":password
	        },
	        contentType: "application/json;",
	        data: JSON.stringify(data),
	        success: function (result) {
	        	check.push(result);
	        	document.getElementById("balance").innerHTML = "餘額："+list_balance.length;
	        	if(check.length == cost){
	        		document.getElementById("notice").innerHTML = "轉帳成功!";
	        	}
	        },
	        error: function (error) {
	        	console.log(error);
	        	if (check.length == 0){
	        		document.getElementById("notice").innerHTML = "轉帳失敗，請檢查484哪裡有輸入錯誤";
	        	} else if (check.length != 0){
	        		document.getElementById("notice").innerHTML = "部分金額轉帳失敗";
	        	}
	        }
	    });
    }
}