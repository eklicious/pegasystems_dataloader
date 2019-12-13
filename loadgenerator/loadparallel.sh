#!/bin/bash
# Param 1: # of bulk curl commands to run
# Param 2: total # of parallel jobs you want to run
# Param 3: # of Gnu Parallel jobs to run, 0 means as many as possible, otherwise, use a number that makes sense for your vm cores
# Param 4: base url for node app
# Param 5: max provider id
# Param 6: max member id required by the node app server
# Param 7: max claim id
# Param 8: claim version id
# Note that you can kick this job off multiple times to really stress test the system, e.g.
# ./loadparallel.sh 100 2000 10 http://pega6.us-east-1.elasticbeanstalk.com 500000
# ./loadparallel.sh 100 2000 10 http://pega6.us-east-1.elasticbeanstalk.com 500000
# For ec2, you can install parallel using http://git.savannah.gnu.org/cgit/parallel.git/tree/README
# You need to test with -j0 for a single command to see what the VM file limits are and then modify the hard limit to be something higher
# Follow this to set the file-max and the nofile system params:
#     https://glassonionblog.wordpress.com/2013/01/27/increase-ulimit-and-file-descriptors-limit/
# I set the file-max to be 1000000 and the nofile limit to be 60000 but you are welcome to try different and higher values
# in the limits.conf, you need to also set nproc so we can adjust ulimit -u later on, e.g.
#* soft nofile 60000
#* hard nofile 60000
#* soft nproc  50000
#* hard nproc  50000
# After running sudo reboot, you need to execute ulimit -u 2000 or something to boost the max processes

callCurlParallel () {
   array=();
   for i in $(seq 1 $1)
   do
      array+=(--next --output /dev/null --silent --request GET $4 );
   done
   seq $2 | parallel -j$3 curl ${array[@]} &
}

echo "Getting providers"
callCurlParallel $1 $2 $3 $4/pega/provider/$5
echo "Updating providers"
callCurlParallel $1 $2 $3 $4/pega/provider/update/$5
echo "Getting members"
callCurlParallel $1 $2 $3 $4/pega/member/$6
echo "Updating members"
callCurlParallel $1 $2 $3 $4/pega/member/update/$6
echo "Getting member policies"
callCurlParallel $1 $2 $3 $4/pega/memberPolicy/$6
echo "Updating member policies"
callCurlParallel $1 $2 $3 $4/pega/memberPolicy/update/$6
echo "Getting claims"
callCurlParallel $1 $2 $3 $4/pega/claim/$7
echo "Updating claims"
callCurlParallel $1 $2 $3 $4/pega/claim/update/$7
# echo "Adding claims"
# callCurlParallel $1 $2 $3 $4/pega/claim/add/$8
