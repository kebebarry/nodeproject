var http = require('http'); //创建http
var url = require('url'); //获取请求url
var util = require('util');
var fs = require('fs');
var querystring = require('querystring');

http.createServer(function(request, response) {
	// 定义了一个post变量，用于暂存请求体的信息
	var post = '';
	// 通过request的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
	request.on('data', function(chunk) {
		post += chunk;
	});
	// 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
	request.on('end', function() {
		post = querystring.parse(post);
		fs.writeFile(post.name+'.txt', post.value, function(err) {
			if(err) {
				return console.error(err);
			}
			console.log("数据写入成功！");
			console.log("--------我是分割线-------------")
			console.log("读取写入的数据！");
			// 设置响应头部信息及编码
		response.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
		response.end('提交成功');
		});
		
	});
}).listen(3000);
console.log('运行成功  Server running at http://127.0.0.1:3000/');