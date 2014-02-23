// sign in control
var crypto = require('crypto'),
	User = require('../../models/user.js');


module.exports = function ( req , res ){
	var username = req.body.username,
		password = req.body.password;

	var md5 = crypto.createHash('md5');
	
	password = md5.update(req.body.password).digest('hex');

	User.validate( username , password , function ( err , user ){
		if( err ){
			return res.send(err);
		}else{
			if( user ){
				req.session.user = user;//用户信息存入 session
				req.session.islogin = true;
				return res.json(200,{
					status : 'ok'
				});
			}else{
				return res.json(200,{
					status : 'fail',
					message:'账号或密码错误！'
				});
			}
		}
	});
};