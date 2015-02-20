var DeltionAPI = require('./DeltionAPI');
var fs = require('fs');

module.exports = {
    get : function(callback){
        var d = new Date();
        var Departments = this;
        fs.readdir('cache/departments', function(err, files) {
            if(files.length > 0) {
                var latest = files[files.length - 1];
                var split = latest.split('-');
                var difference = (d.getTime() - split[0]);
                if (difference < DeltionAPI.settings.departmentsCache) {
                    console.log('cache is not old, getting cache');
                    Departments.getCache(latest, function(response){
                        callback(response);
                    });
                }else{
                    console.log('cache is old, getting live');
                    Departments.getLive(function(response){
                        callback(response);
                    });
                }
            }else{
                console.log('no cache, getting live');
                Departments.getLive(function(response){
                    callback(response);
                });
            }
        });
    },

    getCache : function(file, callback){
        var Departments = this;
        fs.readFile('cache/departments/'+file, 'utf8', function(err, content){
            if(err){
                console.log(err);
                console.log('falling back on live');
                Departments.getLive(function(response){
                    callback(response);
                });
            }else{
                callback(JSON.parse(content));
            }
        });
    },

    getLive : function(callback){
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
    }
}