
const databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

function createIndexes() {
    membersCol.createIndex({"data.Member.ID" : 1});
    providersCol.createIndex({"data.Provider.ID" : 1});
    membersPoliciesCol.createIndex({"data.MemberPolicy.MemberID" : 1});
    claimsCol.createIndex({"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : 1});
    membersCol.createIndex({"data.Member.Address.Address.Coordinates": "2dsphere"});//fix this one
    providersCol.createIndex({"data.Provider.Address.Address.Coordinates": "2dsphere"});
}

// function createAggIndexes() {
//     claimsCol.createIndex({
// 	"data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : 1,
// 	"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" :  1,
// 	"data.Claim.ClaimHeader.ClaimHeader.ClaimType" : 1,
// 	"data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : 1,
// 	"data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID": 1
//     },
// 			  { name : "claimMemberLookupIndex"}
// 			 );
// }


function createAggIndexes() {
    claimsCol.createIndex({
	"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus" : 1,
	"data.Claim.ClaimHeader.ClaimHeader.ClaimType" : 1,
	"data.Claim.ClaimHeader.ClaimHeader.PlaceOfService" : 1,
	"data.Claim.Meta.Meta.PxCreateOperatorxs" : 1
    },
			  {
			      name : "claimMemberLookupIndex",
			      background: true
			  }
			 );
}


var claimsCol = db.getCollection("claims");
var membersPoliciesCol = db.getCollection("memberpolicies");
var membersCol = db.getCollection("members");
var providersCol = db.getCollection("providers");

createIndexes();
createAggIndexes();

db.createView("vw_member", "members", [{
    $project: {
        "data.Member.LastName": 1,
        "data.Member.FirstName": 1,
        "data.Member.Address": 1,
        "data.Member.DateOfBirth": 1,
        "data.Member.Gender": 1,
        "data.Member.Ethnicity": 1,
        "data.Member.MemberStatus": 1,
        "data.Member.PolicyId": 1,
        "data.Member.Languages": 1,
        "data.Member.CitizenshipStatusCode": 1
    }
}]
)

db.createView("vw_provider", "providers", [{
    $project: {
        "data.Provider.ID": 1,
        "data.Provider.FederalTaxID": 1,
        "data.Provider.NationalProviderIdentifier": 1,
        "data.Provider.LastName": 1,
        "data.Provider.FirstName": 1,
        "data.Provider.Languages": 1,
        "data.Provider.Gender": 1,
        "data.Provider.HospitalAdmittingPrivileges": 1,
        "data.Provider.BusinessAffiliation": 1
    }
}]
)

db.createView("vw_claim", "claims", [{
    $project: {
        "data.Claim.ClaimHeader.ClaimHeader.ClaimId": 1,
        "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": 1,
        "data.Claim.ClaimHeader.ClaimHeader.PatientId": 1,
        "data.Claim.ClaimHeader.ClaimHeader.Payment": 1,
        "data.Claim.ClaimHeader.ClaimHeader.PlaceOfService": 1,
        "data.Claim.ClaimHeader.ClaimHeader.ReceivedDate": 1,
        "data.Claim.ClaimHeader.ClaimHeader.RenderingProviderId": 1,
        "data.Claim.ClaimHeader.ClaimLine.AdjudicationDate": 1,
        "data.Claim.ClaimHeader.ClaimLine.PlaceOfService": 1,
        "data.Claim.ClaimHeader.ClaimLine.Quantity": 1,
        "data.Claim.ClaimHeader.ClaimLine.RenderingProviderId": 1
    }
}])

db.createView("vw_memberpolicies", "memberpolicies", [
    {
	$project: {
	    "data.MemberPolicy.MemberID" : 1,
	    "data.MemberPolicy.PolicyID" : 1,
	    "data.MemberPolicy.PolicyRole" : 1,
	    "data.MemberPolicy.primaryCarePhysician.PrimaryCarePhysician.ID": 1
	}
    }
])


