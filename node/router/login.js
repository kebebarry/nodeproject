const express = require('express'); //引入express组件
const app = express(); //创建接口应用或者web服务器
const MongoClient = require('mongodb').MongoClient;
//以下引入为为了能解析json请求参数
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require("fs"); //本地写日志使用
const gettoken=require('./gettoken');//获取token以及手机号等第三方接口
const sha1=require('../libs/sha1');

//请求第三方接口使用
const axios=require('axios');
//引入全局变量
const config=require('../libs/config');
const router = express.Router();

const jwt=require('../libs/jwt');
const { json } = require('express/lib/response');
// 链接数据库mysql
var connection;
// 链接数据库mongodb
var url = "mongodb://localhost:27017/vipsysterm";

MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	// console.log(db);
	// console.log("链接数据库成功");d
	connection = db.db("vipsysterm");
});

// 全局中间件验证token


//注册
router.post('/regist', async (req, res) =>{
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('regist')
	console.log(req)
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	// var getdata = {username:"daik",password:"123456"};
	console.log(JSON.stringify(getdata));
	res.status(200);
	if(getdata.username == ''|| getdata.username == undefined){
		res.json({
			code: '0',
			message: '用户名不能为空'
		});
		res.end();
		return;
	}
	if ( getdata.idcard == ''  || getdata.idcard ==undefined) {
		res.json({
			code: '0',
			message: '身份证号不能为空'
		});
		res.end();
		return;
	}
	if(getdata.password == ''||getdata.password == undefined){
		getdata.password=sha1.hex('11111');
	}	
		var coderesult=await getOpenid(getdata.code);
		getdata.session_key=coderesult.session_key;
		getdata.unionid=coderesult.unionid;
		getdata.openid=coderesult.openid;
		console.log(JSON.stringify(getdata));
		// 查重
		connection.collection("userlist").find({
			username: getdata.username
		}).toArray(function(err, result) { // 返回集合中所有数据
			if (err) throw err;
			console.log(result);
			if (result.length > 0) {
				res.json({
					code: '0',
					message: '用户名已存在'
				});
				res.end();
			} else {
				//从数据库写入数据
				connection.collection("userlist").insertOne(getdata, function(error, results) {
					console.log('插入成功')
					if (error) {
						console.log('[INSERT ERROR] - ', error.message);

						res.json({
							resoponse: error.message
						});
						res.end();
						return;
					}

					console.log(typeof(JSON.stringify(results)))
					console.log('The solution is: ', JSON.stringify(results));

					res.json({
						code: '1',
						message: '注册成功'
					});
					res.end();
				});
			}
		});


	
});
//登录
router.post('/login', async (req, res) => {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('login')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata));
	if (getdata.username != '' && getdata.password != '' && getdata.username != undefined && getdata.password !=
		undefined) {

// 查询
		connection.collection("userlist").find({
			username: getdata.username
		}).toArray(function(err, result) { // 返回集合中所有数据
			if (err) throw err;
			console.log(result);
			if (result.length > 0) {
				var dbdata=result[0];
				if(dbdata.password==getdata.password){
					var token=jwt.generateToken(dbdata.username);
					res.json({
						code: '1',
						message: '登录成功！',
						custom:{
							token:token
						}
					});
					res.end();
				}else{
					res.json({
						code: '0',
						message: '用户名密码不正确！'
					});
					res.end();
				}
			} else {
				res.json({
					code: '0',
					message: '用户名密码不正确！'
				});
				res.end();
			}
		});
	} else {
		res.status(200);
		res.json({
			response: '参数缺失，登录失败'
		});
		res.end();
	}
});



//
router.post('/getUsrInfo',async (req, res)=> {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('getUsrInfo')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata))
	if (getdata.code != '' &&  getdata.code != undefined) {
		// 调用微信的接口获取openid
	var coderesult=await getOpenid(getdata.code);
	
	connection.collection("userlist").find({
			openid: coderesult.openid
		}).toArray(function(err, result) { // 返回集合中所有数据
			if (err) throw err;
			console.log(result);
			if (result.length > 0) {
				var dbdata=result[0];
				var token=jwt.generateToken(dbdata.username);
				res.json({
					code: '1',
					message: '登录成功！',
					custom:{
						userinfo:dbdata,
						token:token,
						islogin:'1'
					}
				});
				res.end();
			} else {
				res.json({
					code: '1',
					message: '用户还未注册！',
					custom:{
						islogin:'0'
					}
				});
				res.end();
			}
		});
	} else {
		res.status(200);
		res.json({
			code: '0',
			message: '参数报错！',
			custom:{
				
			}
		});
		res.end();
	}

})

/**
 * 获取openid
 * @param {*} code 
 */
var getOpenid=async (code)=>{
	return new Promise((resolve, reject)=>{
		let url='https://api.weixin.qq.com/sns/jscode2session?appid='+config.appid+'&secret='+config.secret+'&js_code='+code+'&grant_type=authorization_code';
		console.log(url)
		axios.get(url).then(result=>{
			console.log(result.data);
			resolve(result.data);
		})
	})
	
}

