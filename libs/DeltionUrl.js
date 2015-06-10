/**
 * Created by koen on 13-5-15.
 */

var Settings = require('./Settings');

module.exports = {

    /**
     * Path defaults
     */
    path : {
        default: '/roster/view/',
        showTime: 'showrostertabeltime/on/',
        department: 'rosterid/',
        startDate: 'dtpviewperiodstartdatetime/',
        endDate: 'dtpviewperiodenddatetime/',
        classId: 'studentgroupid/',
        classRoom: 'lessonplaceid/',
        teacher: 'teacherid/'
    },

    /**
     * Get the path for the url
     *
     * @param type
     * @return string path
     */
    getPath : function(){

        Settings = require('./Settings');
        var DeltionUrl = this;

        var type = Settings.main.pathType;
        var path = DeltionUrl.path.default;

        if(Settings.main.showTime)
            path += DeltionUrl.path.showTime;

        path += DeltionUrl.path.department + Settings.main.department + '/';

        if(Settings.main.customDate){
            path += DeltionUrl.path.startDate + Settings.main.startDate + '/';
            path += DeltionUrl.path.endDate + Settings.main.endDate + '/';
        }

        switch(type){
            case 'teacher':
                path += DeltionUrl.path.teacher + Settings.main.teacher + '/';
                break;
            case 'class':
                path +=DeltionUrl.path.classId + Settings.main.classId + '/';
                break;
            case 'classroom':
                path += DeltionUrl.path.classRoom + Settings.main.classRoom + '/';
                break;
            case 'none':
                break;
        }

        return path;
    }
};