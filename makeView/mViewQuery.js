var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:power_low12@pega-reporting-hyokz.mongodb.net/test_pega?retryWrites=true&w=majority&keepAlive=true&poolSize=30&autoReconnect=true&socketTimeoutMS=0&connectTimeoutMS=360000";

var pipeline = [
    {
      "$lookup": {
        "from": "members",
        "localField": "data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID",
        "foreignField": "data.Member.ID",
        "as": "relMembers"
      }
    },
    {
      "$unwind": {
        "path": "$relMembers"
      }
    },
    {
      "$lookup": {
        "from": "memberpolicies",
        "localField": "data.Claim.ClaimHeader.ClaimHeader.Subscriber.Subscriber.ID",
        "foreignField": "data.MemberPolicy.MemberID",
        "as": "relPolicies"
      }
    },
    {
      "$unwind": {
        "path": "$relPolicies"
      }
    },
    {
      "$lookup": {
        "from": "providers",
        "localField": "data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID",
        "foreignField": "data.Provider.ID",
        "as": "relProviders"
      }
    },
    {
      "$unwind": {
        "path": "$relProviders"
      }
    },
    {
      "$merge": {
        "into": "pegaDataSetClaimPlus2"
      }
    }
];


function generatePartitionIntervals () {
    var totalCollectionSize = 50000000;
    var partitionSize = 1000000;
    var total = 0;
    var lowBound = null;
    var upperBound = null;
    var intervals = [];
    var i = 1000000;
    var count;
    while ( total < (totalCollectionSize - partitionSize)) {
	upperBound = i;
	var query = {"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : {$lte : "C-" + upperBound}};
	if (lowBound) query["data.Claim.ClaimHeader.ClaimHeader.ClaimID"]["$gt"] = "C-" + lowBound;
	count = db.claims.countDocuments(query);
	if (count > 1000000) {
	    intervals.push({low: lowBound, high: upperBound});
	    lowBound = upperBound;
	    total = total + count;
	    print("low: " + lowBound + " high: " + upperBound + " count:> " + count);
	}
	i = i + 100000;
	if ((i % 10000000) == 0) print("i: " + i + " total: " + total);
    }

    query = {"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : {$gt : "C-" + upperBound}};
    count = db.claims.countDocuments(query);
    intervals.push({low: upperBound, high: null});
    total = total + count;

    print("Total: " + total);
    return intervals;
}


// var pIntervals = generatePartitionIntervals();
// printjson(pIntervals);

function countIntervals(intervalArr) {
    let total = 0;
    for (let i = 0; i < intervalArr.length; i++) {
	let query = {};
	if (intervalArr[i].low) query["$gt"] = "C-" + pIntervals[i].low;
	if (intervalArr[i].high) query["$lte"] = "C-" + pIntervals[i].high;
	let count = db.pegaDataSetClaimPlus2.countDocuments({"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : query});
	print(i + " [" + intervalArr[i].low + ", " + intervalArr[i].high + "] > " + count);
	total = total + count;
    }
    print("Total: " + total);
}




var pIntervals = [
	{
		"low" : null,
		"high" : 1100000
	},
	{
		"low" : 1100000,
		"high" : 1200000
	},
	{
		"low" : 1200000,
		"high" : 1300000
	},
	{
		"low" : 1300000,
		"high" : 1400000
	},
	{
		"low" : 1400000,
		"high" : 1500000
	},
	{
		"low" : 1500000,
		"high" : 1600000
	},
	{
		"low" : 1600000,
		"high" : 1700000
	},
	{
		"low" : 1700000,
		"high" : 1800000
	},
	{
		"low" : 1800000,
		"high" : 1900000
	},
	{
		"low" : 1900000,
		"high" : 2000000
	},
	{
		"low" : 2000000,
		"high" : 2100000
	},
	{
		"low" : 2100000,
		"high" : 2200000
	},
	{
		"low" : 2200000,
		"high" : 2300000
	},
	{
		"low" : 2300000,
		"high" : 2400000
	},
	{
		"low" : 2400000,
		"high" : 2500000
	},
	{
		"low" : 2500000,
		"high" : 2600000
	},
	{
		"low" : 2600000,
		"high" : 2700000
	},
	{
		"low" : 2700000,
		"high" : 2800000
	},
	{
		"low" : 2800000,
		"high" : 2900000
	},
	{
		"low" : 2900000,
		"high" : 3000000
	},
	{
		"low" : 3000000,
		"high" : 3100000
	},
	{
		"low" : 3100000,
		"high" : 3200000
	},
	{
		"low" : 3200000,
		"high" : 3300000
	},
	{
		"low" : 3300000,
		"high" : 3400000
	},
	{
		"low" : 3400000,
		"high" : 3500000
	},
	{
		"low" : 3500000,
		"high" : 3600000
	},
	{
		"low" : 3600000,
		"high" : 3700000
	},
	{
		"low" : 3700000,
		"high" : 3800000
	},
	{
		"low" : 3800000,
		"high" : 3900000
	},
	{
		"low" : 3900000,
		"high" : 4000000
	},
	{
		"low" : 4000000,
		"high" : 4100000
	},
	{
		"low" : 4100000,
		"high" : 4200000
	},
	{
		"low" : 4200000,
		"high" : 4300000
	},
	{
		"low" : 4300000,
		"high" : 4400000
	},
	{
		"low" : 4400000,
		"high" : 4500000
	},
	{
		"low" : 4500000,
		"high" : 4600000
	},
	{
		"low" : 4600000,
		"high" : 4700000
	},
	{
		"low" : 4700000,
		"high" : 4800000
	},
	{
		"low" : 4800000,
		"high" : 4900000
	},
	{
		"low" : 4900000,
		"high" : 5000000
	},
	{
		"low" : 5000000,
		"high" : 5500000
	},
	{
		"low" : 5500000,
		"high" : 6500000
	},
	{
		"low" : 6500000,
		"high" : 7500000
	},
	{
		"low" : 7500000,
		"high" : 8500000
	},
	{
		"low" : 8500000,
		"high" : 9500000
	},
	{
		"low" : 9500000,
		"high" : null
	}
];

//mongoshell test

// var query;
// for (i = 0; i < 3; i++) {
//     query = {};
//     if (pIntervals[i].low) query["$gt"] = "C-" + pIntervals[i].low;
//     if (pIntervals[i].high) query["$lte"] = "C-" + pIntervals[i].high;
//     pipeline[0]["$match"]["data.Claim.ClaimHeader.ClaimHeader.ClaimID"] = query;
//     printjson(pipeline);
//     db.claims.aggregate(pipeline);
// }

var numParallelAggs = 4;
var currentInterval = 0;
var activeThreads = 0;

function aggregateInterval(col, iNum, callback) {
    let query = {};
    console.log("Processing Interval: ", iNum);
    activeThreads++;
    let match = {
	"$match" : {
	    "data.Claim.ClaimHeader.ClaimHeader.ClaimID" : 5
	}
    };
    if (pIntervals[iNum].low) query["$gt"] = "C-" + pIntervals[iNum].low;
    if (pIntervals[iNum].high) query["$lte"] = "C-" + pIntervals[iNum].high;
    match["$match"]["data.Claim.ClaimHeader.ClaimHeader.ClaimID"] = query;
    let aggPipe = [match].concat(pipeline);
    console.log(JSON.stringify(aggPipe));
    console.log("starting aggregation: ", iNum, " active threads: ", activeThreads);
    col.aggregate(aggPipe).toArray(function (err, result) {
//    col.find({}).toArray(function (err, result) {
	console.log("finished aggregation: ", iNum);
	if (err) {
	    console.log(err);
	    throw error;
	}
	activeThreads--;
	
	callback(null, iNum);
    });
}

function aggregateIntervals(col, callback) {

    let aggregateIntervalCB = function (err, curInterval) {
	if (err) throw err;
	let nextIntervalNum = curInterval + numParallelAggs;

	if (nextIntervalNum < pIntervals.length) {
	    aggregateInterval(col, nextIntervalNum, aggregateIntervalCB);
	}
	else if (activeThreads == 0) {
	    callback()
	}
    }
    
    for (i = 0; i < numParallelAggs; i++) {
	aggregateInterval(col, i, aggregateIntervalCB);
    }
}

MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
    if (err) throw err;
    let claimsCol = client.db("test_pega").collection("claims");

    aggregateIntervals(claimsCol, function(err, result) {
	console.log("done");
	client.close();
    });

});



