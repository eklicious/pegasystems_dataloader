# Param 1: base url for node app
# Param 2: number of iterations per thread
# Param 3: claim version id
# Param 4: max member id
# Param 5: max claim id
# Param 6: max provider id
# Param 7: max member policy id
# Param 8: number of threads to run in parallel

# Make a loop based on number of threads
echo "Number of threads: $8"
for i in $(seq 1 $8)
do
   ./load.sh $1 $2 $3 $4 $5 $6 $7 &
done

