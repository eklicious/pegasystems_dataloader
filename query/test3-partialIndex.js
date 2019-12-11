
var databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

var claimsCol = db.getCollection("claims");

function timeQuery (query) {
    var start = new Date();
    var cursor = query();
    var end = new Date();
    var duration = end - start;
    print("Execution time: " + duration);
    return duration;
}
timeQuery(function() {
    return claimsCol.createIndex(
	{ "data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : 1 },
	{ partialFilterExpression: { "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": { $lt:10 } } }
    );
});
