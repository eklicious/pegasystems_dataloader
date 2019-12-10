//Enriches claim documents with member information

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
}}, {$addFields: {
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
}}, {$out: 'testClaimUpdate'}]

db.claims.aggregate(pipeline)
