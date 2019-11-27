# param 1 is which model, e.g. member.csv
# param 2 is how many threads in parallel, e.g. 6
# param 3 is number of bulk insert loops
# param 4 is number of inserts per bulk insert
# param 5 is url to cluster
# param 6 is db name
# param 7 is cluster name

startCount=1

# Make a loop based on number of threads
echo "Number of threads: $2"
for i in $(seq 1 $2)
do
   echo "Start Count: $startCount"
   startCount=$( expr $3 '*' $4 + $startCount )
   python3 fake-data.py model-tables/$1 $3 $4 $startCount "$5" $6 $7 &
done
