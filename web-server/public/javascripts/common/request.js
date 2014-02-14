(function( win , $ ){
    'use strict';
    var request = function( option ){
        if( ! ( 'FormData' in window ) || ! ( 'JSON' in window ) || !('File' in window) ){
            return ;
        }
        $.extend(this,{
            url : '',
            data : null,
            type : 'get',
            dataType : '',
            async : true,
            user : '',
            password : '',
            timeout : 5000,
            start : function(){console.log('loadstart')},
            uploadProgress : function(){console.log('progress')},
            DownloadProgress : function(){console.log('progress')},
            abort : function(){},
            error : function(){console.log('error')},
            success : function(){console.log('load')},
            ontimeout : function(){console.log('timeout')},
            complete : function(){console.log('loadend')}
        },option);
        this._xhr = new XMLHttpRequest();
        this._file = null;
        this.init();
    };

    request.prototype = {
        init : function(){
            var request = this,
                _xhr = request._xhr;
            request.eventHandle();
            if( request.beforeSend() ){
                _xhr.send(request.data);
            }
        },formatData : function( data ){
            var request = this,
                _xhr = request._xhr;
            if( !data ){
                return '';
            }
            switch( request.dataType ){
                case 'json' :
                    return JSON.parse(data);
                    break;
                default:
                    return data;
            }
        },beforeSend : function(){
            var request = this,
                _xhr = request._xhr;
            if( ( request.data instanceof $ ) && request.data[0].nodeName == 'FORM' ){
                if( request.url == '' ){
                    request.url = request.data[0].action;
                }
                request.type = request.data.attr('method');
                request.data = new FormData(request.data[0]);
            }else if ( typeof request.data === 'object' ){
                request.data = $.param(request.data);
            }

            if( request.url == '' ){
                return false;
            }else{
                _xhr.open(request.type,request.url,true);
                request.setResponseType( request.dataType , _xhr );
                return true;
            }
        },eventHandle : function(){
            var request = this,
                _xhr = request._xhr;

            _xhr.onloadstart = function(event){
                request.start.call(request,event);
            };

            // 文件上传
            _xhr.upload.onprogress = function(event){
                request.uploadProgress(event.loaded,event.total);
            };

            // 文件下载
            _xhr.onprogress = function(event){
                request.DownloadProgress(event.loaded,event.total);
            };


            _xhr.onabort = function(event){
                request.abort(event);
            };

            _xhr.ontimeout = request.ontimeout;

            _xhr.onreadystatechange = function(event){
                request.readystatechange(event);
            };
 
            return this;
        },setResponseType : function( dataType , _xhr ){
            switch( dataType ){
                case 'xml' :
                case 'json' :
                case 'script' :
                case 'html' :
                    _xhr.responseType = 'text';
                    break;
            }
        },readystatechange : function(event){
            var request = this;
            if( event.target.readyState == 4 ){
                if( event.target.status == 200 ){
                    request.success(request.formatData(event.target.responseText));
                    request.complete(event);
                }else{
                    request.error.call(request,event.target.responseText);
                }
            }
        }
    };
    win.Request = request;
})( window , jQuery );