https = require('https');
var env = require('jsdom').env;
var fs = require('fs');

module.exports = {

    settings : {
        departmentsName : 'rosterid',
        teachersName    : 'teacherid',
        classRoomsName  : 'lessonplaceid',
        studentsName    : 'studentgroupid',
        showTime        : 'showrostertabletimes',
        startDate       : 'dtpviewperiodstartdatetime',
        endDate         : 'dtpviewperiodenddatetime'
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

    getDepartments : function(callback){
        DeltionAPI = this;
        var html = this.connect(function(html){

            var response = [];

            // first argument can be html string, filename, or url
            env(html, function (errors, window) {
                var $ = require('jquery')(window);

                $('#'+DeltionAPI.settings.departmentsName+' option').each(function()
                {
                    var departmentName = $(this).text();
                    var departmentId = $(this).val();

                    if(departmentName !== undefined &&  departmentId !== undefined && departmentId != "" && departmentName != ""){

                        var department = {
                            name    : departmentName,
                            id      : departmentId
                        };

                        response.push(department)
                    }
                });
                DeltionAPI.writeToFile('departments', response, function(){
                    callback(response);
                });
            });
        });
    },

    writeToFile : function(filename, json, callback){
        fs.writeFile('cache/'+filename+'.json', json, function(err) {
            if(err) {
                callback(err);
            } else {
                callback('success');
            }
        });
    }
};
