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
	    "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" : "100",
	    "data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : "Worksite",
	    "data.Claim.Meta.Meta.PxCreateOperatorxs" : "29"
	}
    },
    {
	$lookup: {
	    from: "members",
	    localField : "data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID",
	    foreignField : "data.Member.ID",
	    as: "relMembers"
	}
    },
    {
	$addFields: {
	    memberInfo: {
		$let : {
		    vars: {member : {"$arrayElemAt" : ["$relMembers", 0]}},
			in: {
			    First: "$$member.data.Member.PyFirstName",
			    Last: "$$member.data.Member.PyLastName",
			    Middle: "$$member.data.Member.PyMiddleName",
			    Gender: "$$member.data.Member.Gender"
			}
		}
	    }
	}
    },
    {
	$project: {
	    relMembers: 0
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
