const jwt=require('jsonwebtoken');
let key='daiktest';
let expir= 3600*2;//2小时过期

// 生成token，入参为用户名
const generateToken=function(username){
	let token =jwt.sign({username},key,{expiresIn:expir});
	return token;
}

const verifyToken= token=>{
	try{
		let tokeKey=jwt.verify(token,key);
			return{
				code:1,
				msg:"校验成功",
				tokenkey
			}
	}catch{
		return{
			code:0,
			msg:"校验失败"
		}
	}
}

module.exports={
	generateToken,
	verifyToken
	
}