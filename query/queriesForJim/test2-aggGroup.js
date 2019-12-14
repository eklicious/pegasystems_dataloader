
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

var pipeline = [
    {
	$match: {
	    "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" : "1",
	    "data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical" 
	}
    },
    {
	$group: {
	    _id: "$data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID",
	    totalPayment: {
		$sum: "$data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidAmount"
	    },
	    claims: {
		$addToSet : "$data.Claim.ClaimHeader.ClaimHeader.ClaimID"
	    }
	}
    }
];

timeQuery(function () {
    return claimsCol.aggregate(pipeline);
});
