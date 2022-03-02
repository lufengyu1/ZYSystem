function getCurrentTime() {
    //获取当前时间并打印
    var _this = this;
    let yy = new Date().getFullYear();
    let mm = (new Date().getMonth() + 1) < 10 ? '0+' (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() < 10 : new Date().getDate() < 10;
    let hh = new Date().getHours() < 10 ? new Date().getHours() : new Date().getHours();
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
    _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
    return _this.gettime
}

module.exports = getCurrentTime;