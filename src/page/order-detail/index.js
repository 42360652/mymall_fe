require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var navSide = require('page/common/nav-side/index.js');
var templateIndex = require('./index.string');

//page逻辑部分
var page = {
    data: {
        orderNo: _mm.getUrlParam('orderNo')
    },
    init: function() {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function() {
        //初始化左侧菜单
        navSide.init({
            name: 'order-list'
        });
        this.loadOrderDetail();
    },
    bindEvent: function() {
        var _this = this;
        $(document).on('click', '.order-cancel', function() {
            if (window.confirm('确认要取消该订单吗？')) {
                _order.cancelOrder(_this.data.orderNo, function(res) {
                    _mm.successTips('该订单取消成功');
                    _this.loadOrderDetail();
                }, function(errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    //加载订单详情
    loadOrderDetail: function() {
        var _this = this,
            orderListHtml = '',
            $content = $('.content');
        $content.html('<div class="loading"></div>');
        _order.getOrderDetail(this.data.orderNo, function(res) {
            _this.dataFilter(res);
            // 渲染html
            var orderDetailHtml = _mm.renderHtml(templateIndex, res);
            $content.html(orderDetailHtml);
        }, function(errMsg) {
            $content.html('<p class="err-tip">' + errMsg + '</p>');
        });
    },
    // 数据的适配
    dataFilter: function(data) {
        data.needPay = data.status == 10;
        data.isCancelable = data.status == 10;
    }
};
$(function() {
    page.init();
});