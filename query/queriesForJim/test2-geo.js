
var databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

var claimsCol = db.getCollection("claims");
var membersPoliciesCol = db.getCollection("memberpolicies");
var membersCol = db.getCollection("members");
var providersCol = db.getCollection("providers");

function timeQuery (query) {
    var start = new Date();
    var cursor = query();
    var end = new Date();
    var duration = end - start;
    print("Execution time: " + duration);
    return duration;
}


var geoNearStage1 = {
    $geoNear : {
	near: {type :"Point" , coordinates: [10, 10]},
	distanceField: "distance",
	spherical: false,
	maxDistance: 20000,
	num: 100,
	spherical: false
    }
};

var limitStage2 = {
    $limit : 20
};

var pipeline2 = [
    geoNearStage1,
    limitStage2
]

timeQuery(function() {
    return providersCol.aggregate(pipeline2)
});
