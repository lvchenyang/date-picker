/**
 * Created by Administrator on 2016/11/8.
 */

+(function(global, factory){
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = factory(global, false);
    }else{
        factory(global);
    }
})(window, function(window, noGlobal) {

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

    if(typeof define === 'function' && define.amd){
        define('calendar',[],function() {
            return Calendar;
        })
    }

    if(!noGlobal){
        window.Calendar = Calendar;
    }

    return Calendar;

});