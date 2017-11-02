var http=require('http');//创建http
var url=require('url');//获取请求url
var util=require('util');
var querystring = require('querystring');

http.createServer(function(request,response){
	
	//console.log('ceshi')
	response.writeHead(200,{'Content-Type':'application/json;charset=UTF-8'});
	
	response.write(util.inspect(url.parse(request.url, true)));
	// 解析 url 参数
    var params = url.parse(request.url, true).query;
    //response.write(params);
    response.write("网站名：" + params.name);
    response.write("\n");
    response.write("网站 URL：" + params.url);
    response.end();
	
}).listen(8888);
console.log('运行成功  Server running at http://127.0.0.1:8888/');