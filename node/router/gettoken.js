const express = require('express'); //引入express组件
const app = express();
const MongoClient = require('mongodb').MongoClient;

//引入全局变量
const config = require('../libs/config');
//请求第三方接口使用
const axios = require('axios');

//计时器值
var timeclock = 0;
var tokencolck;


// 链接数据库mysql
var connection;
// 链接数据库mongodb
var url = "mongodb://localhost:27017/vipsysterm";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	// console.log(db);
	// console.log("链接数据库成功");
	connection = db.db("vipsysterm");


});

var ajaxToken = async () => {
	return new Promise((resolve, reject) => {
		let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config
			.appid + '&secret=' + config.secret;
		console.log(url)
		axios.get(url).then(result => {
			console.log(result.data);
			var tokendata = result.data;
			tokendata.getdate = new Date();
			tokendata.id = 'vip1'; //设置更新的搜索条件固定
			tokencolck = setInterval(() => {
				if (timeclock == 7000) {
					timeclock = 0;
					clearInterval(tokencolck);
					ajaxToken();
				} else {
					timeclock++;
				}

			}, 1000)
			connection.collection("token").find({}).toArray(function(err, result) {
				if (result.length == 0) {
					//从数据库写入数据
					connection.collection("token").insertOne(tokendata, function(
						error, results) {
						console.log('插入成功')
						if (error) {
							console.log('[INSERT ERROR] - ', error.message);
							return;
						}


					});
				} else {
					//更新需要先搜索，搜素条件
					var searchitem = {
						id: 'vip1'
					}
					//从数据库写入数据
					connection.collection("token").updateOne(searchitem, {
						$set: tokendata
					}, function(
						error, results) {
						console.log('更新成功')
						if (error) {
							console.log('[INSERT ERROR] - ', error.message);
							return;
						}
					});
				}
			})
			resolve();
		})
	})

}

var getphonenum = async (code) => {
	var token = await gettoken();
	console.log(token)
	return new Promise((resolve, reject) => {
		let url = 'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + token;
		console.log(url)
		axios.post(url, {
			code: code
		}).then(result => {
			console.log(result.data);
			var phonedata = result.data;
			var phone = phonedata.phone_info.purePhoneNumber;

			resolve(phone);
		})
	})
}

var gettoken = async () => {
	return new Promise((resolve, reject)=>{
		connection.collection("token").find({}).toArray((err, result) => {
			console.log(result)
			if (result.length != 0) {
				resolve(result[0].access_token);
			}
		});
	})
	
}

module.exports = {
	gettoken: gettoken,
	ajaxToken: ajaxToken,
	getphonenum: getphonenum
}
