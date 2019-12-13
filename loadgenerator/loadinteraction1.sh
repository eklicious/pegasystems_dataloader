# Interaction test 1: get member, get memberpolicy, sleep, update member, update memberpolicy
# Param 1: base url for node app
# Param 2: max member id required by the node app server

curl --next --output /dev/null --silent --request GET $1/pega/member/$2 --next --output /dev/null --silent --request GET $2/pega/memberPolicy/$2

sleepTime=$(( ( RANDOM % 100 )  + 1 ))
echo "Sleeping $sleepTime secs for interaction 1"
sleep $sleepTime

curl --next --output /dev/null --silent --request GET $1/pega/member/update/$2 --next --output /dev/null --silent --request GET $2/pega/memberPolicy/update/$2
