// Retrieve
const MongoClient = require('mongodb').MongoClient;
const srv = "mongodb+srv://ek:ek@pegasystems-tp2me.mongodb.net/test?retryWrites=true&w=majority";
const db = "pegasystems";
const claimNm = "claim";
const memberNm = "member";
const memberPolicyNm = "member_policy";
const providerNm = "provider";
const tempNm = "temp";

var claimCol = null;
var memberPolicyCol = null;
var memberCol = null;
var providerCol = null;
var tempCol = null;

// App constants
const updateMessage = {
	"pxUpdateDateTime" : Date.now(),
	"pxUpdateOperator" : randomNum(1000),
	"pxUpdateOpName" : "update",
	"pxUpdateSystemID" : randomNum(1000)
    };


// Connect to the db
MongoClient.connect(srv, function(err, client) {
  if(!err) {
    console.log("We are connected");
  }
  claimCol = client.db(db).collection(claimNm);
  memberCol = client.db(db).collection(memberNm);
  memberPolicyCol = client.db(db).collection(memberPolicyNm);
  providerCol = client.db(db).collection(providerNm);
  tempCol = client.db(db).collection(tempNm);
});

module.exports = {
    member: {
        get: function(request, response) {
            memberCol.findOne({"data.Member.ID":"M-" + request.params.id}, function(err, result) {
                console.log('Found member: ' + result._id);
            });

            response.send('getting member: ' + request.params.id);
        },
        update: function(request, response) {
            memberCol.updateOne({"data.Member.ID":"M-" + request.params.id}, {$push : {operatorHistory : updateMessage}});
            response.send('updated member: ' + request.params.id);
        }
    },
    claim: {
        get: function(request, response) {
            claimCol.findOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID":"C-" + request.params.id}, function(err, result) {
                console.log('Found claim: ' + result._id);
            });

            response.send('getting claim: ' + request.params.id);
        },
        update: function(request, response) {
            claimCol.updateOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID":"C-" + request.params.id}, {$push : {operatorHistory : updateMessage}});
            response.send('updated claim: ' + request.params.id);
        },
        add: function(request, response) {
            var claimTemplate = getClaimTemplate(request.params.id);
            tempCol.insertOne(claimTemplate);
            response.send('added claim: ' + request.params.id);
        }
    },
    provider: {
        get: function(request, response) {
            providerCol.findOne({"data.Provider.ID":"P-" + request.params.id}, function(err, result) {
                console.log('Found provider: ' + result._id);
            });

            response.send('getting provider: ' + request.params.id);        
        },
        update: function(request, response) {
            providerCol.updateOne({"data.Provider.ID":"P-" + request.params.id}, {$push : {operatorHistory : updateMessage}});
            response.send('updated provider: ' + request.params.id);
        }
    },
    memberPolicy: {
        get: function(request, response) {
            memberPolicyCol.findOne({"data.MemberPolicy.MemberID":"M-" + request.params.id}, function(err, result) {
                console.log('Found member policy based on member id: ' + result._id);
            });

            response.send('getting member policy by memberId: ' + request.params.id);
        },
        update: function(request, response) {
            memberPolicyCol.updateOne({"data.MemberPolicy.MemberID":"M-" + request.params.id}, {$push : {operatorHistory : updateMessage}});
            response.send('updated member policy by memberId: ' + request.params.id);
        }
    }
}

// returns a random number from 1 to max (inclusive)
function randomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function getClaimTemplate(claimId) {
    return {
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
		    "ClaimID" : claimId,
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

}
