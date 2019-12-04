#!/bin/bash
# 2 parameters. base url and number of iterations...

for i in $(seq 1 $2)
do
    curl --request GET $1/pega/member/50000000 &

done

