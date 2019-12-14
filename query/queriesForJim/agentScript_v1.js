// ================================================================
/*
The simulated workload used for the performance test will consist of the following steps:
1. Create a brand new claim document by copying from a template
2. Randomly select a member (members will be numbered from 1 to N)
3. Issue a find query to retrieve the member document from MongoDB
4. Issue an update query to Member document. 
5. Issue a find query to retrieve a Provider document
6. Issue an update query to Provider document
7. Issue a find query to retrieve a Policy document
8. Issue an update query to update the Policy document
9. Issue a find query to retrieve a Claim
10. Issue and update query to update the Claim
*/
// ================================================================

const lowMemberNum = 1;
const highMemberNum = 100;
const lowProviderNum = 1;
const highProviderNum = 100;
const lowPolicyNum = 1;
const highPolicyNum = 100;
const lowClaimNum = 1;
const highClaimNum = 100;
const createIndexesAtStart = false;

var currentClaimNum = highClaimNum;


var db = db.getSiblingDB("pegaSmall");
const claimsCol = db.getCollection("claims");
const membersPoliciesCol = db.getCollection("memberpolicies");
const membersCol = db.getCollection("members");
const providersCol = db.getCollection("providers");


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

function createIndexes() {
    membersCol.createIndex({"data.Member.ID" : 1});
    providersCol.createIndex({"data.Provider.ID" : 1});
    membersPoliciesCol.createIndex({"data.MemberPolicy.MemberID" : 1});
    claimsCol.createIndex({"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : 1});
}

if (createIndexesAtStart) {
    createIndexes();
}

// ================================================================
// 1. Create a brand new claim document by copying from a template
// ================================================================
var claimTemplate = {
    "id" : "c951a546-861d-4b3d-8992-f84e8e7416a1",
    "idempotencyKey" : "00547636-0b58-4233-b4a9-8ea4fc310e0c",
    "version" : "1",
    "type" : "Claim",
    "data" : {
	"Baseclass" : {
	    "Type" : "Claim"
	},
	"Claim" : {
	    "ClaimHeader" : {
		"Baseclass" : {
		    "Type" : "ClaimHeader"
		},
		"ClaimHeader" : {
		    "AttendingProvider" : {
			"Baseclass" : {
			    "Type" : "AttendingProvider"
			},
			"AttendingProvider" : {
			    "ID" : "P-134461"
			}
		    },
		    "ClaimID" : newClaimId(),
		    "ClaimStatus" : "697",
		    "ClaimStatusDate" : "2019-09-17",
		    "ClaimType" : "Vision",
		    "DiagnosisCode" : [
			{
			    "Baseclass" : {
				"Type" : "DiagnosisCode"
			    },
			    "DiagnosisCode" : {
				"Code" : "20019"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "DiagnosisCode"
			    },
			    "DiagnosisCode" : {
				"Code" : "39825"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "DiagnosisCode"
			    },
			    "DiagnosisCode" : {
				"Code" : "39484"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "DiagnosisCode"
			    },
			    "DiagnosisCode" : {
				"Code" : "41899"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "DiagnosisCode"
			    },
			    "DiagnosisCode" : {
				"Code" : "46058"
			    }
			}
		    ],
		    "LastXRayDate" : "2019-09-10",
		    "Notes" : [
			{
			    "Baseclass" : {
				"Type" : "Notes"
			    },
			    "Notes" : {
				"ClaimNoteText" : ""
			    }
			}
		    ],
		    "Patient" : {
			"Baseclass" : {
			    "Type" : "Patient"
			},
			"Patient" : {
			    "ID" : "M-596308"
			}
		    },
		    "Payment" : {
			"Baseclass" : {
			    "Type" : "Payment"
			},
			"Payment" : {
			    "ApprovedAmount" : 6505,
			    "CoinsuranceAmount" : 891,
			    "CopayAmount" : 80,
			    "LatepaymentInterest" : 94,
			    "PaidAmount" : 5234,
			    "PaidDate" : "2019-08-30",
			    "PatientPaidAmount" : 306,
			    "PatientResponsibilityAmount" : 922,
			    "PayerPaidAmount" : 7566
			}
		    },
		    "PlaceOfService" : "Urgent Care Facility",
		    "PrincipalDiagnosis" : "48684",
		    "PriorAuthorization" : false,
		    "ReceivedDate" : "2019-09-01",
		    "RenderingProvider" : {
			"Baseclass" : {
			    "Type" : "RenderingProvider"
			},
			"RenderingProvider" : {
			    "ID" : "P-647864"
			}
		    },
		    "ServiceEndDate" : "2019-10-14",
		    "ServiceFacility" : {
			"Baseclass" : {
			    "Type" : "ServiceFacility"
			},
			"ServiceFacility" : {
			    "ID" : "P-57385"
			}
		    },
		    "ServiceFromDate" : "2019-08-20",
		    "Subscriber" : {
			"Baseclass" : {
			    "Type" : "Subscriber"
			},
			"Subscriber" : {
			    "ID" : "M-69272"
			}
		    },
		    "SupervisingProvider" : {
			"Baseclass" : {
			    "Type" : "SupervisingProvider"
			},
			"SupervisingProvider" : {
			    "ID" : "P-261287"
			}
		    }
		}
	    },
	    "ClaimLine" : {
		"Baseclass" : {
		    "Type" : "ClaimLine"
		},
		"ClaimLine" : {
		    "AdjudicationDate" : "2019-08-28",
		    "AttendingProvider" : {
			"Baseclass" : {
			    "Type" : "AttendingProvider"
			},
			"AttendingProvider" : {
			    "ID" : "P-292267"
			}
		    },
		    "Diagnosiscodes" : [
			{
			    "Baseclass" : {
				"Type" : "Diagnosiscodes"
			    },
			    "Diagnosiscodes" : {
				"DiagnosisCode" : "5831"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "Diagnosiscodes"
			    },
			    "Diagnosiscodes" : {
				"DiagnosisCode" : "17953"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "Diagnosiscodes"
			    },
			    "Diagnosiscodes" : {
				"DiagnosisCode" : "32473"
			    }
			},
			{
			    "Baseclass" : {
				"Type" : "Diagnosiscodes"
			    },
			    "Diagnosiscodes" : {
				"DiagnosisCode" : "4461"
			    }
			}
		    ],
		    "OperatingProvider" : {
			"Baseclass" : {
			    "Type" : "OperatingProvider"
			},
			"OperatingProvider" : {
			    "ID" : "P-190671"
			}
		    },
		    "OrderingProvider" : {
			"Baseclass" : {
			    "Type" : "OrderingProvider"
			},
			"OrderingProvider" : {
			    "ID" : "P-632250"
			}
		    },
		    "OtherOperatingProvider" : {
			"Baseclass" : {
			    "Type" : "OtherOperatingProvider"
			},
			"OtherOperatingProvider" : {
			    "ID" : "P-18179"
			}
		    },
		    "Payment" : {
			"Baseclass" : {
			    "Type" : "Payment"
			},
			"Payment" : {
			    "AllowedAmount" : 5116,
			    "ApprovedAmount" : 866,
			    "CoinsuranceAmount" : 213,
			    "CopayAmount" : 85,
			    "DeductibleAmount" : 5346,
			    "PaidAmount" : 6874,
			    "PaidDate" : "2019-10-10",
			    "PatientPaidAmount" : 9057,
			    "PatientResponsibilityAmount" : 4499,
			    "PayerPaidAmount" : 1160
			}
		    },
		    "PlaceOfService" : "Other Place of Service",
		    "ProcedureCode" : "239",
		    "Quantity" : "51",
		    "ReferringProvider" : [
			{
			    "Baseclass" : {
				"Type" : "ReferringProvider"
			    },
			    "ReferringProvider" : {
				"ID" : "P-117361"
			    }
			}
		    ],
		    "RenderingProvider" : {
			"Baseclass" : {
			    "Type" : "RenderingProvider"
			},
			"RenderingProvider" : {
			    "ID" : "P-660109"
			}
		    },
		    "ServiceEndDate" : "2019-09-22",
		    "ServiceFromDate" : "2019-09-09",
		    "SupervisingProvider" : {
			"Baseclass" : {
			    "Type" : "SupervisingProvider"
			},
			"SupervisingProvider" : {
			    "ID" : "P-507412"
			}
		    },
		    "Unit" : "Prints"
		}
	    }
	}
    }
};

claimsCol.insertOne(claimTemplate);

// ================================================================
// 2. Randomly select a member (members will be numbered from 1 to N)
// ================================================================

//var memberNum = Math.floor((Math.random() * (highMemberNum - lowMemberNum + 1)) + lowMemberNum);
const memberNum = randomBetween(lowMemberNum, highMemberNum);

const memberId = "M-" + memberNum;

printjson({memberId : memberId});
//printjson(memberDoc);


// ================================================================
// 3. Issue a find query to retrieve the member document from MongoDB
// ================================================================

const memberDoc = membersCol.findOne({"data.Member.ID" : memberId});


// ================================================================
// 4. Issue an update query to Member document. 
// ================================================================

const updateMemberResults = updateDoc(membersCol, memberDoc._id, "updateMember");
printjson(updateMemberResults);

// ================================================================
// 5. Issue a find query to retrieve a Provider document
// ================================================================

const providerNum = randomBetween(lowProviderNum, highProviderNum);
const providerId = "P-" + providerNum;
const providerDoc = providersCol.findOne({"data.Provider.ID" : providerId});


// ================================================================
// 6. Issue an update query to Provider document
// ================================================================

const updateProviderResults = updateDoc(providersCol, providerDoc._id, "updateProvider");
printjson(updateProviderResults);


// ================================================================
// 7. Issue a find query to retrieve a Policy document
// ================================================================

const policyDoc = membersPoliciesCol.findOne({"data.MemberPolicy.MemberID" : memberId});


// ================================================================
// 8. Issue an update query to update the Policy document
// ================================================================

const updatePolicyResults = updateDoc(membersPoliciesCol, policyDoc._id, "updatePolicy");
printjson(updatePolicyResults);


// ================================================================
// 9. Issue a find query to retrieve a Claim
// ================================================================

const claimNum = randomBetween(lowClaimNum, currentClaimNum);
const claimId = "C-" + claimNum;
const claimDoc = claimsCol.findOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID" : claimId});


// ================================================================
// 10. Issue and update query to update the Claim
// ================================================================

const updateClaimResults = updateDoc(claimsCol, claimDoc._id, "updateClaim");
printjson(updateClaimResults);
