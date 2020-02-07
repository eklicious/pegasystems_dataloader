// Retrieve
const MongoClient = require('mongodb').MongoClient;
console.log('Launching...');
var srv = process.env.SRV;
console.log('SRV: ' + srv);
var db = process.env.DB;
console.log('DB: ' + db);
var claimNm = process.env.CLAIM;
console.log('CLAIM COLLECTION: ' + claimNm);
var memberNm = process.env.MEMBER;
console.log('MEMBER COLLECTION: ' + memberNm);
var memberPolicyNm = process.env.MEMBERPOLICY;
console.log('MEMBER POLICY COLLECTION: ' + memberPolicyNm);
var providerNm = process.env.PROVIDER;
console.log('PROVIDER COLLECTION: ' + providerNm);

var claimCol = null;
var memberPolicyCol = null;
var memberCol = null;
var providerCol = null;
var conflictsCol = null;
var globalClient = null;


// App constants
const updateMessage = {
	"pxUpdateDateTime" : Date.now(),
	"pxUpdateOperator" : randomNum(500000),
	"pxUpdateOpName" : "update",
	"pxUpdateSystemID" : randomNum(1000)
    };


// Connect to the db
MongoClient.connect(srv, function(err, client) {
  if(!err) {
    console.log("We are connected");
  }
  globalClient = client;
  claimCol = client.db(db).collection(claimNm);
  memberCol = client.db(db).collection(memberNm);
  memberPolicyCol = client.db(db).collection(memberPolicyNm);
  providerCol = client.db(db).collection(providerNm);
  conflictsCol = client.db(db).collection("conflicts");
});

