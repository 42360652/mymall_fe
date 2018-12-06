require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');

//表单错误提示
var formError = {
    show : function (errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function () {
        $('.error-item').show().find('.err-msg').text('');
    }
};

var page = {
    data : {
        username : '',
        question : '',
        answer : '',
        token : ''
    },
    init:function () {
        this.onload();
        this.bindEvent();
    },
    onload : function(){
        this.loadStepUsername();
    },
    bindEvent : function () {
        var _this = this;
        //输入用户名点击按钮
        $('#submit-username').click(function () {
            var username = $.trim($('#username').val());
            if (username){
                _user.getQuestion(username,function (res) {
                    _this.data.username = username;
                    _this.data.question = res;
                    _this.loadStepQuestion();
                },function (errMsg) {
                    formError.show(errMsg);
                });
            }
            else {
                formError.show('请输入用户名');
            }
        });
        //输入提示问题答案
        $('#submit-question').click(function () {
            var answer = $.trim($('#answer').val());
            //检查密码提示问题答案
            if (username){
                _user.checkAnswer({
                    username : _this.data.username,
                    question : _this.data.question,
                    answer : answer
                },function (res) {
                    _this.data.answer = answer;
                    _this.data.token = res;
                    _this.loadStepPassword();
                },function (errMsg) {
                    formError.show(errMsg);
                });
            }
            else {
                formError.show('请输入答案');
            }
        });
        //输入新密码后提交
        $('#submit-password').click(function () {
            var password = $.trim($('#password').val());
            if (password && password.length >=6){
                _user.resetPassword({
                    username : _this.data.username,
                    password : password,
                    forgetToken : _this.data.token

                },function () {
                    window.location.href = './result.html';
                },function (errMsg) {
                    formError.show(errMsg);
                });
            }
            else {
                formError.show('请输入大于等于6位新密码');
            }
        })
    },
    //加载输入用户名的一步
    loadStepUsername : function(){
        $('.step-username').show();
    },
    //提示问题
    loadStepQuestion : function () {
        formError.hide();
        $('.step-username').hide().siblings('.step-question').show()
            .find('.question').text(this.data.question);

    },
    //新密码
    loadStepPassword : function () {
        formError.hide();
        $('.step-password').hide().siblings('.step-password').show();
    }
};
$(function () {
    page.init();
});