
const databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

var providersCol = db.getCollection("providers");

function timeQuery (query) {
    var start = new Date();
    var cursor = query();
    var end = new Date();
    var duration = end - start;
    print("Execution time: " + duration);
    return duration;
}
/*
var pipeline =
    [
	{
	    $match : {
		"data.Provider.ID" : "P-140002"
	    }
	},
	{
	    $graphLookup: {
		from: 'providers',
		startWith: "$data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID",
		connectFromField: 'data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
		connectToField: 'data.Provider.ID',
		as: 'affiliates',
		maxDepth: 2
	    }
	},
	{
	    $match: {
		affiliates : {$not: {$size : 0}}
	    }
	},
	{
	    $limit: 20
	}
    ];
*/
/*
var pipeline = [{$match: {
  'data.Provider.ID': 'P-140002'
}}, {$graphLookup: {
  from: 'providers',
  startWith: '$data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
  connectFromField: 'data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
  connectToField: 'data.Provider.ID',
  as: 'affiliates',
  maxDepth: 3
}}];
*/

var pipeline = [
    {
	$match: {
	    'data.Provider.ID': 'P-140002'
	}
    },
    {
	$graphLookup: {
	    from: 'providers',
	    startWith: '$data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
	    connectFromField: 'data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
	    connectToField: 'data.Provider.ID',
	    as: 'affiliates',
	    maxDepth: 3
	}
    },
    {
	$unwind: {
	    path: "$affiliates"
	}
    },
    {
	$lookup: {
	    from: 'claims',
	    let: {pID : "$affiliates.data.Provider.ID"},
	    pipeline: [
		{
		    $match : {
			"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": { $lt: "1550" },
			"data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical",
			'data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID' : "$$pID"
		    }
		},
		{
		    $group : {
			_id : null,
			totalAmount: {$sum : "$data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidAmount"},
			claimCount: {$sum : 1},
			claims: {$push : "$data.Claim.ClaimHeader.ClaimHeader.ClaimID"}
		    }
		}
	    ],
	    as: 'claimData'
	}
    }
];

var pipeline = [
    {
	$match: {
	    'data.Provider.ID': 'P-670623'
	}
    },
    {
	$graphLookup: {
	    from: 'providers',
	    startWith: '$data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
	    connectFromField: 'data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
	    connectToField: 'data.Provider.ID',
	    as: 'affiliates',
	    maxDepth: 5
	}
    },
    {
	$unwind: {
	    path: "$affiliates"
	}
    },
    {
	$lookup: {
	    from: 'claims',
	    let: {pID : "$affiliates.data.Provider.ID"},
	    pipeline: [
		{
		    $match : {
			$and : [
			    {"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": { $lt: "1550" }},
		            {"data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical"},
		            {
				$expr : {
				    $eq : ['$data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID', "$$pID"]
				}
		            }
		        ]
		    }
		},
		{
		    $group : {
			_id : null,
			totalAmount: {$sum : "$data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidAmount"},
			avgClaimAmt : {$avg : "$data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidAmount"},
			claimCount: {$sum : 1},
			claims: {$push : "$data.Claim.ClaimHeader.ClaimHeader.ClaimID"}
		    }
		}
	    ],
	    as: 'claimAggregates'
	}
    },
    {
	$unwind: {
	    path: "$claimAggregates"
	}
    },
    {
	$addFields : {
	    AffiliatedProviderID: "$affiliates.data.Provider.ID"
	}
    },
    {
	$project : {
	    "data": 0,
	    "operatorHistory" : 0,
	    "affiliates" : 0,
	    "claimAggregates._id" :0
	}
    }
]

// join with provider as rendering provider with associated "data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID"
// aggregate "data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidAmount" by provider

timeQuery(function () {
    return providersCol.aggregate(pipeline);
})
