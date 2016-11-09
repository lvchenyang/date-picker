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

    var Calendar = function(date) {
        if(!(date instanceof Date)){
            if(typeof date === 'string'){
                return new Calendar(new Date(date));
            }else if(typeof date === 'undefined'){
                return new Calendar(new Date());
            }
        }
        this.date = {
            year: date.getFullYear(),
            month: date.getMonth()
        }
    };

    // 获取月份表格
    Calendar.prototype.getMonthTable = function() {
        var date = new Date(this.date.year,this.date.month);
        var monthLength = this.getMonthLength();
        var monthTable = [];
        var firstDateOfWeek = date.getDay();
        for(var i = firstDateOfWeek ; i > 0; i--){
            monthTable.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() - i));
        }
        for(var j = 1; j <= monthLength; j++){
            date.setDate(j);
            monthTable.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        }
        var lastDateOfWeek = date.getDay();
        for(var k = (lastDateOfWeek+1); k > 0, k < 7; k++){
            monthTable.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() + k - lastDateOfWeek));
        }
        return monthTable;
    };

    // 获取月份天数
    Calendar.prototype.getMonthLength = function() {
        var date = new Date(this.date.year,this.date.month);
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        return date.getDate();
    };

    // 获取上一个月的日历对象
    Calendar.prototype.previousCalendar = function() {
        return new Calendar(new Date(this.date.year, this.date.month - 1));
    };

    // 获取下一个月的日历对象
    Calendar.prototype.nextCalendar = function() {
        return new Calendar(new Date(this.date.year, this.date.month + 1));
    };
    Calendar.prototype.getYear = function() {
        return this.date.year;
    };
    Calendar.prototype.getMonth = function () {
        return this.date.month;
    };
    Calendar.prototype.getMonthText = function(){
        return Calendar.month_text[this.getMonth()];
    };
    Calendar.month_text = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    Calendar.week_text = ['日', '一', '二', '三', '四', '五', '六'];

    // 输出日历字符串
    Calendar.prototype.toString = function() {
        var weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var monthTable = this.getMonthTable();
        var len = monthTable.length;
        var dates = [];
        for(var i = 0; i < len; i += 7){
            var index = Math.floor(i/7);
            dates[index] = [];
            dates[index].push(monthTable[i].getDate());
            dates[index].push(monthTable[i+1].getDate());
            dates[index].push(monthTable[i+2].getDate());
            dates[index].push(monthTable[i+3].getDate());
            dates[index].push(monthTable[i+4].getDate());
            dates[index].push(monthTable[i+5].getDate());
            dates[index].push(monthTable[i+6].getDate());
        }
        var string = weeks.join('\t')+'\n';
        len = dates.length;
        for(var i = 0; i < len; i++){
            dates[i] = dates[i].join('\t');
        }
        string += dates.join('\n');
        return string;
    };


    // 时间选择器对象
    var DatePicker = function(element, options){
        this.$element = $(element);
        this.options = $.extend({}, DatePicker.DEFAULT, options);
        this.$dom = $(DatePicker.template);
        this.calendar = new Calendar();
    };
    DatePicker.prototype.init = function() {
        var that = this;
        if(that.$element.attr('type') !== 'text'){
            throw new Error('the element witch this date picker bound must be a text input form')
        }
        that.fillDom();
        that._attachEvt();
        $('body').append(that.$dom);
    };
    DatePicker.prototype.showPanel = function() {
        console.log('显示日期选择Panel');
    };
    DatePicker.prototype.hidePanel = function() {
        console.log('隐藏日期选择Panel');
    };

    DatePicker.prototype.fillDom = function() {
        var that = this;
        var $dom = this.$dom;
        var calendar = this.calendar;
        var curMonth = calendar.getMonth();
        var dates = calendar.getMonthTable();
        var $year = $dom.find('.year');
        var $month = $dom.find('.month');
        var $dateCells = $dom.find('.date-cells');
        var $weeks = $dom.find('.weeks');
        $year.html(calendar.getYear());
        $month.html(calendar.getMonthText());
        $dateCells.html('');
        for(var i = 0; i < dates.length; i+=7){
            var rowHtml = '<tr>';
            for(var j = 0; j < 7; j++){
                rowHtml += that.getCellDom(curMonth, dates[i+j]);
            }
            rowHtml += '</tr>';
            $dateCells.append(rowHtml);
        }
        $weeks.html('<th>'+Calendar.week_text.join('</th><th>')+'</th>');
    };
    DatePicker.prototype.getCellDom = function(curMonth, date){
        var cell = '';
        if(date.getMonth() != curMonth){
            cell += '<td class="disabled">'+date.getDate()+'</td>'
        }else{
            cell += '<td>'+date.getDate()+'</td>'
        }
        return cell;
    };
    DatePicker.prototype.getMonth = function(){
        return this.calendar.data.month +1;
    };
    DatePicker.prototype.getYear = function() {
        return this.date.year;
    };
    DatePicker.prototype._attachEvt = function() {
        var that = this;
        that.$element.on('focus.date.picker', that.showPanel);
        that.$element.on('blur.date.picker',  that.hidePanel);
        that.$dom.on('click','.prev', function(){
            that.calendar = that.calendar.previousCalendar();
            that.fillDom();
        });
        that.$dom.on('click','.next',function(){
            that.calendar = that.calendar.nextCalendar();
            that.fillDom();
        });
        that.$dom.on('click','td:not(.disabled)',function() {
            var day = $(this).html();
            that.$element.val(that.calendar.getYear() +'-'+ that.calendar.getMonth() +'-'+ day);
        });
        that.$dom.on('click','.year',function() {

        });
    };
    DatePicker.headTemplate = '<thead>'
                            + '<tr>'
                            + ' <th class="prev"><i>&lt;</i></th>'
                            + ' <th class="year" colspan="2"></th>'
                            + ' <th class="month" colspan="3"></th>'
                            + ' <th class="next"><i>&gt;</i></th>'
                            + '</tr>'
                            + '<tr class="weeks"></tr>'
                            + '</thead>';
    DatePicker.contTemplate = '<tbody class="date-cells">'
                            + '<tr>'
                            + ' <td colspan="7"></td>'
                            + '</tr>'
                            + '</tbody>';
    DatePicker.footTemplate = '<tfoot>'
                            + '<tr>'
                            + ' <td colspan="7"></td>'
                            + '</tr>'
                            + '</tfoot>';
    DatePicker.template = '<table class="date-picker-table">'
                        +   DatePicker.headTemplate
                        +   DatePicker.contTemplate
                        +   DatePicker.footTemplate
                        + '</table>';

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