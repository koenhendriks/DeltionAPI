/**
 * Includes for this object
 */
var DeltionAPI = require('./DeltionAPI');
var cheerio = require('cheerio');
var fs = require('fs');

/**
 * Classes gets classes from specific Departments
 */
module.exports = {

    /**
     * Options for Classes
     */
    options : {
        name : 'studentgroupid',
        cache: 24 * (1000 * 60 * 60) // 24 hour cache
    },

    /**
     * Get the classes in a json object
     *
     * @param callback returns json with the classes
     */
    get : function(callback){
        var Classes = this;
        DeltionAPI.getFromCache('classes/', Classes.options.cache, function(result, file){
            switch (result){
                case 'cache':
                    Classes.getCache(file, function(response){
                        callback(response);
                    });
                    break;
                case 'live':
                    Classes.getLive(function(response){
                        callback(response);
                    });
                    break;
            }
        });
    },

    /**
     * Get the classes live by parsing the deltion website
     *
     * @param callback
     */
    getLive : function(callback){
        var Classes = this;

        DeltionAPI.httpsOptions.path += 'dtpshowviewperiodstartdatetime/maa+06+apr+2015/dtpviewperiodstartdatetime/2015-04-06/dtpshowviewperiodenddatetime/vry+10+apr+2015/dtpviewperiodenddatetime/2015-4-10/';

        var html = DeltionAPI.connect(function(html){

            var response = [];
            var $ = cheerio.load(html);

            $('#'+Classes.options.name+' option').each(function()
            {
                var className = $(this).text();
                var classId = $(this).val();

                if(className !== undefined &&  classId !== undefined && classId != "" && className != ""){

                    var Class = {
                        name    : className,
                        id      : classId
                    };

                    response.push(Class)
                }
            });

            /**
             * First write response to a json cache then run the callback
             */
            DeltionAPI.writeToCache('classes', response, function(){
                callback(response);
            });
        });
    }



}