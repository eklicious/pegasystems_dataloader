#!/bin/bash

python3 fake-data.py model-tables/provider.1m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega providers
python3 fake-data.py model-tables/member.65m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega members
python3 fake-data.py model-tables/member-policy.65m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega memberpolicies
python3 fake-data.py model-tables/claim.500m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega claims

