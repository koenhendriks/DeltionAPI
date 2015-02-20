https = require('https');
var fs = require('fs');

module.exports = {

    settings : {
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
