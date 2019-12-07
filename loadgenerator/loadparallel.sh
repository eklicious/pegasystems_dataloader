#!/bin/bash
# Param 1: # of iterations
# Param 2: base url for node app
# Param 3: claim version id
# Param 4: max member id
# Param 5: max claim id
# Param 6: max provider id
# Param 7: max member policy id
# Note that you can kick this job off multiple times to really stress test the system, e.g. 
# ./loadparallel.sh 3000 http://pega6.us-east-1.elasticbeanstalk.com 0 5900000 49660000 100000 6000000 10
# ./loadparallel.sh 3000 http://pega6.us-east-1.elasticbeanstalk.com 0 5900000 49660000 100000 6000000 10
# For ec2, you can install parallel using http://git.savannah.gnu.org/cgit/parallel.git/tree/README
# You need to test with -j0 for a single command to see what the file limits are and then modify the hard limit to be something higher
# Follow this to set the file-max and the nofile: https://glassonionblog.wordpress.com/2013/01/27/increase-ulimit-and-file-descriptors-limit/
# I set the file-max to be 1000000 and the nofile limit to be 60000
# in the limits.conf, you need to also set nproc to adjust ulimit -u, e.g.
#* soft nofile 60000
#* hard nofile 60000
#* soft nproc  50000
#* hard nproc  50000
# After sudo reboot, you need to execute ulimit -u 2000 or something to boost the max processes
# https://gerardnico.com/os/linux/limits.conf - not sure this is right
# There's no need setting the cores because the file limit limitation will restrict how much cpu gets allocated

array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/member/$4 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/member/update/$4 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/member/update/$4 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/claim/$5 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/claim/$5 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/claim/update/$5 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/claim/update/$5 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/claim/add/$3 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/claim/add/$3 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/provider/$6 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/provider/$6 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/provider/update/$6 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/provider/update/$6 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/memberPolicy/$7 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/memberPolicy/$7 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &

#seq $1 | parallel -j$8 curl --output /dev/null --silent --request GET $2/pega/memberPolicy/update/$7 &
array=();
for i in {1..70}; do
  array+=(--next --output /dev/null --silent --request GET $2/pega/memberPolicy/update/$7 ) ;
done;
seq $1 | parallel -j$8 curl ${array[@]} &
