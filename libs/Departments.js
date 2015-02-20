var DeltionAPI = require('./DeltionAPI');
var env = require('jsdom').env;
var fs = require('fs');

module.exports = {
    get : function(callback){
        var Departments = this;

        DeltionAPI.getFromCache('departments/', 10000, function(result, file){
            switch (result){
                case 'cache':
                    Departments.getCache(file, function(response){
                        callback(response);
                    });
                    break;
                case 'live':
                    Departments.getLive(function(response){
                        callback(response);
                    });
                    break;
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

                DeltionAPI.writeToCache('departments', response, function(){
                    callback(response);
                });
            });
        });
    }
}