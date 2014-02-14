var loadStaticSource = function(){
};

loadStaticSource.prototype = {
	jsFormat : '<script src="/javascripts/{src}.js" type="text/javascript" charset="utf-8"></script>',
	cssFormat : '<link rel="stylesheet" type="text/css" href="/stylesheets/{src}.css">',
	setFormat : function( type , value ){
		var _this = this;
		if( type == 'js' ){
			_this.jsFormat = value;
		}else{
			_this.cssFormat = value;
		}
		return _this;
	},js : function( params ){
		var _this = this,
			result;
		result = _this.assemble.call(_this, 'js' , params );

		return result.join('\n');
	},css : function( params ){
		var _this = this,
			result;

		result = _this.assemble.call(_this, 'css' , params );

		return result.join('\n');
	},assemble : function( type , params ){
		var _this = this,
			result = [],
			replace = _this.replace,
			format;
		if( type == 'js' ){
			format = _this.jsFormat;
		}else{
			format = _this.cssFormat;
		}

		if( params instanceof Array ){
			for( i = 0 , sum = params.length ; i < sum ; ++i ){
				result.push(replace.call(_this,format,params[i]));
			}
		}else{
			result.push(replace.call(_this,format,params));
		}
		return result;
	},replace : function(format,value){
		var _this = this;
		if(/http/.test(value)){
			return format.replace('{src}',value);
		}else{
			return format.replace('{src}',value);
		}
	}
};

module.exports = new loadStaticSource();