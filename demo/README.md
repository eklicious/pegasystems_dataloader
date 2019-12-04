BJB - 12-4-19
Views:
db.createView("vw_member", "members", [{
    $project: {
        "data.Member.LastName": 1,
        "data.Member.FirstName": 1,
        "data.Member.Address": 1,
        "data.Member.DateOfBirth": 1,
        "data.Member.Gender": 1,
        "data.Member.Ethnicity": 1,
        "data.Member.MemberStatus": 1,
        "data.Member.PolicyId": 1,
        "data.Member.Languages": 1,
        "data.Member.CitizenshipStatusCode": 1
    }
}]
)

db.createView("vw_provider", "providers", [{
    $project: {
        "data.Provider.ID": 1,
        "data.Provider.FederalTaxID": 1,
        "data.Provider.NationalProviderIdentifier": 1,
        "data.Provider.LastName": 1,
        "data.Provider.FirstName": 1,
        "data.Provider.Languages": 1,
        "data.Provider.Gender": 1,
        "data.Provider.HospitalAdmittingPrivileges": 1,
        "data.Provider.BusinessAffiliation": 1
    }
}]
)

db.createView("vw_claim", "claims", [{
    $project: {
        "data.Claim.ClaimHeader.ClaimHeader.ClaimId": 1,
        "data.Claim.ClaimHeader.ClaimHeader.ClaimStatus": 1,
        "data.Claim.ClaimHeader.ClaimHeader.PatientId": 1,
        "data.Claim.ClaimHeader.ClaimHeader.Payment": 1,
        "data.Claim.ClaimHeader.ClaimHeader.PlaceOfService": 1,
        "data.Claim.ClaimHeader.ClaimHeader.ReceivedDate": 1,
        "data.Claim.ClaimHeader.ClaimHeader.RenderingProviderId": 1,
        "data.Claim.ClaimHeader.ClaimLine.AdjudicationDate": 1,
        "data.Claim.ClaimHeader.ClaimLine.PlaceOfService": 1,
        "data.Claim.ClaimHeader.ClaimLine.Quantity": 1,
        "data.Claim.ClaimHeader.ClaimLine.RenderingProviderId": 1
    }
}]
)

SETUP GUIDE
===========

Ensure that you have python3 and the venv module installed at
the system level. E.g., in an Ubuntu/Debian system:

```
# sudo apt install python3-venv
```

Within this foder, create a new Virtual Environment so that
you can install required python packages:

```
# cd cleanroom/demo
# python3 -m venv venv
```

It is important that you name the virtual environment `venv`.
That name is in our `.gitignore` to ensure that we don't check
in the binary virtual environment to Git. So be sure to use the
exact command above from within the `demo` folder.

In order to run the scripts, first activate the virtual
environment, which will place the correct libraries on your
python path for this shell:

```
# . venv/bin/activate
```

You can exit the virtual environment by running `deactivate`.

On your first usage of the scripts, install required libraries:

```
# pip install -r requirements.txt
```

Generate fake memeber records, one per line, by running:

Note that the fake data expects the following:
Members ranging from 1-65M
Providers ranging from 1-1M
Claims ranging from 1-500M
Policies ranging from 1-65M

```
# python fake-data.py model-tables/<model>.csv <# of loops of batch inserts> <# of records to batch> <starting id> "mongodb://<username>:<password>@<shard0>:27017,<shard1>:27017,<shard2>:27017/test?replicaSet=<replset name>&ssl=true&authSource=admin" <db name> <collection name>
```

Here is an example of a utility script to run multiple threads in parallel to load all the data.

```
# ./fake-data-loader.sh <csv model name without the path of model-tables> <# of parallel threads> <# of loops of batch inserts> <# of records to batch> "mongodb://<username>:<password>@<shard0>:27017,<shard1>:27017,<shard2>:27017/test?replicaSet=<replset name>&ssl=true&authSource=admin" <db name> <collection name>
```
