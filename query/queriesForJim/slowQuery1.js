
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

var pipeline =
    [{$match: {
  "data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical",
		"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" :  "100",
		"data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : "Pharmacy",
    "data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : "29954",
    "data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID" : {"$gte" : "P-76000", "$lt" : "P-77000"},
    "data.Claim.ClaimHeader.ClaimHeader.PriorAuthorization" : true,
    "data.Claim.ClaimLine.ClaimLine.Payment.Payment.CoinsuranceAmount" : {"$lt" : 1000}
}}, {$lookup: {

	    from: "members",
	    localField : "data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID",
	    foreignField : "data.Member.ID",
	    as: "relMembers"

  }}, {$match: {
  "relMembers.data.Member.Ethnicity" : "Hispanic",
  "relMembers.data.Member.MaritialStatus" : "Single",
  	"relMembers.data.Member.CitizenshipStatusCode" : "Foreign Worker"
}}, {$unwind: {
  path: "$relMembers"
}}, {$project: {
  "data.Claim.ClaimHeader.ClaimHeader.ClaimID" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.ClaimStatusDate": 1,
  "data.Claim.ClaimHeader.ClaimHeader.ClaimType" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.LastXRayDate" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.PriorAuthorization" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.ReceivedDate" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.ServiceFromDate" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.ServiceEndDate" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.ApprovedAmount" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidDate" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID" : 1,
  "data.Claim.ClaimHeader.ClaimHeader.Patient.Patient.ID" : 1,
  "Member.LastName": "$relMembers.data.Member.PyLastName",
  "Member.FirstName": "$relMembers.data.Member.PyFirstName",
  "Member.Ethnicity": "$relMembers.data.Member.Ethnicity",
  "Member.MaritialStatus" : "$relMembers.data.Member.MaritialStatus",
  "Member.CitizenshipStatusCode" : "$relMembers.data.Member.CitizenshipStatusCode",
  "Member.DateOfBirth" : "$relMembers.data.Member.DateOfBirth",
  "Member.Gender" : "$relMembers.data.Member.Gender",
}}, {$limit: 20}];

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
