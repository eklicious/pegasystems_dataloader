
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

db.providers.aggregate(pipeline);
