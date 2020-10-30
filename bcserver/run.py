# coding=utf-8
from flask import Flask, render_template, request , session, url_for, redirect
from werkzeug.security import check_password_hash, generate_password_hash
# from sentry_sdk.integrations.flask import FlaskIntegration
from werkzeug.exceptions import HTTPException
from flask_socketio import SocketIO, emit
from flask_wtf.csrf import CSRFProtect
from datetime import datetime
import random
import requests
import json
import os
# import sentry_sdk
now = datetime.now() 
app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
CSRFProtect(app)
socketio = SocketIO(app)
# sentry_sdk.init(integrations=[FlaskIntegration()])

from imgurpython import ImgurClient
client_id = 'aa42fe8f65f2697'
client_secret = '1da9d9552e79345ce83998f68d7646b180c805a8'
access_token = '484f5da1a86112e2b535eade0314f757a4122b05'
refresh_token = 'de4cca72d6e2d203087316d744243004498bc0d7'
ImageClient = ImgurClient(client_id, client_secret, access_token, refresh_token)

import pymongo
client = pymongo.MongoClient("mongodb+srv://shemira:cat2163472@cluster0-quiji.mongodb.net/?retryWrites=true&w=majority")

########################################

									   
#全域app：                      
							
								   
########################################

'''
session.keys() = 
[
"username",
"password",
"major",
"selfie",
"balance",
"Unread_Mail",
"advise",
]
'''

@app.route('/clearSession')
def clear_session():
	session.clear()
	session.modified = True
	print(session)
	return "OK"

@app.errorhandler(404)
def page_not_found(error):
	if request.method == "GET":
		return redirect(url_for('Login'))
	else:
		return "app_not_found"
	'''
	1. Redirect to Login.html if users request a wrong app route
	2. Return text if users pull a post request to wrong app route 
	'''

@app.errorhandler(400)
def bad_request(error):
	return "請求失敗"
	'''
	1. Csrf-token missing will lead to bad post request.
	2. Only post request requires a csrf-token.
	3. When ajax call receives the message, reload the page
 	to refresh the csrf_token again.
 	'''

@app.errorhandler(500)
def internal_server_error(error):
	if request.method == "GET":
		return redirect(url_for('Login'))
	else:
		return "Invaild Login Status"
	'''
	1. KeyError : "username" will lead to Internal Server Error.
	2. When ajax call receives the message, front-end should 
	open an iframe or new page to let the user login first.
	'''

@app.route('/UploadImage', methods = ['POST'])
def UploadImage():
	try:
		ImageUrl = ImageClient.upload_from_b64(request.values.get("b64"))
		return ImageUrl["link"]
	except:
		return "Image Upload Failed"

def SendToken(sender,receiver):
	r = requests.get("http://52.44.57.177:8888/get_balance?user="+sender)
	if r.status_code == 200:
		data = {
			'sen':sender,
			'rev':receiver,
			'method':'2',
			'description':'Layer1ToUsers',
			'txn':[r.text.split("\n")[0]]
		}
		headers = {
			'Content-Type':'application/json',
			'X-API-Key':'khalifa' if sender == 'thane' else session["password"]
		}
		p = requests.post(
			"http://52.44.57.177:8888/send_tokens",
			data = json.dumps(data),
			headers = headers
		)
		if p.status_code == 200:
			return "OK"
		print(p.status_code,p.text)
		return "Send Token Failed"
	return "Get Txn Failed"

########################################

									   
#Login的相關app：                      
							
								   
########################################
	
@app.route('/Login.html')
def Login():
	return render_template(
		'Login.html',
		redirect = request.args.get("redirect") if request.args.get("redirect") != None else ""
	)

@app.route('/login',methods = ['POST'])
def login():
	query = {"_id":request.values.get("username")}
	res = client["user_info"]["new_user"].find_one(query)
	if res == None:
		return "Username is wrong."
	if res["password"] == request.values.get("password"):
		r = requests.get("http://52.44.57.177:8888/get_balance?user="+query["_id"])
		session["balance"] = len(r.text.split("\n"))
		session["username"] = query["_id"]
		session["major"] = res["major"]
		session["selfie"] = res["selfie"]
		session["password"] = res["password"]
		return "OK"
	return "Password is wrong."

@app.route('/SignUp.html')
def SignUp():
	return render_template('SignUp.html')

@app.route('/retrieve.html')
def retrieve():
	return render_template('retrieve.html')

########################################

									   
# retrieve的相關app                      
							
								   
########################################

@app.route('/Retrieve',methods = ['POST'])
def Retrieve():
	query = {
		"_id":request.values.get("username"),
		"password":request.values.get("password"),
		"Email":request.values.get("Email")
	}
	if query["_id"] == "":
		query.pop("_id")
		res = client["user_info"]["new_user"].find_one(query)
		if res == None:
			return "Rejected"
		if res["password"] != query["password"]:
			return "Rejected"
		return "帳號,"+res["_id"]
	else:
		query.pop("password")
		res = client["user_info"]["new_user"].find_one(query)
		if res == None:
			return "Rejected"
		return "密碼,"+res["password"]

########################################

									   
# SignUp相關的app                   
							
								   
########################################

@app.route('/GenerateVerificationCode',methods=['POST'])
def GenerateVerificationCode():
	Email = request.values.get("Email")
	res = client["user_info"]["new_user"].find_one({"Email":Email})
	if res != None: return "NO"
	vc = generate_password_hash(Email).split("$")[1].split("$")[0]
	res2 = client["user_info"]["EmailHash"].find_one({"_id":Email})
	if res2 == None:
		client["user_info"]["EmailHash"].insert_one({"_id":Email,"VerificationCode":vc})
	elif res2 != None:
		client["user_info"]["EmailHash"].update_one(res2,{"$set":{"VerificationCode":vc}})
	return vc