module.exports = {
    member: {
        get: function(request, response) {
            var id = randomNum(request.params.id);
            memberCol.findOne({"data.Member.ID":"M-" + id}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Found member: id=' + id);
               } else {
                  console.log('Member not found: id=' + id);
               }
            });

            response.send('getting member: ' + id);
        },
        update: function(request, response) {
            var id = randomNum(request.params.id);
            memberCol.updateOne({"data.Member.ID":"M-" + id}, {$push : {operatorHistory : updateMessage}}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Updated member: id=' + id +',  modified count=' + result.result.nModified);
               } else {
                  console.log('Update member not found: id=' + id);
               }
            });
            response.send('updated member: ' + id);
        }
    },
    claim: {
        get: function(request, response) {
            var id = randomNum(request.params.id);
            claimCol.findOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID":"C-" + id}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Found claim: id=' + id);
               } else {
                  console.log('Claim not found: id=' + id);
               }
            });

            response.send('getting claim: ' + id);
        },
        update: function(request, response) {
            var id = randomNum(request.params.id);
            claimCol.updateOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID":"C-" + id}, {$push : {operatorHistory : updateMessage}}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Updated claim: id=' + id +',  modified count=' + result.result.nModified);
               } else {
                  console.log('Update claim not found: id=' + id);
               }
            });
            response.send('updated claim: ' + id);
        },
        add: function(request, response) {
            // create a random guid claim id
            var uuid = uuidv4();
            // console.log(uuid);
            var claimTemplate = getClaimTemplate('X-' + uuid, request.params.id);
            claimCol.insertOne(claimTemplate, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                    console.log('Add claim: ' + result._id);
                } else {
                    console.log('Add claim error...' + uuid);
                }
            });
            response.send('added claim: ' + uuid);
        }
    },
    provider: {
        get: function(request, response) {
            var id = randomNum(request.params.id);
            providerCol.findOne({"data.Provider.ID":"P-" + id}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Found provider: id=' + id);
               } else {
                  console.log('Provider not found: id=' + id);
               }
            });

            response.send('getting provider: ' + id);        
        },
        update: function(request, response) {
            var id = randomNum(request.params.id);
            providerCol.updateOne({"data.Provider.ID":"P-" + id}, {$push : {operatorHistory : updateMessage}}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Updated provider: id=' + id +',  modified count=' + result.result.nModified);
               } else {
                  console.log('Update provider not found: id=' + id);
               }
            });
            response.send('updated provider: ' + id);
        }
    },
    memberPolicy: {
        get: function(request, response) {
            var id = randomNum(request.params.id);
            memberPolicyCol.findOne({"data.MemberPolicy.MemberID":"M-" + id}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Found member policy: memberId=' + id);
               } else {
                  console.log('Member policy not found: memberId=' + id);
               }
            });

            response.send('getting member policy by memberId: ' + id);
        },
        update: function(request, response) {
            var id = randomNum(request.params.id);
            memberPolicyCol.updateOne({"data.MemberPolicy.MemberID":"M-" + id}, {$push : {operatorHistory : updateMessage}}, function(err, result) {
               if (err) return console.log("error: " + err);
               if (result) {
                  console.log('Updated member policy: memberId=' + id +',  modified count=' + result.result.nModified);
               } else {
                  console.log('Update member policy not found: memberId=' + id);
               }
            });
            response.send('updated member policy by memberId: ' + id);
        }
    },
    transaction: {
        test: async function(request, response) {
            var memberId = randomNum(request.params.memberId);
            var claimId = randomNum(request.params.claimId);
            var providerId = randomNum(request.params.providerId);
            console.log('memberId: ' + memberId);
            console.log('claimId: ' + claimId);
            console.log('providerId: ' + providerId);
            
            const ts = (new Date()).getTime();

            const session = globalClient.startSession();
            session.startTransaction();
            try {
                const opts = { session, returnOriginal: true };

                var oldVersion = null;

                /************************************************************************
                * Fetch the member doc
                * Update the last mod ts and version
                * Update the existing doc with the new doc
                * If the update isn't successful, audit this in the conflicts collection
                *************************************************************************/
                var doc = await memberCol.findOne({"data.Member.ID":"M-" + memberId}, opts);
                // await console.log(doc);
                if (doc) {
                    doc.ts = ts;
                    oldVersion = doc.version;
                    doc.version = ((doc.version) ? Number(doc.version) + 1 : 1);
                    await memberCol.findOneAndReplace({"data.Member.ID":"M-" + memberId, "version":oldVersion}, doc, opts, function(err, result) {
                        if (err) return console.log("memberCol.findOneAndReplace error: " + err);
                            if (result.lastErrorObject && result.lastErrorObject.n===1) {
                                console.log('Updated member: id=' + memberId + ', cnt=' + result.lastErrorObject.n);
                            } else {
                                console.log('Update member conflict: id=' + memberId + ', oldVersion=' + oldVersion);
                                conflictsCol.insertOne({"collection":memberNm, "id":memberId, "version":oldVersion});
                            }
                         });
                } else {
                    console.log("Member not found: id=" + memberId);
                }

                /************************************************************************
                * Repeat now for claims
                *************************************************************************/
                doc = await claimCol.findOne({"data.Claim.ClaimHeader.ClaimHeader.ClaimID":"C-" + claimId}, opts);
                if (doc) {
                    doc.ts = ts;
                    oldVersion = doc.version;
                    doc.version = ((doc.version) ? Number(doc.version) + 1 : 1);
                    await claimCol.findOneAndReplace({"data.Claim.ClaimHeader.ClaimHeader.ClaimID":"C-" + claimId, "version":oldVersion}, doc, opts, function(err, result) {
                        if (err) return console.log("claimCol.findOneAndReplace error: " + err);
                            if (result.lastErrorObject && result.lastErrorObject.n===1) {
                                console.log('Updated claim: id=' + claimId + ', cnt=' + result.lastErrorObject.n);
                            } else {
                                console.log('Update claim conflict: id=' + claimId + ', oldVersion=' + oldVersion);
                                conflictsCol.insertOne({"collection":claimNm, "id":claimId, "version":oldVersion});
                            }
                         });
                } else {
                    console.log("Claim not found: id=" + claimId);
                }

                /************************************************************************
                * Repeat now for provider
                *************************************************************************/
                doc = await providerCol.findOne({"data.Provider.ID":"P-" + providerId}, opts);
                if (doc) {
                    doc.ts = ts;
                    oldVersion = doc.version;
                    doc.version = ((doc.version) ? Number(doc.version) + 1 : 1);
                    await providerCol.findOneAndReplace({"data.Provider.ID":"P-" + providerId, "version":oldVersion}, doc, opts, function(err, result) {
                        if (err) return console.log("providerCol.findOneAndReplace error: " + err);
                            if (result.lastErrorObject && result.lastErrorObject.n===1) {
                                console.log('Updated provider: id=' + providerId + ', cnt=' + result.lastErrorObject.n);
                            } else {
                                console.log('Update provider conflict: id=' + providerId + ', oldVersion=' + oldVersion);
                                conflictsCol.insertOne({"collection":providerNm, "id":providerId, "version":oldVersion});
                            }
                         });
                } else {
                    console.log("Provider not found: id=" + providerId);
                }

                /************************************************************************
                * Repeat now for member policy
                *************************************************************************/
                doc = await memberPolicyCol.findOne({"data.MemberPolicy.MemberID":"M-" + memberId}, opts);
                if (doc) {
                    doc.ts = ts;
                    oldVersion = doc.version;
                    doc.version = ((doc.version) ? Number(doc.version) + 1 : 1);
                    await memberPolicyCol.findOneAndReplace({"data.MemberPolicy.MemberID":"M-" + memberId, "version":oldVersion}, doc, opts, function(err, result) {
                        if (err) return console.log("memberPolicyCol.findOneAndReplace error: " + err);
                            if (result.lastErrorObject && result.lastErrorObject.n===1) {
                                console.log('Updated member policy: memberId=' + memberId + ', cnt=' + result.lastErrorObject.n);
                            } else {
                                console.log('Update member policy conflict: memberId=' + memberId + ', oldVersion=' + oldVersion);
                                conflictsCol.insertOne({"collection":memberPolicyNm, "id":memberId, "version":oldVersion});
                            }
                         });
                } else {
                    console.log("Member policy not found: id=" + memberId);
                }

                await session.commitTransaction();
                session.endSession();
            } catch (error) {
                console.log(error);
                try {
                    await session.abortTransaction();
                } catch (error) {
                    // do nothing
                }
                session.endSession();
                // throw error; // Rethrow so calling function sees error
            }
            response.send('transaction finished for memberId=' + memberId + ', claimId=' + claimId + ', providerId=' + providerId);
        }
    }
}

// returns a random number from 1 to max (inclusive)
function randomNum(max) {
    return Math.floor(Math.random() * max) + 1;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getClaimTemplate(claimId, versionId) {
    return {
    "id" : "c951a546-861d-4b3d-8992-f84e8e7416a1",
    "idempotencyKey" : "00547636-0b58-4233-b4a9-8ea4fc310e0c",
    "version" : versionId,
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

