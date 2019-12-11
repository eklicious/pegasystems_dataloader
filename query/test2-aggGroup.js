var pipeline = 
[{$match: {
  "data.Claim.ClaimHeader.ClaimHeader.PrincipalDiagnosis" : "1"
}}, {$group: {
  _id: "$data.Claim.ClaimHeader.ClaimHeader.AttendingProvider.AttendingProvider.ID",
  totalPayment: {
    $sum: "$data.Claim.ClaimHeader.ClaimHeader.Payment.Payment.PaidAmount"
  },
  claims: {$addToSet : "$data.Claim.ClaimHeader.ClaimHeader.ClaimID"}
}}, {$match: {
  claims : {$size : 2}
}}];

function timeQuery (query) {
    var start = new Date();
    var cursor = query();
    var end = new Date();
    var duration = end - start;
    print("Execution time: " + duration);
    return duration;
}

timeQuery(function () {
    return db.claims.aggregate(pipeline);
});