@app.route('/NewDID',methods=['POST'])
def NewDID():
	username = request.values.get("username")
	res = client['user_info']['new_user'].find_one({"_id":username})
	if res != None: return "Account has been registered."

	Email = request.values.get("Email")
	VerificationCode = request.values.get("VerificationCode")
	res = client["user_info"]["EmailHash"].find_one({"_id":Email,"VerificationCode":VerificationCode})
	if res == None: return "VerificationCode is wrong."

	password = request.values.get("password")
	StudentId = request.values.get("StudentId")
	major = request.values.get("major")
	grade = request.values.get("grade")
	gender = request.values.get("gender")
	DateAccountCreated = request.values.get("DateAccountCreated")

	data = {
        "name":username,
        "pub_key":"",
        "description": "Zhushan light eID",
        "method": "light"
    }
	headers = {
		'Content-Type':'application/json',
		'X-API-Key':password
	}
	p = requests.post("http://52.44.57.177:8888/new_did",data = json.dumps(data),headers = headers)
	print(p.status_code,p.text)
	if p.status_code != 200: #status_code == 409 #p.text {"message":"Account already exist"}
		return "Account has been registered."
	information = {
		"_id":username,
		"password":password,
		"StudentId":StudentId,
		"Email":Email,
		"major":major,
		"grade":grade,
		"gender":gender,
		"DateAccountCreated":DateAccountCreated,
		"IsReceivedSignUpReward":"no",
		"selfie":"/static/emoji.svg"
	}
	client["user_info"]["new_user"].insert_one(information)
	client["user_info"]["EmailHash"].delete_one(res)
	session["username"] = username
	session["major"] = major
	session["selfie"] = "/static/emoji.svg"
	session["balance"] = 0

	p = SendToken('thane',username)
	if p == "OK":
		client["user_info"]["new_user"].update_one(information,{"$set":{"IsReceivedSignUpReward":"yes"}})
		session["balance"] = 1
		session.modified = True
	return p

########################################

									   
# UserCenter相關app                    
							
								   
########################################

@app.route("/LogOut",methods = ["POST"])
def LogOut():
	session.clear()
	session.modified = True
	return "OK"

@app.route('/UserCenter.html')
def UserCenter():
	if "username" not in session.keys(): 
		return render_template(
			'UserCenter.html',
			username = "訪客",
			balance = 0,
			selfie = "/static/emoji.svg", 
			Unread_Mail = 0
		)
	
	if "Unread_Mail" not in session.keys():
		session["Unread_Mail"] = client["Mail"][session["username"]].count_documents({"read":"no"})
	return render_template(
		'UserCenter.html',
		username = session["username"],
		balance = session["balance"],
		selfie = session["selfie"], 
		Unread_Mail = session["Unread_Mail"]
	)

@app.route('/DeleteSelfie',methods = ['POST'])
def DeleteSelfie():
	client["user_info"]["new_user"].update_one({"_id":session["username"]},{"$set":{"selfie":"/static/emoji.svg"}})
	session["selfie"] = "/static/emoji.svg"
	return "OK"

@app.route('/ModifySelfie',methods = ['POST'])
def ModifySelfie():
	res = UploadImage()
	if res == "Image Upload Failed":
		return res
	
	client["user_info"]["new_user"].update_one({"_id":session["username"]},{"$set":{"selfie":res}})
	session["selfie"] = res
	return res

@app.route('/BountyBoard.html')
def BountyBoard():
	
	AllBounty = {
		"thing":[],
		"reward":[],
		"time":[],
		"place":[],
		"class":[],
		"poster":[]
	}
	for i in client['BountyBoard']['OnBoard'].find(sort=[('$natural',-1)]):
		AllBounty["poster"].append(i["poster"])
		AllBounty["thing"].append(i["thing"])
		AllBounty["reward"].append(i["reward"])
		AllBounty["time"].append(i["time"])
		AllBounty["place"].append(i["place"])
		AllBounty["class"].append(i["class"])

	MyBounty = {
		"_id":[],
		"thing":[],
		"reward":[],
		"time":[],
		"place":[],
		"poster":[],
		"class":[],
		"acceptor":[],
		"ChatRoom":[]
	}
	for i in client["BountyBoard"]["Trading"].find({"poster":session["username"]}):
		MyBounty["_id"].append(i["_id"])
		MyBounty["thing"].append(i["thing"])
		MyBounty["reward"].append(i["reward"])
		MyBounty["time"].append(i["time"])
		MyBounty["place"].append(i["place"])
		MyBounty["poster"].append(i["poster"])
		MyBounty["class"].append(i["class"])
		MyBounty["acceptor"].append(i["acceptor"])
		MyBounty["ChatRoom"].append(i["ChatRoom"])
	for i in client["BountyBoard"]["Trading"].find({"acceptor":session["username"]}):
		MyBounty["_id"].append(i["_id"])
		MyBounty["thing"].append(i["thing"])
		MyBounty["reward"].append(i["reward"])
		MyBounty["time"].append(i["time"])
		MyBounty["place"].append(i["place"])
		MyBounty["poster"].append(i["poster"])
		MyBounty["class"].append(i["class"])
		MyBounty["acceptor"].append(i["acceptor"])
		MyBounty["ChatRoom"].append(i["ChatRoom"])

	return render_template(
		'BountyBoard.html',
		username = session["username"],
		AllBounty = json.dumps(AllBounty),
		MyBounty = json.dumps(MyBounty)
	)

