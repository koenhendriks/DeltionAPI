/**
 * Includes for this object
 */
var DeltionAPI = require('./DeltionAPI');
var cheerio = require('cheerio');
var fs = require('fs');

/**
 * Departments gets departments in which time schedules are grouped
 *
 * @type {{options: {name: string, cache: number}, get: Function, getCache: Function, getLive: Function}}
 */
module.exports = {

    /**
     * Options for Departments
     */
    options : {
        name : 'rosterid',
        cache: 24 * (1000 * 60 * 60) // 24 hour cache
    },

    /**
     * Get the departments in a json object
     *
     * @param callback returns json with the departments
     */
    get : function(callback){
        var Departments = this;
        DeltionAPI.getFromCache('departments/', Departments.options.cache, function(result, file){
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

    /**
     * Get the latest departments from a json cache file
     *
     * @param file
     * @param callback
     */
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

    /**
     * Get the departments live by parsing the deltion website
     *
     * @param callback
     */
    getLive : function(callback){
        var Departments = this;
        var html = DeltionAPI.connect(function(html){

            var response = [];
            var $ = cheerio.load(html);

            $('#'+Departments.options.name+' option').each(function()
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

            /**
             * First write response to a json cache then run the callback
             */
            DeltionAPI.writeToCache('departments', response, function(){
                callback(response);
            });
        });
    }
}