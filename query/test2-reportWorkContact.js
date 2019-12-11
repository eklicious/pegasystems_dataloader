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

timeQuery(function() {
    return claimsCol.aggregate(pipeline);
})
