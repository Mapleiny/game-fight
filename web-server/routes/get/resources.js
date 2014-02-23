
module.exports = function ( req , res ){

	return {
		title : '素材相关',
		user : req.session.user,
	};
};