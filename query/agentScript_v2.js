// ================================================================

// The simulated workload used for the performance test will consist of the following steps:

// ** Interaction #1: **
// ** Member calls in to update their information

// 1. Read Random Member
// 2. Read associated Member Policy
// 3. Pause 5-90 Seconds
// 4. Update to Member
// 5. Update associated Member Policy

// ** Interaction #2: **
// ** Provider calls into update their information and correct a recently filed claim

// 6. Read Random Claim
// 7. Read Associated Rendering Provider
// 8. Pause 5-90 Seconds
// 9. Update Claim 
// 10.Update Provider
// ================================================================

var lowMemberNum = 1;
var highMemberNum = 65000000;
var lowProviderNum = 1;
var highProviderNum = 100;
var lowPolicyNum = 1;
var highPolicyNum = 100;
var lowClaimNum = 1;
var highClaimNum = 100;
var addSleeps = true;


var db = db.getSiblingDB("test_pega");
var claimsCol = db.getCollection("claims");
var membersPoliciesCol = db.getCollection("memberpolicies");
var membersCol = db.getCollection("members");
var providersCol = db.getCollection("providers");


// returns a random number from 1 to max (inclusive)
function randomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function randomBetween (min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function updateDoc(collection, doc_id, operation) {
    const updateMessage = {
	"pxUpdateDateTime" : Date.now(),
	"pxUpdateOperator" : randomNum(1000),
	"pxUpdateOpName" : operation,
	"pxUpdateSystemID" : randomNum(1000)
    };
    
    return collection.updateOne({_id : doc_id},
				{$push : {operatorHistory : updateMessage}});
    
}

function newClaimId () {
    return "C-" + currentClaimNum++;
}

function mongoSleep(min, max) {
    if (addSleeps) {
	const sleepTime = randomBetween(5, 90);
	print("Sleeping for " + sleepTime + " seconds.");
	sleep(sleepTime * 1000);
    }
}

// ================================================================
// 1.  Read Random Member
// ================================================================

var memberNum = randomBetween(lowMemberNum, highMemberNum);
var memberId = "M-" + memberNum;

printjson({memberId : memberId});
var memberDoc = membersCol.findOne({"data.Member.ID" : memberId});

// ================================================================
// 2.  Read associated Member Policy
// ================================================================

var memberPolicyDoc = membersPoliciesCol.findOne({"data.MemberPolicy.MemberID" : memberId})
 

// ================================================================
// 3. PAUSE 5-90 seconds
// ================================================================

mongoSleep(5, 90);


// ================================================================
// 4. Update to Member 
// ================================================================

var updateMemberResults = updateDoc(membersCol, memberDoc._id, "updateMember");
printjson(updateMemberResults);

// ================================================================
// 5. Update associated Member Policy
// ================================================================

var updateMembePolicyrResults = updateDoc(membersPoliciesCol, memberPolicyDoc._id, "updateMemberPolicy");
printjson(updateMemberResults);


// ================================================================
// 6. Read Random Claim
// ================================================================

var claimNum = randomBetween(lowClaimNum, highClaimNum);
var claimId = "C-" + memberNum;

printjson({claimId : claimId});
var claimDoc = claimsCol.findOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : claimId}); 


// ================================================================
// 7. Read Associated Rendering Provider
// ================================================================

var providerDoc = providersCol.findOne({"data.Provider.ID" : claimDoc.data.Claim.ClaimHeader.ClaimHeader.RenderingProvider.RenderingProvider.ID}); //


// ================================================================
// 8. Pause 5-90 Seconds
// ================================================================


mongoSleep(5, 90);

// ================================================================
// 9. Update Claim
// ================================================================

var updateClaimResults = updateDoc(claimsCol, claimDoc._id, "updateClaim");
printjson(updateClaimResults);


// ================================================================
// 10. Update Provider
// ================================================================

var updateProviderResults = updateDoc(providersCol, providerDoc._id, "updateProvider");
printjson(updateProviderResults);
