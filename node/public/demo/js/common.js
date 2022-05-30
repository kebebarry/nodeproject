(function(){
	window.language =function(languagedata,success,error) {
		var url = "static/system/js/common/language.json";
		mui.ajax(url, {
			headers: {
				'Content-Type': 'application/json'
			},
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "get",
			success: function(response) {
				//console.log(JSON.stringify(response));
				
				var languagelist = response.language;
				var lanksh;
				if(languagedata == "cn") {
					lanksh = languagelist.cn;
	
				} else if(languagedata == "en") {
					lanksh = languagelist.en;
				}
				success(lanksh);
			},
			error: function(error) {
				error(error);
				console.log("详情error");
				console.log(JSON.stringify(error));
			}
		});
	}
})()