@app.route('/Paragraph.html')
def Paragraph():
	res = {
		"title":[],
		"_id":[],
		"time":[],
		"like":[],
		"dislike":[],
		"class":[],
		"ResponseLength":[]
	}
	
	for i in client['Paragraph']['P'].find(sort=[('$natural',-1)]):
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["class"].append(i["class"])
		res["title"].append(i["title"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	
	return render_template('Paragraph.html',res = json.dumps(res))

@app.route('/Pair.html')
def Pair():
	return render_template('Pair.html')

@app.route('/Contact.html')
def Contact():
	return render_template('Contact.html')

@app.route('/mail.html')
def mail():

	res = {
		"time":[],
		"thing":[],
		"initiator":[],
		"href":[],
		"author":[],
		"initiator":[]
	}
	for i in client["Mail"][session["username"]].find(sort=[('$natural',-1)]):
		client["Mail"][session["username"]].update_one(i,{"$set":{"read":"yes"}})
		res["time"].append(i["time"])
		res["thing"].append(i["thing"])
		res["initiator"].append(i["initiator"])
		res["href"].append(i["href"])
		res["author"].append(i["author"])
	session["Unread_Mail"] = 0
	session.modified = True

	return render_template(
		'mail.html',
		username = session["username"],
		res = json.dumps(res)
	)

@app.route('/games.html')
def games():
	return render_template('games.html')

########################################

									   
# contact的相關app                    
							
								   
########################################

@app.route('/SendAdvise', methods = ["POST"])
def SendAdvise():

	if request.values.get("b64") != None:
		res = UploadImage()
		if res == "Image Upload Failed":
			return res
		if "advise" in session.keys():
			session["advise"].append(res)
			session.modified = True
		else:
			session["advise"] = [res]
		return res
	
	client["Contact"]["advise"].insert_one({
		"username":session["username"],
		"title":request.values.get("title"),
		"description":request.values.get("description"),
		"time":request.values.get("time"),
		"urls":session["advise"]
	})
	session.pop("advise",None)
	return "OK"

@app.route('/ReceiveToken',methods = ['POST'])
def ReceiveToken():
	reason = request.values.get("reason")
	if reason == "註冊獎勵":
		res = client["user_info"]["new_user"].find_one({"_id":session["username"]})
		if res["IsReceivedSignUpReward"] == "yes": return "AlreadyReceived"
		if res["IsReceivedSignUpReward"] == "no":
			p = SendToken('thane',session["username"])
			if p == "OK":
				client["user_info"]["new_user"].update_one({"_id":session["username"]},{"$set":{"IsReceivedSignUpReward":"yes"}})
			return p
	elif reason == "任務取消":
		#這邊之後可以改成Send複數Token，但還要看助教團什麼時候發佈消息
		for i in client["BountyBoard"]["Cancel"].find({"poster":session["username"]}):
			if i["IsReceived"] == "n":
				p = SendToken('thane',session["username"])
				if p == "OK":
					client["BountyBoard"]["Cancel"].update_one(i,{"$set":{"IsReceived":"y"}})
				return p
		return "CannotFind"
	elif reason == "任務完成":
		for i in client["BountyBoard"]["Complete"].find({"acceptor":session["username"]}):
			if i["IsReceived"] == "n":
				p = SendToken('thane',session["username"])
				if p == "OK":
					client["BountyBoard"]["Complete"].update_one(i,{"$set":{"IsReceived":"y"}})
				return p
		return "CannotFind"
	elif reason == "任務刪除":
		for i in client["BountyBoard"]["Deleted"].find({"poster":session["username"]}):
			if i["IsReceived"] == "n":
				p = SendToken('thane',session["username"])
				if p == "OK":
					client["BountyBoard"]["Deleted"].update_one(i,{"$set":{"IsReceived":"y"}})
				return p
		return "CannotFind"
	else:
		return "InvaildReason"

########################################

									   
# Paragraph相關的app                    
							
								   
########################################

@app.route('/ManageMyParagraph.html')
def ManageMyParagraph():
	
	res = {
	"title":[],
	"paragraph":[],
	"_id":[],
	"ResponseLength":[],
	"time":[],
	"like":[],
	"dislike":[],
	"class":[]
	}
	
	for i in client['Paragraph']['P'].find({"username":{"$regex":"^"+session["username"]}},sort=[('$natural',-1)]):
		res["class"].append(i["class"])
		res["ResponseLength"].append(len(i["response"][0]["content"]))
		res["title"].append(i["title"])
		res["paragraph"].append(i["paragraph"])
		res["_id"].append(i["_id"])
		res["time"].append(i["time"])
		res["like"].append(len(i["like"]))
		res["dislike"].append(len(i["dislike"]))
	
	return render_template('ManageMyParagraph.html',res = json.dumps(res))

@app.route('/PublishParagraph.html')
def PublishParagraph():
	
	_id = request.args.get("_id")
	
	if _id == None:
		return render_template('PublishParagraph.html',res = "")
	# InsertNewParagraph should return a static template
	
	res = client["Paragraph"]["P"].find_one({"_id":_id})
	if res == None:
		return redirect(url_for('ManageMyParagraph'))
		# Invalid _id
	
	res.pop("like",None)
	res.pop("dislike",None)
	res.pop("time",None)
	res.pop("response",None)
	return render_template('PublishParagraph.html',res = json.dumps(res))
	# EditParagraph should return the Info as well

@app.route('/SeeParagraph.html')
def SeeParagraph():
	res = client["Paragraph"]["P"].find_one({"_id":request.args.get("_id")})
	if res == None:
		return redirect(url_for('Paragraph'))
	return render_template(
		'SeeParagraph.html',
		MyUsername = session["username"] if "username" in session.keys() else "訪客", 
		MyMajor = session["major"] if "major" in session.keys() else "東吳大學",
		MySelfie = session["selfie"] if "selfie" in session.keys() else "/static/emoji.svg",
		AuthorUsername = res["username"].split(",")[0],
		AuthorMajor = res["username"].split(",")[1],
		AuthorSelfie = res["username"].split(",")[2],
		time = res["time"],
		ClassName = res["class"],
		title = res["title"],
		LikeCount = len(res["like"]),
		DislikeCount = len(res["dislike"]),
		ResponseCount = len(res["response"][0]["content"]),
		res = json.dumps(res)
		)

########################################

									   
# ManageMyParagraph相關的app                    
							
								   
########################################

@app.route('/DeleteParagraph',methods = ["POST"])
def DeleteParagraph():
	res = client["Paragraph"]["P"].find_one({"_id":request.values.get("_id")})
	if res == None: return "_id has been modified"
	client["Paragraph"]["P"].delete_one(res)
	client["Paragraph"]["DeletedParagraph"].insert_one(res)
	return "OK"

########################################

									   
# PublishParagraph相關的app                    
							
								   
########################################

@app.route('/InsertNewParagraph',methods = ["POST"])
def InsertNewParagraph():
	username = session["username"]
	if request.values.get("major") == "顯示學系":
		username = username + "," + session["major"]
	else:
		username = username + "," + "東吳大學"
	if request.values.get("selfie") == "顯示頭像":
		username = username + "," + session["selfie"]
	else:
		username = username + "," + "/static/emoji.svg"
	
	client['Paragraph']['P'].insert_one({
		"_id":generate_password_hash(request.values.get("title")),
		"username":username,
		"title":request.values.get("title"),
		"paragraph":request.values.get("paragraph"),
		"class":request.values.get("class"),
		"time":request.values.get("time"),
		"like":[],
		"dislike":[],
		"response":[{"username":[],"content":[],"time":[],"like":[],"dislike":[]}]
	})
	return "OK"

@app.route('/EditParagraph',methods = ['POST'])
def EditParagraph():
	query = {"_id":request.values.get("_id")}
	
	username = session["username"]
	if request.values.get("major") == "顯示學系":
		username = username + "," + session["major"]
	else:
		username = username + "," + "東吳大學"
	if request.values.get("selfie") == "顯示頭像":
		username = username + "," + session["selfie"]
	else:
		username = username + "," + "/static/emoji.svg"
	
	OldData = client["Paragraph"]["P"].find_one(query)
	
	HasHistory = client["Paragraph"]["ParagraphHistory"].find_one({"origin":OldData["_id"]})
	if HasHistory == None:
		ParagraphHistory = {
			"origin":OldData["_id"],
			"history":[{
				"username":[OldData["username"]],
				"title":[OldData["title"]],
				"paragraph":[OldData["paragraph"]],
				"class":[OldData["class"]],
				"time":[OldData["time"]]
			}]
		}
		client["Paragraph"]["ParagraphHistory"].insert_one(ParagraphHistory)
	else:
		HasHistory["history"][0]["username"].append(OldData["username"])
		HasHistory["history"][0]["title"].append(OldData["title"])
		HasHistory["history"][0]["paragraph"].append(OldData["paragraph"])
		HasHistory["history"][0]["class"].append(OldData["class"])
		HasHistory["history"][0]["time"].append(OldData["time"])
		client["Paragraph"]["ParagraphHistory"].update_one({"origin":OldData["_id"]},{"$set":HasHistory})
	
	client["Paragraph"]["P"].update_one(
		query,
		{"$set":{
			"username":username,
			"title":request.values.get("title"),
			"paragraph":request.values.get("paragraph"),
			"class":request.values.get("class"),
			"time":request.values.get("time")
		}})
	return OldData["_id"]

########################################

									   
# SeeParagraph相關的app                    
							
								   
########################################

@app.route('/InsertEmotionToResponse',methods = ['POST'])
def InsertEmotionToResponse():
	query = {"_id":request.values.get("_id")}
	res = client["Paragraph"]["P"].find_one(query)
	floor =  int(request.values.get("FloorAndEmotion").split(",")[0])-1
	emotion = request.values.get("FloorAndEmotion").split(",")[1]
	if session["username"] not in res["response"][0]["like"][floor] and session["username"] not in res["response"][0]["dislike"][floor]:
		res["response"][0][emotion][floor].append(session["username"])
		client["Paragraph"]["P"].update_one(query,{"$set":{"response":res["response"]}})
		if session["username"] != res["response"][0]["username"][floor].split(",")[0]:
			client["Mail"][res["response"][0]["username"][floor].split(",")[0]].insert_one({
				"time":now.strftime("%m/%d %H:%M"),
				"thing":emotion+",response",
				"initiator":session["username"],
				"href":"/SeeParagraph.html?_id="+query["_id"],
				"read":"no",
				"author":res["response"][0]["username"][floor].split(",")[0]
			})
		return "OK"
	return "Duplicate sending emotion"

@app.route('/InsertEmotionToParagraph',methods = ["POST"])
def InsertEmotionToParagraph():
	query = {"_id":request.values.get("_id")}
	res = client["Paragraph"]["P"].find_one(query)
	emotion = request.values.get("emotion")
	if session["username"] not in res["like"] and session["username"] not in res["dislike"]:
		res[emotion].append(session["username"])
		client["Paragraph"]["P"].update_one(query,{"$set":{emotion:res[emotion]}})
		if session["username"] != res["username"].split(",")[0]:
			client["Mail"][res["username"].split(",")[0]].insert_one({
				"time":now.strftime("%m/%d %H:%M"),
				"thing":emotion + ",paragraph",
				"initiator":session["username"],
				"href":"/SeeParagraph.html?_id="+query["_id"],
				"read":"no",
				"author":res["username"].split(",")[0]
			})
		return "OK"
	return "Duplicate sending emotion"

@app.route('/EditResponse',methods = ['POST'])
def EditResponse():
	username = session["username"]
	if request.values.get("major") == "顯示學系":
		username = username + "," + session["major"]
	else:
		username = username + "," + "東吳大學"
	if request.values.get("selfie") == "顯示頭像":
		username = username + "," + session["selfie"]
	else:
		username = username + "," + "/static/emoji.svg"
	
	query = {"_id":request.values.get("_id")}
	floor = int(request.values.get("floor"))
	content = request.values.get("content")
	time = request.values.get("time")
	
	res = client["Paragraph"]["P"].find_one(query)

	res2 = client["Paragraph"]["ResponseHistory"].find_one({"origin":query["_id"]})
	if res2 == None:
		ResponseHistory = {
			"origin":query["_id"],
			"history":[{
				"username":[res["response"][0]["username"][floor]],
				"floor":[floor+1],
				"content":[res["response"][0]["content"][floor]],
				"time":[res["response"][0]["time"][floor]]
			}],
		}
		client["Paragraph"]["ResponseHistory"].insert_one(ResponseHistory)
	elif res2 != None:
		res2["history"][0]["username"].append(res["response"][0]["username"][floor])
		res2["history"][0]["floor"].append(floor+1)
		res2["history"][0]["content"].append(res["response"][0]["content"][floor])
		res2["history"][0]["time"].append(res["response"][0]["time"][floor])
		client["Paragraph"]["ResponseHistory"].update_one({"origin":query["_id"]},{"$set":res2})
	res["response"][0]["username"][floor] = username
	res["response"][0]["content"][floor] = content
	res["response"][0]["time"][floor] = time	
	client["Paragraph"]["P"].update_one(query,{"$set":{"response":res["response"]}})
	return username

@app.route('/InsertNewResponse',methods = ['POST'])
def InsertNewResponse():
	username = session["username"]
	if request.values.get("major") == "顯示學系":
		username = username + "," + session["major"]
	else:
		username = username + "," + "東吳大學"
	if request.values.get("selfie") == "顯示頭像":
		username = username + "," + session["selfie"]
	else:
		username = username + "," + "/static/emoji.svg"
	
	query = {"_id":request.values.get("_id")}
	find = client["Paragraph"]["P"].find_one(query)
	find["response"][0]["username"].append(username)
	find["response"][0]["content"].append(request.values.get("content"))
	find["response"][0]["time"].append(request.values.get("time"))
	find["response"][0]["like"].append([])
	find["response"][0]["dislike"].append([])
	client["Paragraph"]["P"].update_one(query,{"$set":{"response":find["response"]}})

	# MailFromParagraphResponse(文章有人留言)
	client["Mail"][find["username"].split(",")[0]].insert_one({
		"time":request.values.get("time"),
		"thing":"response,paragraph",
		"initiator":session["username"],
		"href":"/SeeParagraph?_id="+query["_id"],
		"read":"no",
		"author":find["username"].split(",")[0]
	})

	# MailFromTagResponse(留言有人回應)
	if request.values.get("placeholder")[:2] == "回覆":
		author = request.values.get("placeholder").split("樓")[1].split("的留言")[0];
		client["Mail"][author].insert_one({
			"time":request.values.get("time"),
			"thing":"tag,response",
			"initiator":session["username"],
			"href":"/SeeParagraph?_id="+query["_id"],
			"read":"no",
			"author":author
		})

	return "OK"

@app.route('/Report',methods = ['POST'])
def Report():
	data = {
		"username":request.values.get("username"),
		"content":request.values.get("content"),
		"floor":int(request.values.get("floor"))+1,
		"reason":request.values.get("reason"),
		"reporter":session["username"],
		"origin":request.values.get("origin")
	}
	res = client["Paragraph"]["P"].find_one({"_id":data["origin"]})

	if res["response"][0]["username"][data["floor"]-1].split(",")[0] != data["username"]:return "No"
	CheckDuplicate = client["Contact"]["Report"].find_one({"origin":data["origin"],"floor":data["floor"]})
	if CheckDuplicate != None: return "Duplicate Sending Report"
	client["Contact"]["Report"].insert_one(data)
	return "OK"

@app.route('/DeleteResponse',methods = ["POST"])
def DeleteResponse():
	query = {"_id":request.values.get("_id")}
	floor = int(request.values.get("floor"))
	time = request.values.get("time")
	
	res = client["Paragraph"]["P"].find_one(query)
	
	res2 = client["Paragraph"]["ResponseHistory"].find_one({"origin":query["_id"]})
	if res2 == None:
		ResponseHistory = {
			"origin":query["_id"],
			"history":[{
				"username":[res["response"][0]["username"][floor]],
				"floor":[floor+1],
				"content":[res["response"][0]["content"][floor]],
				"time":[res["response"][0]["time"][floor]]
			}],
		}
		client["Paragraph"]["ResponseHistory"].insert_one(ResponseHistory)
	elif res2 != None:
		res2["history"][0]["username"].append(res["response"][0]["username"][floor])
		res2["history"][0]["floor"].append(floor+1)
		res2["history"][0]["content"].append(res["response"][0]["content"][floor])
		res2["history"][0]["time"].append(res["response"][0]["time"][floor])
		client["Paragraph"]["ResponseHistory"].update_one({"origin":query["_id"]},{"$set":res2})
	res["response"][0]["username"][floor] = "unknown,SCU,/static/emoji.svg"
	res["response"][0]["content"][floor] = "This response has been deleted"
	res["response"][0]["time"][floor] = time	
	client["Paragraph"]["P"].update_one(query,{"$set":{"response":res["response"]}})
	return "OK"

########################################

									   
# Games相關的app                   
							
								   
########################################

@app.route('/WinningNumbers',methods = ['POST'])
def WinningNumbers():
	date = request.values.get("today")
	res = client["Games"]["WinningNumbersFor539"].find_one({"_id":date+"Daily539WinningNumbers"})
	if res == None: return "None"
	del res["_id"]
	MyNumbers = client["Games"][session["username"]].find_one({"_id":session["username"]+"Daily539"})
	if MyNumbers == None or MyNumbers["consecutive"][0] != date:
		res["MyNumbers"] = "None"
		return res
	res["MyNumbers"] = MyNumbers[date]
	return res

@app.route('/Join539',methods = ['POST'])
def Join539():
	numbers = request.values.get("numbers")
	today = request.values.get("today")
	
	predict = []
	for i in range(5):
		predict.append(numbers.split(",")[i])
	
	res = client["Games"][session["username"]].find_one({"_id":session["username"]+"Daily539"})
	if res == None:
		client["Games"][session["username"]].insert_one({"_id":session["username"]+"Daily539","consecutive":[today],today:predict})
	elif today != res["consecutive"][0]:
		res["consecutive"].insert(0,today)
		client["Games"][session["username"]].update_one({"_id":session["username"]+"Daily539"},{"$set":{"consecutive":res["consecutive"],today:predict}})
	elif today == res["consecutive"][0]:
		return "no"

	res2 = client["Games"]["WinningNumbersFor539"].find_one({"_id":today+"Daily539WinningNumbers"})
	if res2 == None:
		WinningNumbers = [str(random.randint(1,39))]
		while len(WinningNumbers) < 5: 
		    number = str(random.randint(1,39))
		    if number not in WinningNumbers:
		        WinningNumbers.append(number)
		CountDuplicate = 0
		for i in range(len(predict)):
			if predict[i] in WinningNumbers:
				CountDuplicate += 1
		client["Games"]["WinningNumbersFor539"].insert_one({"_id":today+"Daily539WinningNumbers","WinningNumbers":WinningNumbers,"Rank":[session["username"]+";"+str(CountDuplicate)]})
	elif res2 != None:
		CountDuplicate = 0
		for i in range(len(predict)):
			if predict[i] in res2["WinningNumbers"]:
				CountDuplicate += 1
		res2["Rank"].insert(0,session["username"]+";"+str(CountDuplicate))
		client["Games"]["WinningNumbersFor539"].update_one({"_id":today+"Daily539WinningNumbers"},{"$set":res2})
	return "ok"

@app.route('/JoinABGame',methods=['POST'])
def JoinABGame():
	today = request.values.get("today")
	res = client["Games"][session["username"]].find_one({"_id":session["username"]+"DailyABGame"})
	if res == None: 
		number = str(random.randint(1000,9999))
		while number[0] == number[1] or number[0] == number[2] or number[0] == number[3] or number[1] == number[2] or number[1] == number[3] or number[2] == number[3]:
		    number = str(random.randint(1000,9999))
		client["Games"][session["username"]].insert_one({"_id":session["username"]+"DailyABGame","consecutive":[today],today:[number]})
		return "new client"
	if today != res["consecutive"][0]:
		number = str(random.randint(1000,9999))
		while number[0] == number[1] or number[0] == number[2] or number[0] == number[3] or number[1] == number[2] or number[1] == number[3] or number[2] == number[3]:
		    number = str(random.randint(1000,9999))
		res["consecutive"].insert(0,today)
		client["Games"][session["username"]].update_one({"_id":session["username"]+"DailyABGame"},{"$set":{"consecutive":res["consecutive"],today:[number]}})
		return "today first join"
	return {today:res[today]}

@app.route('/DetermineAB',methods = ["POST"])
def DetermineAB():
	CountA , CountB = 0 , 0
	number = request.values.get("number")
	today = request.values.get("today")
	res = client["Games"][session["username"]].find_one({"_id":session["username"]+"DailyABGame"})
	if len(res[today][0]) != 4: return "AlreadyReceived"
	for i in range(4):
		if number[i] in res[today][0] and number[i] == res[today][0][i]:
			CountA += 1
		elif number[i] in res[today][0] and number[i] != res[today][0][i]:
			CountB += 1
	res[today].append(number+","+str(CountA)+"A"+str(CountB)+"B")
	client["Games"][session["username"]].update_one({"_id":session["username"]+"DailyABGame"},{"$set":res})
	return str(len(res[today])-1)+","+str(CountA)+"A"+str(CountB)+"B"

@app.route('/ReceiveABGameReward',methods=['POST'])
def ReceiveABGameReward():
	today = request.values.get("today")
	query = {"_id":session["username"]+"DailyABGame"}
	res = client["Games"][session["username"]].find_one(query)
	if len(res[today][0]) != 4: return "AlreadyReceived"
	res[today][0] += ",received"
	result = SendToken('thane',session["username"])
	if result == "OK":
		client["Games"][session["username"]].update_one(query,{"$set":res})
	return result

########################################

									   
# BountyBoard相關的app                   
							
								   
########################################

@app.route('/PublishBounty',methods = ['POST'])
def PublishBounty():
	p = SendToken(session["username"],'thane')
	if p == "OK":
		client['BountyBoard']['OnBoard'].insert_one({
			"thing":request.values.get("thing"),
			"reward":request.values.get("reward"),
			"time":request.values.get("time"),
			"place":request.values.get("place"),
			"poster":session["username"],
			"class":request.values.get("class"),
			"_id":generate_password_hash(request.values.get("thing")+request.values.get("reward")+request.values.get("time")+session["username"]+request.values.get("class"))
		})
	return p

@app.route('/MailFromBounty',methods = ['POST'])
def MailFromBounty():
	query = {
		"poster":request.values.get("poster"),
		"class":request.values.get("class"),
		"thing":request.values.get("thing"),
		"reward":request.values.get("reward"),
		"time":request.values.get("time")
	}
	res = client["BountyBoard"]["OnBoard"].find_one(query)
	if res == None: return "Cannot Find"
	client["BountyBoard"]["OnBoard"].delete_one(res)
	res["acceptor"] = session["username"]

	EmptyRoom = client["ChatRoom"]["TradingConfirm"].find_one({"_id":"IsAvailable"})
	ChatRoom = ""
	if len(EmptyRoom["empty"]) == 0:
		ChatRoom = str(client["ChatRoom"]["TradingConfirm"].count_documents({})+1000)
	else:
		ChatRoom = str(EmptyRoom["empty"][0])
		EmptyRoom["empty"].pop(0)
		client["ChatRoom"]["TradingConfirm"].update_one({"_id":"IsAvailable"},{"$set":{"empty":EmptyRoom["empty"]}})
	client["ChatRoom"]["TradingConfirm"].insert_one({"_id":res["_id"],"username":res["acceptor"]+","+res["poster"],"ChatRoom":ChatRoom})
	AcceptorInfo = client["user_info"]["new_user"].find_one({"_id":res["acceptor"]})
	PosterInfo = client["user_info"]["new_user"].find_one({"_id":res["poster"]})
	if AcceptorInfo == None or PosterInfo == None: return "Rejected"
	UpdateHistory = {
		"names":[{
			res["poster"]:AcceptorInfo["_id"]+","+AcceptorInfo["major"]+","+AcceptorInfo["selfie"],
			res["acceptor"]:PosterInfo["_id"]+","+PosterInfo["major"]+","+PosterInfo["selfie"]
		}],
		"username":[res["acceptor"],res["poster"]],
		"time":[query["time"].split(" ")[1],query["time"].split(" ")[1]],
		"read":["n","n"],
		"reply":["n","n"],
		"message":["您好，我是"+AcceptorInfo["major"]+"的"+AcceptorInfo["_id"],"您好，我是"+PosterInfo["major"]+"的"+PosterInfo["_id"]]
	}
	client["ChatRoom"]["History"].update_one({"_id":"ChatRoom"+ChatRoom},{"$set":UpdateHistory})
	res["ChatRoom"] = ChatRoom
	client["BountyBoard"]["Trading"].insert_one(res)
	data = {
		"time":request.values.get("AcceptTime"),
		"thing":"accept,bounty",
		"initiator":res["acceptor"],
		"author":res["poster"],
		"read":"no",
		"href":"/trade.html?_id="+res["_id"]
	}
	client["Mail"][data["initiator"]].insert_one(data)
	client["Mail"][data["author"]].insert_one(data)
	return data["href"]

@app.route('/DeleteBounty',methods = ['POST'])
def DeleteBounty():
	a = {
		"thing":request.values.get("thing"),
		"reward":request.values.get("reward"),
		"time":request.values.get("time"),
		"place":request.values.get("place"),
		"poster":session["username"],
		"class":request.values.get("class")
	}
	res = client['BountyBoard']['OnBoard'].find_one(a)
	if res == None: return "Rejected"
	p = SendToken('thane',a["poster"])
	client['BountyBoard']['OnBoard'].delete_one(a)
	if p == "OK":
		a["IsReceived"] = "y"
	else:
		a["IsReceived"] = "n"
	a["DeleteTime"] = request.values.get("DeleteTime")
	client['BountyBoard']["Deleted"].insert_one(a)
	return p

########################################

									   
#Pair的相關app                    
							
								   
########################################

@app.route('/JoinDailyPair',methods = ['POST'])
def JoinDailyPair():
	if client["ChatRoom"]["Confirm"].find_one({"username":session["username"]}) == None:
		p = SendToken(session["username"],'thane')
		if p.status_code == 200:
			ChatRoom = client["ChatRoom"]["Confirm"].count_documents({}) // 2 + 1
			client["ChatRoom"]["Confirm"].insert_one({
				"_id":generate_password_hash(session["password"]),
				"username":session["username"],
				"ChatRoom":str(ChatRoom),
				"major":session["major"] if request.values.get("major") == "顯示學系" else "東吳大學",
				"selfie":session["selfie"] if request.values.get("selfie") == "顯示頭像" else "/static/emoji.svg"
			})
		return p
	return "Duplicate request."

@app.route('/EnterChatRoom',methods = ["POST"])
def EnterChatRoom():
	IsJoin = client["ChatRoom"]["Confirm"].find_one({"username":session["username"]})
	if IsJoin == None:
		return "User didn't join"
	if client["ChatRoom"]["Confirm"].count_documents({"ChatRoom":IsJoin["ChatRoom"]}) == 1:
		return "No Match"
	return IsJoin["_id"]

########################################

									   
#ChatRoom的相關app                    
							
								   
########################################

@app.route('/ChatRoom.html')
def ChatRoom():
	
	res = client["ChatRoom"]["Confirm"].find_one({"_id":request.args.get("_id")})
	if res == None or res["username"] != session["username"]:
		return redirect(url_for("Pair"))
	# Invaild _id(password hash) or username does not match

	res2 = client["ChatRoom"]["History"].find_one({"_id":"ChatRoom"+res["ChatRoom"]})
	if len(res2["names"][0]) != 2:
		for i in client["ChatRoom"]["Confirm"].find({"ChatRoom":res["ChatRoom"]}):
			if i["username"] != session["username"]:
				res2["names"][0][session["username"]] = i["username"]+","+i["major"]+","+i["selfie"]
				client["ChatRoom"]["History"].update_one({"_id":"ChatRoom"+res["ChatRoom"]},{"$set":res2})
	
	if session["username"] not in res2["names"][0].keys():
		return redirect(url_for("Pair"))
	# No Partner
		
	return render_template(
		'ChatRoom.html',
		partner = res2["names"][0][session["username"]].split(",")[0],
		major = res2["names"][0][session["username"]].split(",")[1],
		SelfieDiv = res2["names"][0][session["username"]].split(",")[2],
		MyName = session["username"],
		room = res["ChatRoom"],
		python_result = json.dumps(res2)
	)

########################################

									   
# trade相關的app                   
							
								   
########################################

@app.route('/trade.html')
def trade():
	res = client["BountyBoard"]["Trading"].find_one({"_id":request.args.get("_id")})
	if res == None:
		return redirect(url_for('Login'))
	if res["poster"] != session["username"] and res["acceptor"] != session["username"]:
		return redirect(url_for('Login'))
	return render_template(
		'trade.html',
		MyName = session["username"],
		TitleDiv = "【"+res["class"]+"】"+res["thing"],
		reward = res["reward"],
		time = res["time"],
		place = res["place"],
		ChatRoomID = res["ChatRoom"],
		log = json.dumps(res["log"][0]) if "log" in res.keys() else "None",
		history = json.dumps(client["ChatRoom"]["History"].find_one({"_id":"ChatRoom"+res["ChatRoom"]}))
	)

@socketio.on('TradingStatus')
def TradingStatus(ChatRoom,_id,username,time,review,CancelReason):
	print(ChatRoom,_id,username,time,review,CancelReason)
	query = {"_id":_id,"ChatRoom":ChatRoom}
	res = client["BountyBoard"]["Trading"].find_one(query)
	if res == None: return "Cannot Find"
	if "log" in res.keys():
		res["log"][0]["username"].append(username)
		res["log"][0]["time"].append(time)
		res["log"][0]["review"].append(review)
		if CancelReason == "": #代表是完成任務
			for i in range(len(res["log"][0]["action"])):
				if res["log"][0]["action"][i].split(",")[0] == "Complete":
					if res["log"][0]["username"][i] == username: 
						socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"Duplicate Request","CancelReason":CancelReason,"time":time})
						return "Duplicate Request"
					res["log"][0]["action"].append("Complete,")
					client["BountyBoard"]["Trading"].delete_one(query)
					history = client["ChatRoom"]["History"].find_one({"_id":"ChatRoom"+res["ChatRoom"]})
					client["ChatRoom"]["History"].update_one({"_id":"ChatRoom"+res["ChatRoom"]},{"$set":{"username":[],"time":[],"message":[],"read":[],"reply":[],"UnsendHistory":[{"index":[],"message":[],"reply":[],"time":[]}],"names":[{}]}})
					client["ChatRoom"]["TradingConfirm"].delete_one({"ChatRoom":res["ChatRoom"]})
					empty = client["ChatRoom"]["TradingConfirm"].find_one({"_id":"IsAvailable"})
					empty["empty"].insert(0,res["ChatRoom"])
					client["ChatRoom"]["TradingConfirm"].update_one({"_id":"IsAvailable"},{"$set":{"empty":empty["empty"]}})
					res["history"] = [history]
					p = SendToken('thane',res["acceptor"])
					if p == "OK":
						res["IsReceived"] = "y"
					else:
						res["IsReceived"] = "n"
					res.pop("ChatRoom")
					client["BountyBoard"]["Complete"].insert_one(res)
					socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"TradingCompleted","CancelReason":CancelReason,"time":time,"IsReceived":res["IsReceived"],"poster":res["poster"]})
					return "TradingCompleted"
			res["log"][0]["action"].append("Complete,")
			client["BountyBoard"]["Trading"].update_one(query,{"$set":res})
			socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"OK","CancelReason":CancelReason,"time":time})
			return "OK"
		else:
			for i in range(len(res["log"][0]["action"])):
				if res["log"][0]["action"][i].split(",")[0] == "CancelReason":
					if res["log"][0]["username"][i] == username:
						socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"Duplicate Request","CancelReason":CancelReason,"time":time})
						return "Duplicate Request"
					res["log"][0]["action"].append("CancelReason,"+CancelReason)
					client["BountyBoard"]["Trading"].delete_one(query)
					history = client["ChatRoom"]["History"].find_one({"_id":"ChatRoom"+res["ChatRoom"]})
					client["ChatRoom"]["History"].update_one({"_id":"ChatRoom"+res["ChatRoom"]},{"$set":{"username":[],"time":[],"message":[],"read":[],"reply":[],"UnsendHistory":[{"index":[],"message":[],"reply":[],"time":[]}],"names":[{}]}})
					client["ChatRoom"]["TradingConfirm"].delete_one({"ChatRoom":res["ChatRoom"]})
					empty = client["ChatRoom"]["TradingConfirm"].find_one({"_id":"IsAvailable"})
					empty["empty"].insert(0,res["ChatRoom"])
					client["ChatRoom"]["TradingConfirm"].update_one({"_id":"IsAvailable"},{"$set":{"empty":empty["empty"]}})
					res["history"] = [history]
					p = SendToken('thane',res["poster"])
					if p == "OK":
						res["IsReceived"] = "y"
					else:
						res["IsReceived"] = "n"
					res.pop("ChatRoom")
					client["BountyBoard"]["Cancel"].insert_one(res)
					socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"TradingCanceled","CancelReason":CancelReason,"time":time,"IsReceived":res["IsReceived"],"poster":res["poster"]})
					return "TradingCanceled"
			res["log"][0]["action"].append("CancelReason,"+CancelReason)
			client["BountyBoard"]["Trading"].update_one(query,{"$set":res})
			socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"OK","CancelReason":CancelReason,"time":time})
			return "OK"
	else:
		temp = {"username":[username],"time":[time],"action":[],"review":[review]}
		if CancelReason == "":
			temp["action"].append("Complete,")
		else:
			temp["action"].append("CancelReason,"+CancelReason)
		res["log"] = [temp]
		client["BountyBoard"]["Trading"].update_one(query,{"$set":res})
		socketio.emit(ChatRoom+"TradingStatus",{"username":username,"status":"OK","CancelReason":CancelReason,"time":time})
		return "OK"

