require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _product = require('service/product-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');
var _cart = require('service/cart-service.js');


var page = {
    data : {
       productId : _mm.getUrlParam('productId') || '',
    },
    init : function () {
        this.onload();
        this.bindEvent();
    },
    onload : function () {
        //如果没有id跳回首页
        if (!this.data.productId){
            _mm.goHome();
        }
        this.loadDetail();
    },
    bindEvent : function () {
        var _this = this;
        //图片预览
        $(document).on('mouseenter','p-img-item',function () {
            var imageUrl = $(this).find('p-img').attr('src');
            $('.main-img').attr('src',imageUrl);
        });
        //count
        $(document).on('click','p-count-btn',function () {
              var type = $(this).hasClass('plus')?'plus':'minus',
                  $pCount     = $('.p-count'),
                  currCount   = parseInt($pCount.val()),
                  minCount    = 1,
                  maxCount    = _this.data.detailInfo.stock || 1;
                if(type === 'plus'){
                    $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
                }
                else if(type === 'minus'){
                $pCount.val(currCount > minCount ? currCount - 1 : minCount);
                }
        });
        $(document).on('click', '.cart-add', function(){
            _cart.addToCart({
                productId   : _this.data.productId,
                count       : $('.p-count').val()
            }, function(res){
                window.location.href = './result.html?type=cart-add';
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    //加载detail数据
    loadDetail : function () {
        var _this = this,
            html = '',
            $pageWrap = $('.page-wrap');
        //loading
        $pageWrap.html('<div class="loading"></div>');
        //请求detail信息
        _product.getProductDetail(this.data.productId,function (res) {
            _this.filter(res);
            html = _mm.renderHtml(templateIndex,res);
            $pageWrap.html(html);
        },function (errMsg) {
            $pageWrap.html('<p class="err-tip">找不到此商品</p>')
        });
    },
    //数据匹配
    filter : function(data){
        data.subImages = data.subImages.split(',');
    },
    //加载分页信息
    loadPagination : function (pageInfo) {
        var _this = this;
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({},pageInfo,{
            container: $('.pagination'),
            onSelectPage: function (pageNum) {
                _this.data.listParam.pageNum = pageNum;
                _this.loadList();
            }
        }));
    }
};
$(function () {
    page.init();
})