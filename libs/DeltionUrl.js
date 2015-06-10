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
        department: 'rosterid/' + Settings.main.department + '/',
        startDate: 'dtpviewperiodstartdatetime/' + Settings.main.startDate + '/',
        endDate: 'dtpviewperiodenddatetime/' + Settings.main.endDate + '/',
        classId: 'studentgroupid/' + Settings.main.classId + '/',
        classRoom: 'lessonplaceid/' + Settings.main.classRoom + '/',
        teacher: 'teacherid/' + Settings.main.teacher + '/'
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

        console.log('getting path with: '+DeltionUrl.path.department);
        path += DeltionUrl.path.department;

        if(Settings.main.customDate){
            path += DeltionUrl.path.startDate;
            path += DeltionUrl.path.endDate;
        }

        switch(type){
            case 'teacher':
                path += DeltionUrl.path.teacher;
                break;
            case 'class':
                path +=DeltionUrl.path.classId;
                break;
            case 'classroom':
                path += DeltionUrl.path.classRoom;
                break;
        }

        return path;
    }
};