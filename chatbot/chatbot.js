
var watson = require('watson-developer-cloud');
var xmlParser = require('xml2js');
var fs = require('fs');
var labTests = require('../labtests/lab-test.js');
var watsonCredentials = require('../config/watson-credentials.json');
var googleMap = require('../google-maps/map.js');
var doctorFinder = require('../doctors/doctor-finder.js');
var emailSender = require('../email/email-sender.js');

var conversation;
var workspaceId1;
var workspaceId2;
var consersationId = "";
var context;

var bot = {
    loadConfig: function () {
        conversation = watson.conversation({
            username: watsonCredentials.username,
            password: watsonCredentials.password,
            version: 'v1',
            version_date: '2017-05-26'
        });
        workspaceId1 = watsonCredentials.workspaceId1;
        workspaceId2 = watsonCredentials.workspaceId2;
    },

    sendMessage: function (req, res) {
        conversation.message({
            workspace_id: req.query.type == 'bookTest' ? workspaceId1 : workspaceId2,
            input: { 'text': req.query.userInput },
            context: req.query.reqContext == null ? context : req.query.reqContext
        }, function (err, response) {
            if (response != null) {
                var outputResponse = {};
                outputResponse.text = response.output.text;
                if (response.output.deleteContext) {
                    delete outputResponse.context;
                }
                else {
                    outputResponse.context = response.context;
                }

                outputResponse.email = req.session.email;
                outputResponse.name = req.session.name;

                if (req.query.type == 'bookTest') {

                    if (response.output.action != null) {
                        outputResponse.data = populateOutputData(req, response);
                        outputResponse.dataType = response.output.action;
                    }
                    res.status(200).json(outputResponse);
                }
                else {
                    // if (response.output != null && response.output.action != null) {
                    //response.output.action = 'getDoctors';
                    outputResponse.dataType = response.output.action;

                    if (response.output.action == 'getDoctors') {
                        outputResponse.data = {};
                        googleMap.getGeoCode(response.context.address, function (geoCodeResponse) {
                            if (geoCodeResponse != null) {
                                outputResponse.data.inputLocation = geoCodeResponse;
                                var docType = doctorFinder.getDoctorType(response.context.symptoms1, response.context.symptoms2, response.context.symptoms3);
                                googleMap.textSearch(geoCodeResponse.geometry.location.lat, geoCodeResponse.geometry.location.lng,
                                    'doctor', docType, function (markerResponse) {
                                        outputResponse.data.markers = markerResponse;
                                        res.status(200).json(outputResponse);
                                    });
                            }
                            else {
                                googleMap.getGeoCode('gurgaon', function (geoCodeResponse) {
                                    if (geoCodeResponse != null) {
                                        outputResponse.data.inputLocation = geoCodeResponse;
                                        var docType = doctorFinder.getDoctorType(response.context.symptoms1, response.context.symptoms2, response.context.symptoms3);
                                        googleMap.textSearch(geoCodeResponse.geometry.location.lat, geoCodeResponse.geometry.location.lng,
                                            'doctor', docType, function (markerResponse) {
                                                outputResponse.data.markers = markerResponse;
                                                res.status(200).json(outputResponse);
                                            });
                                    }

                                });
                            }

                        });
                    }
                    else {
                        outputResponse.data = populateOutputData(req, response);
                        outputResponse.dataType = response.output.action
                        res.status(200).json(outputResponse);
                    }

                }

                // res.send(outputResponse);
            }
            else {
                console.log(err);
                res.status(500).json(err);
                // res.send("We are unable to process the request at this time. Sorry for the inconvenience.")
            }
        });
    }
}

function populateOutputData(req, response) {
    var data;
    switch (response.output.action) {
        case 'getTestList':
            data = labTests.getTestNames();
            break;
        case 'getProcedure':
            data = labTests.getTest(response.context.testType);
            break;
        case 'getCost':
            data = labTests.getTest(response.context.testType);
            break;
        case 'getProcedureAndCost':
            data = labTests.getTest(response.context.testType);
            break;
        case  'sendEmail':
            if  (req.query.type  ==  'bookTest') {
                emailSender.sendEmailForTestBooking(req.session.name,  req.session.email,  response.context.testType,  response.context.FormattedDate,  response.context.FormattedTime);
            }  else  {
                emailSender.sendEmailForFindDoctor(req.session.name,  req.session.email,  response.context.doctorName,  response.context.FormattedDate,  response.context.FormattedTime);
            }
            break;
    }
    return data;
}

function getMapData(response) {

}

module.exports = bot;