#!/bin/bash
# Param 1: base url for node app
# Param 2: number of iterations
# Param 3: claim version id
# Param 4: max member id
# Param 5: max claim id
# Param 6: max provider id
# Param 7: max member policy id

for i in $(seq 1 $2)
do
    curl --request GET $1/pega/member/$4
    curl --request GET $1/pega/member/update/$4
    curl --request GET $1/pega/claim/$5
    curl --request GET $1/pega/claim/update/$5
    curl --request GET $1/pega/claim/add/$3
    curl --request GET $1/pega/provider/$6
    curl --request GET $1/pega/provider/update/$6
    curl --request GET $1/pega/memberPolicy/$7
    curl --request GET $1/pega/memberPolicy/update/$7
done