@socketio.on('ImageUpload')
def ImageUpload(RoomID,username,time,b64):
	try:
		ImageUrl = ImageClient.upload_from_b64(b64)
		message = "<img src='"+ImageUrl["link"]+"' style='width:100%'>"
		query = {"_id":"ChatRoom"+RoomID}
		res = client["ChatRoom"]["History"].find_one(query)
		res["username"].append(username)
		res["time"].append(time)
		res["message"].append(message)
		res["read"].append("n")
		res["reply"].append("n")
		client["ChatRoom"]["History"].update_one(query,{"$set":res})
		socketio.emit(RoomID+"ImageUpload",{"username":username,"time":time,"message":message})
	except:
		socketio.emit(RoomID+"ImageUpload",{"username":username,"time":time,"message":"Image Upload Failed"})

@socketio.on('TextMessage')
def HandleMessage(RoomID,username,time,message):
	socketio.emit(RoomID,{"username":username,"time":time,"message":message})

	query = {"_id":"ChatRoom"+RoomID}
	res = client["ChatRoom"]["History"].find_one(query)
	res["username"].append(username)
	res["time"].append(time)
	res["message"].append(message)
	res["read"].append("n")
	res["reply"].append("n")
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

@socketio.on('EnterOrReload')
def EnterOrReload(RoomID,username,curlen):
	socketio.emit(RoomID+username+"EnterOrReload",{"curlen":curlen})

	query = {"_id":"ChatRoom"+str(RoomID)}
	res = client["ChatRoom"]["History"].find_one(query)
	for i in range(int(curlen)-1,-1,-1):
		if res["username"][i] == username:
			if res["read"][i] == "n":
				res["read"][i] = "y"
			elif res["read"][i] == "y":
				break
	client["ChatRoom"]["History"].update_one(query,{"$set":{"read":res["read"]}})

