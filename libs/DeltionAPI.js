/**
* @type {exports}
*/
var https = require('https');
var fs = require('fs');

/**
 * DeltionAPI main object for connecting to deltion time schedule website
 *
 * @type {{settings: {teachersName: string, classRoomsName: string, studentsName: string, showTime: string, startDate: string, endDate: string}, httpsOptions: {host: string, port: number, path: string}, connect: Function, getFromCache: Function, writeToCache: Function}}
 */
module.exports = {

    /**
     * Main API Settings
     */
    settings : {
        teachersName    : 'teacherid',
        classRoomsName  : 'lessonplaceid',
        studentsName    : 'studentgroupid',
        showTime        : 'showrostertabletimes',
        startDate       : 'dtpviewperiodstartdatetime',
        endDate         : 'dtpviewperiodenddatetime',
    },

    /**
     * Options for connecting over https
     */
    httpsOptions : {
        host: 'roosters.deltion.nl',
        port: 443,
        path: '/roster/view/showrostertabeltime/on/rosterid/52/'
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
    }
};
