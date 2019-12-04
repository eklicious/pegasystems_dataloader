
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


var claimsCol = db.getCollection("claims");
var membersPoliciesCol = db.getCollection("memberpolicies");
var membersCol = db.getCollection("members");
var providersCol = db.getCollection("providers");

createIndexes();
