'use strict';

var Hogan = require("hogan.js");
var conf = {
    serverHost : ''
};

var _mm = {
   request : function (param) {
       var _this = this;
       $.ajax({
           type : param.method || 'get',
           url : param.url || '',
           dataType : param.type || 'json',
           data : param.data || '',
           success : function (res) {
               //请求成功
               if (0 === res.status) {
                   typeof param.success === 'function' && param.success(res.data, res.msg);
               }
               //未登录
               else if (10 === res.status) {
                    _this.doLogin();
               }
               else if (1 === res.status){
                   typeof param.error === 'function' && param.error(res.msg);
               }
           },
           error : function (err) {
               typeof param.error === 'function' && param.error(err.statusText);
           }

       });
   },
    //获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },

    //获取URL参数
    getUrlParam : function(){
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    //渲染HTML模板
    renderHtml : function(htmlTemplate, data){
        var template = Hogan.compile(htmlTemplate),
            result = template.render(data);
        return result;
    },
    //成功提示
    successTips : function(msg){
       alert(msg || '操作成功');
    },
    //错误提示
    errorTips : function(msg){
      alert(msg || '失败');
    },
    //表单验证,字段的验证，支持是否为空，手机、邮箱
    validate : function(value, type){
        var value = $.trim(value);
        //非空验证
        if ('require' === type){
            return !!value;
        }
        if ('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        //邮箱验证
        if ('email' === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    //登录处理
    doLogin : function () {
        window.location.herf = './user-login.html?redirect=' + encodeURIComponent(window.location.herf);
    },
    //回主页
    goHome : function () {
        window.location.herf = './index.html';
    }
};

module.exports = _mm;