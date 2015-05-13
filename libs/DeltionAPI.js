/**
* @type {exports}
*/
var https = require('https');
var fs = require('fs');
var DeltionUrl = require('./DeltionUrl');

/**
 * DeltionAPI main object for connecting to deltion time schedule website
 *
 * @type {{settings: {teachersName: string, classRoomsName: string, pathType: string, customDate: boolean, showTime: boolean, department: number, startDate: string, endDate: string, classId: number, classRoom: number, teacher: number, path: {default: string, showTime: string, department: string, startDate: string, endDate: string, classId: string, classRoom: string, teacher: string}}, httpsOptions: {host: string, port: number, path: path}, getPath: Function, connect: Function, getFromCache: Function, writeToCache: Function}}
 */
module.exports = {

    /**
     * Main API Settings
     */
    settings : {
        pathType        : 'class',      // 'class', 'teacher' or 'classroom'
        customDate      :  true,        // use own dates in request?
        showTime        :  true,        // also ask for times in url ?
        department      :  52,          // department id to use to fetch classes, teachers, or classrooms
        startDate       : '2015-05-11', // Start date in format YYYY-MM-DD
        endDate         : '2015-05-15', // End date in format YYYY-MM-DD
        classId         : 1093,         // Id of the class
        classRoom       : 4034,         // Id of the classroom
        teacher         : 6706          // Id of the teacher
    },

    /**
     * Options for connecting over https
     */
    httpsOptions : {
        host: 'roosters.deltion.nl',
        port: 443,
        path: DeltionUrl.getPath()
        //https://roosters.deltion.nl/roster/view/rosterid/52/dtpviewperiodstartdatetime/2015-05-11/dtpviewperiodenddatetime/2015-05-15/studentgroupid/1093
    },

    /**
     * Connecting with the deltion time schedule website over https
     *
     * @param callback with html from the website
     */
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
                var htmlResponse = body.toString();
                callback(htmlResponse);
            });
        });
    },

    /**
     * Get the latest json cache file
     *
     * @param directory
     * @param cacheTime
     * @param callback
     */
    getFromCache : function(directory, cacheTime, callback){
        var d = new Date();
        fs.readdir('cache/'+directory, function(err, files) {
            if(files.length > 0) {
                var latest = files[files.length - 1];
                var split = latest.split('-');
                var difference = (d.getTime() - split[0]);
                if (difference < cacheTime) {
                    console.log('cache is not old, getting cache');
                    callback('cache', latest);
                }else{
                    console.log('cache is old, getting live');
                    callback('live');
                }
            }else{
                console.log('no cache, getting live');
                callback('live');
            }
        });
    },

    /**
     * Write a new json cache file
     *
     * @param filename
     * @param json
     * @param callback
     */
    writeToCache : function(filename, json, callback){
        var d = new Date();
        fs.writeFile('cache/'+filename+'/'+ d.getTime() +'-'+ filename+'.json', JSON.stringify(json,null,4), function(err) {
            if(err) {
                callback(err);
            } else {
                callback('success');
            }
        });
    },

    test : function(){
        console.log('test');
    }
};
