var testData = require("../data/testData.json");

var labTests = {
    getTestNames: function() {
        return testData.map((test) => test.name);
    },
    getTest: function(testName) {
        for(i=0; i<testData.length; i++)
            {
                if((testData[i].name).toUpperCase() == testName.toUpperCase())
                    {
                        return testData[i];
                    }
            }
    }
}

module.exports = labTests;