var databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

var claimsCol = db.getCollection("claims");

claimsCol.aggregate([
    {
	$match: {
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimStatus': {$lt: '100'},
	    'data.Claim.ClaimHeader.ClaimHeader.ClaimType': 'Medical'
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
	    path: '$relProviders'
	}
    },
    {
	$project : {
	    _id : 0
	}
    },
    {
	$out : "AllJoinMView"
    }
])
    
