# Interaction test 2: get claim, get provider, sleep, update claim, update provider
# Param 1: base url for node app
# Param 2: max claim id required by the node app server
# Param 3: max provider id

curl --next --output /dev/null --silent --request GET $1/pega/claim/$2 --next --output /dev/null --silent --request GET $2/pega/provider/$3

sleepTime=$(( ( RANDOM % 100 )  + 1 ))
echo "Sleeping $sleepTime secs for interaction 2"
sleep $sleepTime

curl --next --output /dev/null --silent --request GET $1/pega/claim/update/$2 --next --output /dev/null --silent --request GET $2/pega/provider/update/$3
