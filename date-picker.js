/**
 * Created by Administrator on 2016/11/8.
 */
+(function(global, factory){
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = factory(jQuery, true);
    }else{
        factory(jQuery, false);
    }
})(jQuery, function($, noGlobal){
    var DatePicker = function(element, options){
        this.$element = $(element);
        this.options = $.extend({}, DatePicker.DEFAULT, options);
    };
    DatePicker.prototype.init = function() {
        var that = this;
        if(that.$element.attr('type') !== 'text'){
            throw new Error('the element witch this date picker bound must be a text input form')
        }
        that.$element.on('focus.date.picker', that.showPanel);
        that.$element.on('blur.date.picker',  that.hidePanel);
    };
    DatePicker.prototype.showPanel = function() {
        console.log('显示日期选择Panel');
    };
    DatePicker.prototype.hidePanel = function() {
        console.log('隐藏日期选择Panel');
    };

    DatePicker.VERSION = '1.0.0';
    DatePicker.DEFAULT = {};

    if(typeof define !== 'undefined' && define.amd){
        define('datePicker',['jquery'],function() {
            return DatePicker;
        })
    }
    if(!noGlobal){
        var Plugin = function(options){
            var $this = $(this);
            if($this.attr('type') !== 'text'){
                throw new Error('DatePicker must bound on a text input from');
            }
            if(typeof options !== 'object'){
                throw new Error('the options must be a object');
            }
            var data = $this.data('date-picker');
            if(!data){
                $this.data('date-picker',data=new DatePicker($this,options));
            }
            data.init();
        };
        $.fn.datePicker = Plugin;
        $.fn.datePicker.constructor = DatePicker;
    }
    return DatePicker;
});