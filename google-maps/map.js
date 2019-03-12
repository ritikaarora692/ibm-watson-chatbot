
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDfx_XZqtXPhmz-AHRsH8lndmMh2q49_Qo'
});

var GooglePlaces = require('node-googleplaces');

var places = new GooglePlaces('AIzaSyDfx_XZqtXPhmz-AHRsH8lndmMh2q49_Qo');

// Geocode an address.
var googleMap = {

    getGeoCode: function (address, callback) {
        googleMapsClient.geocode({
            address: address
        }, function (err, response) {
            var result = {};
            result.geometry = {}
            if (!err && response.json.results != null && response.json.results.length > 0 ) {
                result.formattedAddress = response.json.results[0].formatted_address;
                result.geometry.location = response.json.results[0].geometry.location;
                // console.log(result);
                //console.log(JSON.stringify(response.json.results));
                return callback(result);
            }
            else {
                console.log("error 1");

                return callback(null);
            }
        });
    },

    getNearbyPlaces: function (lat, lng, type, radius, callback) {
        googleMapsClient.placesNearby({
            language: 'en',
            location: [lat, lng],
            radius: radius,
            type: type
        }, function (err, response) {
            var result = [];
            if (!err) {
                //console.log(JSON.stringify(response.json.results));
                var jsonRes = response.json.results;
                //console.log(jsonRes.length);
                for (i = 0; i < jsonRes.length; i++) {
                    // console.log(result);
                    result.push(new Marker(jsonRes[i].id, jsonRes[i].name, jsonRes[i].geometry.location));
                }
                //console.log(JSON.stringify(response.json.results));
                return callback(result);
            }
            else {
                console.log("error");
            }
        });
    },
    textSearch: function (lat, lng, type, textQuery, callback) {
        params = {
            location: lat + "," + lng,
            type: type,
            query: textQuery.toString().toLowerCase() + " near me"
        }
        places.textSearch(params, (err, res) => {
            if (res) {
                var result = [];
                //result = { "userLocation": userLocation, "doctorList": res.body.results };

                var jsonRes = res.body.results;
                //console.log(jsonRes.length);
                for (i = 0; i < jsonRes.length; i++) {
                    // console.log(result);
                    result.push(new Marker(jsonRes[i].id, jsonRes[i].name, jsonRes[i].geometry.location));
                }

                return callback(result);
            }
            else {
                console.log("error");
                return callback(null);
            }
        });

    }

}

function Marker(id, name, location) {
    this.id = id;
    this.name = name;
    this.geometry = {};
    this.geometry.location = location;
};

module.exports = googleMap;