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
    init:function () {
        this.bindEvent();
    },
    bindEvent : function () {
        var _this = this;
        //验证username
        $('#username').blur(function () {
            var username = $.trim($(this.val()));
            //异步验证用户名是否存在，用接口
            _user.checkUsername(username,function (res) {
                formError.hide();
            }), function (errMsg) {
                formError.show(errMsg);
            }
        })
        //点击注册按钮
        $('#submit').click(function () {
            _this.submit();
        });
        $('.user-content').keyup(function (e) {
            if (e.keyCode === 13){
                _this.submit();
            }
        });
    },
    submit : function () {
        var formData = {
                username        : $.trim($('#username').val()),
                password        : $.trim($('#password').val()),
                passwordConfirm : $.trim($('#password-confirm').val()),
                phone           : $.trim($('#phone').val()),
                email           : $.trim($('#email').val()),
                question        : $.trim($('#question').val()),
                answer          : $.trim($('#answer').val())

            },
            //表单验证结果
            validateResult = this.formValidate(formData);
        //成功
        if (validateResult.status) {
            //提交
            _user.login(formData, function (res) {
                window.location.href = _mm.getUrlParam('redirect') || './index.html';
            }, function (errMsg) {
                formError.show(errMsg);
            });
        }
        //失败
        else{
            //错误提示
            formError.show(validateResult.msg);
        }
    },
    formValidate : function (formData) {
        var result = {
            status : false,
            msg : ''
        };
        if (!_mm.validate(formData.username, 'require')){
            result.msg = '用户名不为空';
            return result;
        }
        if (!_mm.validate(formData.password,'require')) {
            result.msg = '密码不为空';
            return result;
        }
        if (formData.password.length < 6) {
            result.msg = '密码不能少于6位';
            return result;
        }
        if (formData.password !== formData.passwordConfirm){
            result.msg = "两次输入密码不一致";
            return result;
        }
        if (!_mm.validate(formData.phone, 'phone')){
            result.msg = "手机号格式不正确";
            return result;
        }
        if (!_mm.validate(formData.email,'email')){
            result.msg = "邮箱格式不正确";
            return result;
        }
        if (!_mm.validate(formData.question,'require')){
            result.msg="提示问题不能为空";
            return result;
        }
        if (!_mm.validate(formData.answer, 'require')){
            result.msg="答案不能为空";
            return result;
        }
        //通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过'
        return result;

    }

};
$(function () {
    page.init();
});