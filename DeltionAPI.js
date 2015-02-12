https = require('https');

module.exports = {

    settings : {
        'departmentsName' : 'rosterid',
        'teachersName'    : 'teacherid',
        'classRoomsName'  : 'lessonplaceid',
        'studentsName'    : 'studentgroupid',
        'showTime'        : 'showrostertabletimes',
        'startDate'       : 'dtpviewperiodstartdatetime',
        'endDate'         : 'dtpviewperiodenddatetime'
    },

    httpsOptions : {
        host: 'roosters.deltion.nl',
        port: 443,
        path: '/roster/view/rosterid/52/'
    },

    connect : function(callback) {
        https.get(this.httpsOptions, function (res) {
            console.log("Got response deltion: " + res.statusCode);

            var body;

            res.setEncoding('utf8');

            res.on('readable', function () {
                var chunk = this.read() || '';
                body += chunk;
            });

            res.on('end', function () {
                htmlResponse = body.toString();
                callback(htmlResponse);
            });
        });
    },

    getDepartments : function(){
        var html = this.connect(function(html){
            return html;
        });


        //var env = require('jsdom').env;
        //
        //// first argument can be html string, filename, or url
        //env(html, function (errors, window) {
        //    var $ = require('jquery')(window);
        //
        //    $('#'+departmentsName+' option').each(function()
        //    {
        //        var department = $(this).text();
        //        var departmentId = $(this).val();
        //
        //        if(typeof department !== "undefined" && typeof departmentId !== "undefined" && department != ""){
        //            departments[department] = departmentId;
        //        }
        //
        //    });
        //
        //    return departments;
        //});
    }
};
