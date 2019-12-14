//Enriches claim documents with member information

const databaseName = "test_pega";
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

var pipeline = [
    {
	$match: {
	    "data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical",
	    "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" : {$gt : "100"},
	    "data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : "Indian Health",
	    'data.Claim.Meta.Meta.PxCreateOperatorxs': {$in : ["29", "30", "31", "32", "33", "34", "35", "36", "37"]}
	}
    },
    {
	$addFields: {
	    "data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : "Native American Health"
	}
    },
    {
	$project: {
	    relMembers: 0,
	}
    },
    {
	$out: 'testClaimUpdate'
    }
];

//{ $merge: { into: "mergeTest", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }

timeQuery(function () {
    return claimsCol.aggregate(pipeline)
})