@socketio.on('InstantRead')
def EnterOrReload(RoomID,username,curlen):
	socketio.emit(RoomID+username+"InstantRead",{"curlen":curlen})

	query = {"_id":"ChatRoom"+str(RoomID)}
	res = client["ChatRoom"]["History"].find_one(query)
	res["read"][curlen] = "y"
	client["ChatRoom"]["History"].update_one(query,{"$set":{"read":res["read"]}})

@socketio.on('unsend')
def unsend(RoomID,curlen):
	socketio.emit(RoomID+'unsend',{"curlen":curlen})

	query = {"_id":"ChatRoom"+str(RoomID)}
	res = client["ChatRoom"]["History"].find_one(query)

	res["UnsendHistory"][0]["index"].append(curlen)
	res["UnsendHistory"][0]["message"].append(res["message"][curlen])
	res["UnsendHistory"][0]["reply"].append(res["reply"][curlen])
	res["UnsendHistory"][0]["time"].append(res["time"][curlen])

	res["message"][curlen] = "Unsent a message"
	res["time"][curlen] = ""
	res["reply"][curlen] = "n"
	
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

@socketio.on('UpdateReply')
def UpdateReply(RoomID,ReplyArray):
	query = {"_id":"ChatRoom"+str(RoomID)}
	res = client["ChatRoom"]["History"].find_one(query)
	arr = json.loads(ReplyArray)
	for i in range(len(arr)):
		res["reply"][int(arr[i])] = res["reply"][int(arr[i])].replace(res["reply"][int(arr[i])].split(",")[2],"Message Unavailable")
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

@socketio.on('reply')
def reply(RoomID,username,time,curlen,message,src,origin):
	socketio.emit(RoomID+"reply",{"curlen":curlen,"message":message,"src":src,"time":time,"username":username})

	query = {"_id":"ChatRoom"+str(RoomID)}
	res = client["ChatRoom"]["History"].find_one(query)
	res["username"].append(username)
	res["time"].append(time)
	res["read"].append("n")
	res["reply"].append(str(curlen)+","+src.split(":5000")[1]+","+origin)
	res["message"].append(message)
	client["ChatRoom"]["History"].update_one(query,{"$set":res})

if __name__ == '__main__':
	socketio.run(app,host="0.0.0.0",debug=False)