var doctorData = require("../data/doctor.json");

var doctorFinder = {
    getDoctorType: function (symptom1, symptom2, symptom3) {
        var priority1 = doctorData.doctors[symptom1.toString().toLowerCase()];
        var priority2;
        var priority3;
        if (symptom2 != null) {
            priority2 = doctorData.doctors[symptom2.toString().toLowerCase()];
        }
        if (symptom3 != null) {
            priority3 = doctorData.doctors[symptom3.toString().toLowerCase()];
        }
        var priority = priority1;
        var docType = symptom1;

        if(priority2 != null && priority2 > priority) {
            priority = priority2;
            docType = symptom2;
        }
        if(priority3 != null && priority3 > priority) {
            priority = priority3;
            docType = symptom3;
        }
        return docType;

    }

}


module.exports = doctorFinder;