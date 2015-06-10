/**
 * Includes for this object
 */
var DeltionAPI = require('./DeltionAPI');
var cheerio = require('cheerio');
var fs = require('fs');
var Settings = require('./Settings');

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
     * Get the classes from a department in a json object
     *
     * @param departmentId integer of department to get classes from
     * @param callback returns json with the classes
     */
    get : function(departmentId, callback){
        console.log('Getting Classes.');

        var Classes = this;
        Settings = require('./Settings');

        // Setting the path type to 'none' so we don't get redirected
        Settings.main.pathType = 'none';

        // Set department id if we got one
        if(departmentId !== undefined){
            console.log('setting main department '+parseInt(departmentId));
            Settings.main.department = parseInt(departmentId);
        }

        DeltionAPI.getFromCache('dep-'+departmentId+'-classes/', Classes.options.cache, function(result, file){
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
        Settings = require('./Settings');
        var Classes = this;
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
            DeltionAPI.writeToCache('dep-'+Settings.main.department+'-classes', response, function(){
                callback(response);
            });
        });
    },

    /**
     * Get the latest departments from a json cache file
     *
     * @param file
     * @param callback
     */
    getCache : function(file, callback){
        var Classes = this;

        var split = file.split('-classes.json')[0];
        split = split.split('-dep-')[1];
        var department = split;

        fs.readFile('cache/dep-'+department+'-classes/'+file, 'utf8', function(err, content){
            if(err){
                console.log(err);
                console.log('falling back on live');
                Classes.getLive(function(response){
                    callback(response);
                });
            }else{
                callback(JSON.parse(content));
            }
        });
    }
}