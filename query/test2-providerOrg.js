
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

var pipeline =
[{$graphLookup: {
  from: 'providers',
  startWith: "$data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID",
  connectFromField: 'data.Provider.BusinessAffiliation.BusinessAffiliation.ProviderID',
  connectToField: 'data.Provider.ID',
  as: 'affiliates',
  maxDepth: 2
}}, {$match: {
  affiliates : {$not: {$size : 0}}
}}, {$limit: 20}];

timeQuery(function () {
    return providersCol.aggregate(pipeline);
})
