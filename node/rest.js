var express = require('express'); //引入express组件
var app = express(); //创建接口应用或者web服务器
//以下引入为为了能解析json请求参数
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");

const jwt=require('./libs/jwt');
const gettoken=require('./router/gettoken');

// 控制跨域的
const cors=require('cors');
// express路由引入登录模块
let loginRouter=require("./router/login");
//设置cors的参数
const corsConfig={
	origin:'http://localhost:8080',
	credenttials:true
}

gettoken.ajaxToken()
// 使用默认配置
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

//创建静态资源存放目录
app.use('/public', express.static('public'));


app.use((req,res,next)=>{
	var requestdata = req.query;
	
	var requrl=req.url.split('?')[0]
	console.log(JSON.stringify(requrl));
	// 判断需要免登的接口
	if(requrl!='/rest/regist'&&requrl!='/rest/login'&&requrl!='/rest/getUsrInfo'&&requrl!='/rest/getphonenumber'){
		let token=req.headers.Authorization;
		let result=jwt.verifyToken(token);
		if(result.code==1){
			next();
		}else{
			res.send({
				code:403,
				msg:'token失效'
			})
			res.end();
		}
	}else{
		next();
	}
})



app.use('/rest',loginRouter);



//服务监听3000端口，可修改
var server = app.listen(3300, function() {
	console.log(JSON.stringify(server.address()))
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://127.0.0.1", host, port)

});