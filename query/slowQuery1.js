
const databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

var claimsCol = db.getCollection("claims");
var membersPoliciesCol = db.getCollection("memberpolicies");
var membersCol = db.getCollection("members");
var providersCol = db.getCollection("providers");

function createAggIndexes() {
    claimsCol.createIndex({
	"data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : 1,
	"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" :  1,
	"data.Claim.ClaimHeader.ClaimHeader.ClaimType" : 1,
	"data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : 1,
	"data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID": 1
    },
			  { name : "claimMemberLookupIndex"}
			 );
}
			 

var matchStage1 = {
    $match : {
	"data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical",
	"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" :  "100",
	"data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : "Pharmacy",
	"data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : "29954",
//	"data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID" : {"$gte" : "P-76000", "$lt" : "P-77000"},
//	"data.Claim.ClaimHeader.ClaimHeader.PriorAuthorization" : true,
	"data.Claim.ClaimLine.ClaimLine.Payment.Payment.CoinsuranceAmount" : {"$lt" : 1000}
    }
};

var lookupStage2 = {
    $lookup : {
	from: "members",
	localField : "data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID",
	foreignField : "data.Member.ID",
	as: "relMembers"
    }
};


var matchStage3 = {
    $match : {
	"relMembers.data.Member.Ethnicity" : "Hispanic", //Asian
	"relMembers.data.Member.MaritialStatus" : "Single", //Widow
	"relMembers.data.Member.CitizenshipStatusCode" : "Foreign Worker" //Native
    }
};

var limitStage4 = {
    $limit : 20
}


var pipeline = [
    matchStage1,
    lookupStage2,
    matchStage3,
    limitStage4
];

var resultsCur = db.claimsCol.aggregate(pipeline);


// put member information in the join

// ================================================================

const geoNearStage1 = {
    $geoNear : {
	near: [50, 50],
	distanceField: "distance",
	spherical: false,
	maxDistance: .1,
	includeLocs: "locations"
    }
};

const limitStage2 = {
    $limit : 20
};

const pipeline2 = [
    geoNearStage1,
    limitStage2
]

var resultCur = db.providers.aggregate(pipeline2)
