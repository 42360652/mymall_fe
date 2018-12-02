require('./index.css');

var _mm = require('util/mm.js');
//通用页面头部
var header = {
    init : function () {
        this.bindEvent();
    },
    onLoad : function(){
        var keyword = _mm.getUrlParam('keyword');
        if (keyword){
            $('#search-input').val(keyword);
        }
    },
    bindEvent : function () {
        var _this = this;
        //点击搜索按钮，做搜索提交
        $('#search-btn').click(function () {
            _this.searchSubmit();
        })
        //输入回车后搜索会提交
        $('#search-input').keyup(function (e) {
            //13是回车键得keyCode
            if (e.keyCode === 13){
                _this.searchSubmit();
            }
        });
    },
    //搜索提交
    searchSubmit : function () {
        var keyword = $('#search-input').val();
        if (keyword) {
            window.location.href = './list.html?keyword=' + keyword;
        } else
            _mm.goHome();
    }

}

header.init();