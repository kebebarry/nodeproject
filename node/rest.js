var express = require('express'); //引入express组件
var app = express(); //创建接口应用
var mysql = require('mysql'); //引入数据库组件
//以下引入为为了能解析json请求参数
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");
//var adddatasuccess = ' { fieldCount: 0,affectedRows: 1,insertId: 6,serverStatus: 2,warningCount: 0,message: '',protocol41: true,changedRows: 0 }'
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded
//链接数据库
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'mysql',
	port: '3300'
});
connection.connect();
//
app.all('/edit', function(req, res) {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('denddata')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	//从数据库读数据
	connection.query('DELETE FROM websites where name="' + getdata.username + '"', function(error, results, fields) {
		if(error) {
			console.log('[SELECT ERROR] - ', error.message);
			return;
		}
		res.status(200);
		console.log('The solution is: ', JSON.stringify(results));
		res.json(results);
		res.end();
	});
	//下面为本地写日志
	//	fs.writeFile(getdata.name + '.txt', getdata.value, function(err) {
	//		if(err) {
	//			data = {
	//				backdata: '写入失败'
	//			}
	//		} else {
	//			data = {
	//				backdata: '写入成功'
	//			}
	//		}
	//		res.status(200);
	//		res.json(data);
	//		res.end();
	//	});

})
app.all('/delete', function(req, res) {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('adddate')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata))
	if(getdata.username && getdata.username != undefined) {
		var addSql = 'DELETE FROM websites where name="' + getdata.username + '"';
		//从数据库读数据
		connection.query(addSql, addSqlParams, function(error, results) {
			if(error) {
				console.log('[INSERT ERROR] - ', error.message);
				return;
			}
			res.status(200);
			console.log('The solution is: ', JSON.stringify(results));
			res.json(results);
			res.end();
		});
	} else {
		res.status(200);
		res.json({
			text: '写入失败'
		});
		res.end();
	}
});
//登录
app.all('/login', function(req, res) {
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
	if(getdata.username != '' && getdata.password != '' && getdata.username != undefined && getdata.password != undefined) {
		console.log(JSON.stringify(getdata));
		var addSql = 'SELECT * from websites WHERE name="' + getdata.username + '" and alexa="' + getdata.password + '"';
		console.log(addSql);
		//从数据库读数据
		connection.query(addSql, function(error, results) {
			if(error) {
				console.log('[INSERT ERROR] - ', error.message);
				return;
			}
			res.status(200);
			console.log(typeof(JSON.stringify(results)))
			console.log('The solution is: ', JSON.stringify(results));
			if(JSON.stringify(results) == '[]') {
				res.json({
					resoponse: '用户名密码错误'
				});
			} else {
				res.json(results);

			}

			res.end();
		});
	} else {
		res.status(200);
		res.json({
			response: '参数缺失，登录失败'
		});
		res.end();
	}
});

//注册
app.all('/regist', function(req, res) {
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	console.log('regist')
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=utf-8',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
		'Access-Control-Allow-Method': 'PUT,POST,GET,DELETE,OPTIONS'
	});
	var getdata = req.body;
	console.log(JSON.stringify(getdata));
	res.status(200);
	if(getdata.username != '' && getdata.password != '' && getdata.username != undefined && getdata.password != undefined) {
		console.log(JSON.stringify(getdata));
		var addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)'; //新增等方法
		var addSqlParams = [getdata.username, 'https://c.runoob.com', getdata.password, 'CN']; //新增的方法
		console.log(addSql);
		//从数据库读数据
		connection.query(addSql, addSqlParams, function(error, results) {
			if(error) {
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
				resoponse: '注册成功'
			});
			res.end();
		});
	} else {
		res.json({
			text: '写入失败'
		});
		res.end();
	}
});
//获取列表数据
app.all('/getlist', function(req, res) {
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
		if(error) {
			console.log('[INSERT ERROR] - ', error.message);
			res.json({
				resoponse: error.message
			});
			res.end();
			return;
		}
		var fresult = results;

		connection.query(searchchildren, function(error, sqlres) {
			if(error) {
				console.log('[INSERT ERROR] - ', error.message);
				res.json({
					resoponse: error.message
				});
				res.end();
				return;
			}
			var children = sqlres;
			console.log('The solution is: ', JSON.stringify(sqlres));

			for(var i = 0; i < fresult.length; i++) {
				if(fresult[i].ishaschildren == '1') {
					var childrenlist = [];
					for(var n = 0; n < children.length; n++) {
						if(fresult[i].uuid == children[n].uuid) {
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
	if(getdata.userguid == '') {
		res.json({
			resoponse: '缺少用户唯一标识',
			satus: '0'
		});
		res.end();
		return;
	}
	if(getdata.jifen == '') {
		res.json({
			resoponse: '缺少积分',
			satus: '0'
		});
		res.end();
		return;
	}
	if(getdata.isadd == '') {
		res.json({
			resoponse: '缺少状态',
			satus: '0'
		});
		res.end();
		return;
	}
	var nowdate = new Date();
	var nowtime = nowdate.getFullYear().toString() + '年' + (nowdate.getMonth() + 1).toString() + '月' + nowdate.getDate().toString() + '日' + ' ' + nowdate.getHours() + ':' + nowdate.getMinutes();
	console.log(nowtime);
	var addSql = 'INSERT INTO integration(num,userguid,jifen,isadd,date) VALUES(0,?,?,?,?)'; //新增等方法
	var addSqlParams = [getdata.userguid, getdata.jifen, getdata.isadd, nowtime]; //新增的方法
	console.log(addSql);
	//从数据库写入数据
	connection.query(addSql, addSqlParams, function(error, results) {
		if(error) {
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
			resoponse: '积分处理成功',
			satus: '1'
		});
		res.end();
	});

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
	if(getdata.userguid == '') {
		res.json({
			resoponse: '缺少用户唯一标识',
			satus: '0'
		});
		res.end();
		return;
	}
	if(getdata.pagesize == '') {
		res.json({
			resoponse: '缺少分页参数',
			satus: '0'
		});
		res.end();
		return;
	}
	if(getdata.pageindex == '') {
		res.json({
			resoponse: '缺少分页参数',
			satus: '0'
		});
		res.end();
		return;
	}
	var searchSql = 'SELECT * from integration where userguid='+getdata.userguid+' limit '+getdata.pageindex+','+getdata.pagesize;
	console.log(searchSql);
	//从数据库读数据
	connection.query(searchSql, function(error, results) {
		if(error) {
			console.log('[INSERT ERROR] - ', error.message);
			res.json({
				resoponse: error.message
			});
			res.end();
			return;
		}
		var fresult = results;
			console.log('The solution is: ', JSON.stringify(fresult));
			res.json({
				resoponse: '请求成功',
				userarea: fresult,
				status:'1'
			});
			res.end();
		

	});

});
//服务监听3000端口，可修改
var server = app.listen(3000, function() {
	console.log(JSON.stringify(server.address()))
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://127.0.0.1", host, port)

});