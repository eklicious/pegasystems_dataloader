# Param 1: total # of parallel jobs you want to run
# Param 2: # of Gnu Parallel jobs to run, 0 means as many as possible, otherwise, use a number that makes sense for your vm cores
# Param 3: base url for node app
# Param 4: max member id required by the node app server
# Param 5: max claim id
# Param 6: max provider id

seq $1 | parallel -j$2 ./loadinteraction1.sh $3 $4 &
seq $1 | parallel -j$2 ./loadinteraction2.sh $3 $5 $6 &
