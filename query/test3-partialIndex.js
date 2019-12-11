

db.claims.createIndex(
    { "data.Claim.ClaimHeader.ClaimHeader.ClaimID" : 1 },
    { partialFilterExpression: { "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": { $lt:150 } } }
)
