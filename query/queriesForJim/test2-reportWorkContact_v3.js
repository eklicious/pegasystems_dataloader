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
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimType': 'Medical',
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimStatus': '100',
	    'data.Claim.ClaimHeader.ClaimHeader.PlaceOfService': 'Pharmacy',
	    "data.Claim.Meta.Meta.PxCreateOperatorxs" : "29"
	}
    },
    {
	$lookup: {
	    from: 'members',
	    localField: 'data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID',
	    foreignField: 'data.Member.ID',
	    as: 'relMembers'
	}
    },
    {
	$unwind: {
	    path: '$relMembers'
	}
    },
    {
	$lookup: {
	    from: 'memberpolicies',
	    localField: 'data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID',
	    foreignField: 'data.MemberPolicy.MemberID',
	    as: 'relPolicies'
	}
    },
    {
	$unwind: {
	    path: '$relPolicies'
	}
    },
    {
	$lookup: {
	    from: 'providers',
	    localField: 'data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID',
	    foreignField: 'data.Provider.ID',
	    as: 'relProviders'
	}
    },
    {
	$unwind: {
	    path: "$relProviders"
	}
    },
    {
	$project: {
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimID': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimStatus': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimStatusDate': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimType': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.LastXRayDate': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.PlaceOfService': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.PriorAuthorization': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.ReceivedDate': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.ServiceFromDate': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.ServiceEndDate': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.ApprovedAmount': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidDate': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID': 1,
	    'data.Claim.ClaimHeader.ClaimHeader.Patient.Patient.ID': 1,
	    'Member.LastName': '$relMembers.data.Member.PyLastName',
	    'Member.FirstName': '$relMembers.data.Member.PyFirstName',
	    'Member.Ethnicity': '$relMembers.data.Member.Ethnicity',
	    'Member.MaritialStatus': '$relMembers.data.Member.MaritialStatus',
	    'Member.CitizenshipStatusCode': '$relMembers.data.Member.CitizenshipStatusCode',
	    'Member.DateOfBirth': '$relMembers.data.Member.DateOfBirth',
	    'Member.Gender': '$relMembers.data.Member.Gender',
	    'Policy.ID': '$relPolicies.data.MemberPolicy.PolicyID',
	    'Policy.MemberPolEffDate': '$relPolicies.data.MemberPolicy.MemberPolEffDate',
	    'Policy.MemberPolTermDate': '$relPolicies.data.MemberPolicy.MemberPolTermDate',
	    'Policy.PolicyRole': '$relPolicies.data.MemberPolicy.PolicyRole',
	    'Policy.SelectedPlan': '$relPolicies.data.MemberPolicy.SelectedPlan',
	    "Provider.ID" : "$relProviders.data.Provider.ID",
	    "Provider.FirstName": "$relProviders.data.Provider.PyFirstName",
	    "Provider.LastName": "$relProviders.data.Provider.PyLastName"
	}
    },
    {
	$sort: {
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimID': 1
	}
    },
    {$limit: 50}
];


timeQuery(function() {
    return claimsCol.aggregate(pipeline);
})

/*
printjson(claimsCol.aggregate(pipeline, {explain : true}))
*/
