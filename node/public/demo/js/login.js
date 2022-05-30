/**
 * 作者：luanjie
        时间：2021-7
        描述：登录页面
 */

(function() {
	"use strict";
	initLiserners();
	console.log(sha1.hex('123'));
	/**
	 * 监听页面所有点击事件
	 */
	function initLiserners() {
		$(".sendbox").on("click", function() {
			var username=$('#username').val();
			var password=$('#password').val();
			console.log(sha1.hex(password))
			var registdata={
				username:username,
				password:sha1.hex(password)
			}
			console.log(registdata)
			// regist(registdata);
			login(registdata);
		})
		
	}

	//注册接口的调用
	function regist(data) {
		var url = 'http://127.0.0.1:3300/rest/regist';
		//console.log('请求地址' + url);
		$.ajax(url, {
			data:data,
			type:'post',
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			headers:{
				authcode:'123456'
			},
			success: function(response) {
				console.log(JSON.stringify(response));

			},
			error: function(error) {
				console.log("详情error");
				console.log(JSON.stringify(error));
			}
		});
	}
//登录接口的调用
	function login(data) {
		var url = 'http://127.0.0.1:3300/rest/login';
		//console.log('请求地址' + url);
		$.ajax(url, {
			data:data,
			type:'post',
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			headers:{
				authcode:'123456'
			},
			success: function(response) {
				console.log(JSON.stringify(response));

			},
			error: function(error) {
				console.log("详情error");
				console.log(JSON.stringify(error));
			}
		});
	}
})();
