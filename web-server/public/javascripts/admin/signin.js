$(function(){
    var $loginForm = $('#login-form');

    $loginForm.on('submit',function(){
        new Request({
            data : $loginForm,
            dataType : 'json',
            error : function(json){
                console.log(json);
            },success : function(json){
                if( json.status == 'ok' ){
                	location.href = '/admin';
                }
            }
        });
        return false;
    })
});