//获取手机号码
router.post('/getphonenumber', async (req, res)=> {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('getphonenumber')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata))
	if (getdata.code && getdata.code != undefined) {
		var phonenum=await gettoken.getphonenum(getdata.code);
		console.log(phonenum)
		res.json({
			code: '1',
			message: '获取手机号成功！',
			custom:{
				phonenum:phonenum
			}
		});
		res.end();
	} else {
		res.status(200);
		res.json({
			text: '获取code失败'
		});
		res.end();
	}
});


//获取列表数据
router.post('/getlist', function(req, res) {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata));
	res.status(200);
	var addSql = 'SELECT * from websites';
	var searchchildren = 'SELECT * from listchildren ';
	console.log(addSql);
	//从数据库读数据
	connection.query(addSql, function(error, results) {
		if (error) {
			console.log('[INSERT ERROR] - ', error.message);
			res.json({
				resoponse: error.message
			});
			res.end();
			return;
		}
		var fresult = results;

		connection.query(searchchildren, function(error, sqlres) {
			if (error) {
				console.log('[INSERT ERROR] - ', error.message);
				res.json({
					resoponse: error.message
				});
				res.end();
				return;
			}
			var children = sqlres;
			console.log('The solution is: ', JSON.stringify(sqlres));

			for (var i = 0; i < fresult.length; i++) {
				if (fresult[i].ishaschildren == '1') {
					var childrenlist = [];
					for (var n = 0; n < children.length; n++) {
						if (fresult[i].uuid == children[n].uuid) {
							childrenlist.push(children[n]);
						}

					}

					fresult[i].children = childrenlist;
				}
			}
			console.log(typeof(JSON.stringify(results)))
			console.log('The solution is: ', JSON.stringify(fresult));
			res.json({
				resoponse: '请求成功',
				userarea: fresult
			});
			res.end();
		})

	});

});

//添加积分消费
app.all('/addinit', function(req, res) {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata));
	res.status(200);
	if (getdata.userguid == '') {
		res.json({
			resoponse: '缺少用户唯一标识',
			satus: '0'
		});
		res.end();
		return;
	}
	if (getdata.jifen == '') {
		res.json({
			resoponse: '缺少积分',
			satus: '0'
		});
		res.end();
		return;
	}
	if (getdata.isadd == '') {
		res.json({
			resoponse: '缺少状态',
			satus: '0'
		});
		res.end();
		return;
	}
	var nowdate = new Date();
	var nowtime = nowdate.getFullYear().toString() + '年' + (nowdate.getMonth() + 1).toString() + '月' + nowdate
		.getDate().toString() + '日' + ' ' + nowdate.getHours() + ':' + nowdate.getMinutes();
	console.log(nowtime);
	var addSql = 'INSERT INTO integration(num,userguid,jifen,isadd,date) VALUES(0,?,?,?,?)'; //新增等方法
	var addSqlParams = [getdata.userguid, getdata.jifen, getdata.isadd, nowtime]; //新增的方法
	console.log(addSql);
	//从数据库写入数据
	// connection.query(addSql, addSqlParams, function(error, results) {
	// 	if(error) {
	// 		console.log('[INSERT ERROR] - ', error.message);

	// 		res.json({
	// 			resoponse: error.message
	// 		});
	// 		res.end();
	// 		return;
	// 	}

	// 	console.log(typeof(JSON.stringify(results)))
	// 	console.log('The solution is: ', JSON.stringify(results));

	// 	res.json({
	// 		resoponse: '积分处理成功',
	// 		satus: '1'
	// 	});
	// 	res.end();
	// });

});
//获取列表数据
app.all('/getjifenlist', function(req, res) {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata));
	res.status(200);
	if (getdata.userguid == '') {
		res.json({
			resoponse: '缺少用户唯一标识',
			satus: '0'
		});
		res.end();
		return;
	}
	if (getdata.pagesize == '') {
		res.json({
			resoponse: '缺少分页参数',
			satus: '0'
		});
		res.end();
		return;
	}
	if (getdata.pageindex == '') {
		res.json({
			resoponse: '缺少分页参数',
			satus: '0'
		});
		res.end();
		return;
	}
	var searchSql = 'SELECT * from integration where userguid=' + getdata.userguid + ' limit ' + getdata
		.pageindex + ',' + getdata.pagesize;
	console.log(searchSql);
	//从数据库读数据
	// connection.query(searchSql, function(error, results) {
	// 	if(error) {
	// 		console.log('[INSERT ERROR] - ', error.message);
	// 		res.json({
	// 			resoponse: error.message
	// 		});
	// 		res.end();
	// 		return;
	// 	}
	// 	var fresult = results;
	// 		console.log('The solution is: ', JSON.stringify(fresult));
	// 		res.json({
	// 			resoponse: '请求成功',
	// 			userarea: fresult,
	// 			status:'1'
	// 		});
	// 		res.end();


	// });

});

module.exports = router;
