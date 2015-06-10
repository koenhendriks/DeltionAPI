
module.exports = {

    /**
     * Main API Settings
     */
    main: {
        pathType: 'class',          // 'class', 'teacher' or 'classroom'
        customDate: true,           // use own dates in request?
        showTime: true,             // also ask for times in url ?
        department: 52,             // department id to use to fetch classes, teachers, or classrooms
        startDate: '2015-05-11',    // Start date in format YYYY-MM-DD
        endDate: '2015-05-15',      // End date in format YYYY-MM-DD
        classId: 1093,              // Id of the class
        classRoom: 4034,            // Id of the classroom
        teacher: 6706               // Id of the teacher
    },

    /**
     * Options for connecting over https
     */
    httpsSettings : {
        host: 'roosters.deltion.nl',
        port: 443,
        path: ''
        //https://roosters.deltion.nl/roster/view/rosterid/52/dtpviewperiodstartdatetime/2015-05-11/dtpviewperiodenddatetime/2015-05-15/studentgroupid/1093
    }
}