
var cursor = db.claims.find({"data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": { $lt: "1550" }, "data.Claim.ClaimHeader.ClaimHeader.ClaimType" : "Medical"})

while (cursor.hasNext()) {
    let claimDoc = cursor.next();
    let providerID = claimDoc.data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID;
    let providerDoc = db.providers.findOne({"data.Provider.ID" : providerID});
    if (providerDoc) {
	print("Claim: " + claimDoc.data.Claim.ClaimHeader.ClaimHeader.ClaimID + " Provider: " + providerID)
    }
}
    
