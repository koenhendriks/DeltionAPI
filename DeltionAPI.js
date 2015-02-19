https = require('https');
var env = require('jsdom').env;
var fs = require('fs');

module.exports = {

    settings : {
        departmentsName : 'rosterid',
        departmentsCache: 24 * (1000 * 60 * 60), // 24 hour cache
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
        var d = new Date();

        fs.readdir('cache/departments', function(err, files) {
            if(files.length > 0) {
                var latest = files[files.length - 1];
                var split = latest.split('-');
                var difference = (d.getTime() - split[0]);
                if (difference < DeltionAPI.settings.departmentsCache) {
                    console.log('cache is not old, getting cache');
                    DeltionAPI.getDepartmentsCache(latest, function(response){
                        callback(response);
                    });
                }else{
                    console.log('cache is old, getting live');
                    DeltionAPI.getDepartmentsLive(function(response){
                        callback(response);
                    });
                }
            }else{
                console.log('no cache, getting live');
                DeltionAPI.getDepartmentsLive(function(response){
                    callback(response);
                });
            }
        });
    },

    getDepartmentsCache : function(file, callback){
        DeltionAPI = this;
        fs.readFile('cache/departments/'+file, 'utf8', function(err, content){
            if(err){
                console.log(err);
                console.log('falling back on live');
                DeltionAPI.getDepartmentsLive(function(response){
                    callback(response);
                });
            }else{
                callback(JSON.parse(content));
            }
        });
    },

    getDepartmentsLive : function(callback){
        var html = DeltionAPI.connect(function(html){

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
        var d = new Date();
        fs.writeFile('cache/'+filename+'/'+ d.getTime() +'-'+ filename+'.json', JSON.stringify(json), function(err) {
            if(err) {
                callback(err);
            } else {
                callback('success');
            }
        });
    }
};
