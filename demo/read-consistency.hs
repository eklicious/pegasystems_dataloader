#!/bin/bash

#awslogs get /ecs/fnx-kendm-task-oms ALL -s $1 -G -S --timestamp > oms.txt
#awslogs get /ecs/fnx-kendm-etl ALL -s $1 -G -S --timestamp > etl.txt
docker logs demo_oms_1 > oms.txt
docker logs demo_etl_1 > etl.txt

#grep -h IngestTrace oms.txt etl.txt | sort > combined.txt
grep -h IngestTrace oms.txt etl.txt | sort | tail -n$1 > combined.txt
python3 parse-logs.py | awk -f tally-consistency.awk

tail -n1 combined.txt

# Cleanup
rm oms.txt etl.txt combined.txt
