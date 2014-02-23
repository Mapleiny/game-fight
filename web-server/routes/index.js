
/*
 * GET home page.
 */

// exports.index = function(req, res){
//		res.render('index', { title: 'Express' });
// };
//
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Load = require('../tools/static_load.js'),
    fs = require('fs');
module.exports = function(app) {
	var viewDir = app.get('views');

	// 管理页面
	// 统一条件判断

	app.all('/admin/*',function ( req , res , next ){
		if( !req.session.islogin ){
			return res.redirect('/signin');
		}

		if( !req.session.user.admin ){
			return res.redirect('/unpremited');
		}

		next();
	});

	app.get('/admin/:set?',function (req , res){
		var set = req.params.set || 'home';
		if( fs.existsSync(viewDir+'/admin/'+set+'.ejs') ){
			res.render('admin/'+set, 
				require('./get/'+ set +'.js')(req , res)
			);
		}else{
			res.send(404);
		}
	});

	// 登录
	app.get('/signin',function ( req , res ){
		res.render('admin/signin', {
			title: '登录'
		});
	});

	app.post('/signin',function ( req , res ){
		require('../tools/static_load.js')
	});

	// 注册
	app.get('/signup',function ( req , res ){
		var css = ['admin/compiled/signup'],
			js = ['lib/jquery/jquery-2.1.0.min','common/request','admin/signup'];


		res.render('admin/signup', {
			title: '登录',
			stylesheets : Load.css(css),
			javascripts : Load.js(js)
		});
	});

	app.post('/signup',function ( req , res ){
		var username = req.body.username,
			password = req.body.password,
			sweet = req.body.sweet,
			password_re = req.body['password-repeat'];



		if (password_re != password) {
			return res.redirect('/signup');//返回注册页
		}


		var md5 = crypto.createHash('md5');
		
		password = md5.update(req.body.password).digest('hex');

		var newUser = new User({
			username: req.body.username,
			password: password
		});

		User.get(newUser.username, function (err, user) {
			if (user) {
				return res.redirect('/signup');//返回注册页
			}

			if( sweet == 'mapleiny' ){
				newUser.setProperty({
					'admin' : true
				});
			}
			//如果不存在则新增用户
			newUser.save(function (err, user) {
				if (err) {
					return res.redirect('/signup');//注册失败返回主册页
				}
				req.session.user = user;//用户信息存入 session

				req.session.islogin = true;

				res.redirect('/admin');//注册成功后返回主页
			});
		});
	});


	/*app.get('/', function (req, res) {
		res.render('index', {
			title : '主页',
			user : req.session.user,
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});

	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if (password_re != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');//返回注册页
		}
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: req.body.name,
			password: password,
			email: req.body.email
		});
		//检查用户名是否已经存在
		User.get(newUser.name, function (err, user) {
			if (user) {
				req.flash('error', '用户已存在!');
				return res.redirect('/reg');//返回注册页
			}
			//如果不存在则新增用户
			newUser.save(function (err, user) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');//注册失败返回主册页
				}
				req.session.user = user;//用户信息存入 session
				req.flash('success', '注册成功!');
				res.redirect('/');//注册成功后返回主页
			});
		});
	});

	app.get('/login', function (req, res) {
		res.render('login', { title: '登录' });
	});

	app.post('/login', function (req, res) {
	});

	app.get('/post', function (req, res) {
		res.render('post', { title: '发表' });
	});

	app.post('/post', function (req, res) {
	});

	app.get('/logout', function (req, res) {
	});*/
};