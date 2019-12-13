
const databaseName = "test_pega";
var db = db.getSiblingDB(databaseName);

function createIndexes() {
    membersCol.createIndex({"data.Member.ID" : 1});
    membersCol.createIndex({"data.Member.Address.Address.Coordinates": "2dsphere"});//fix this one
}

var membersCol = db.getCollection("members");

createIndexes();

