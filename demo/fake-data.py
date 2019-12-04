import pymongo
from bson.json_util import loads, dumps
from bson import json_util
import csv
import sys
import uuid
import os
import itertools
from faker import Faker
from collections import defaultdict
import json
import datetime
from deepmerge import Merger
import random
import re
'''
Sample invocation:
 python3 fake-data.py model-tables/claim.50m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega claims
 python3 fake-data.py model-tables/provider.1m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega providers
 python3 fake-data.py model-tables/member.6m.csv 3 5 1000 "mongodb://localhost:27017/test" test_pega members
'''


stripProp = lambda str: re.sub(r'\s+', '', (str[0].upper() + str[1:].strip('()')))
fake = Faker()

def ser(o):
    # This serializer isn't needed anymore as long as we use faker.datetime.datetime instead of datetime.date
    """Customize serialization of types that are not JSON native"""
    if isinstance(o, datetime.date):
        return str(o)

def procpath(path, counts, generator):
    """Recursively walk a path, generating a partial tree with just this path's random contents"""
    stripped = stripProp(path[0])
    if len(path) == 1:
        # Base case. Generate a random value by running the Python expression in the text file
        return { stripped: eval(generator) }
    elif path[0].endswith('()'):
        # Lists are slightly more complex. We generate a list of the length specified in the
        # counts map. Note that what we pass recursively is _the exact same path_, but we strip
        # off the ()s, which will cause us to hit the `else` block below on recursion.
        return {
            stripped: [ procpath([ path[0].strip('()') ] + path[1:], counts, generator)[stripped] for X in range(0, counts[stripped]) ]
        }
    else:
        # Return a nested page, of the specified type, populated recursively.
        return {
            stripped: {
                'Baseclass': { 'Type': stripped },
                stripped: procpath(path[1:], counts, generator)
            }
        }

def zipmerge(the_merger, path, base, nxt):
    """Strategy for deepmerge that will zip merge two lists. Assumes lists of equal length."""
    return [ the_merger.merge(base[i], nxt[i]) for i in range(0, len(base)) ]


#-------------------- MAIN --------------------------#
template_file = sys.argv[1]
num_records = int(sys.argv[2])
bulk_count = int(sys.argv[3])
baseCounter = int(sys.argv[4])
mdb_conn = sys.argv[5]
database = sys.argv[6]
collection = sys.argv[7]
id_map = defaultdict(int)
# Set up the mdb objects
client = pymongo.MongoClient(mdb_conn)
db = client[database]
coll = db[collection]

def ID(key):
    id_map[key] += 1
    return key + str(id_map[key]+baseCounter)

# A deep merger using our custom list merge strategy.
merger = Merger([
    (dict, "merge"),
    (list, zipmerge)
], [ "override" ], [ "override" ])


for N in range(0, num_records): # iterate through the loop count
    # instantiate a new list
    members = []

    for J in range(0, bulk_count): # iterate through the bulk insert count
        # A dictionary that will provide consistent, random list lengths
        counts = defaultdict(lambda: random.randint(1, 5))
        data = {}
        with open(template_file) as csvfile:
            propreader = csv.reader(itertools.islice(csvfile, 1, None))
            for row in propreader:
                path = row[0].split('.')
                partial = procpath(path, counts, row[3])
                #print(partial)
                # Merge partial trees.
                data = merger.merge(data, partial)
        data = list(data.values())[0]

        # Standard header
        id = uuid.uuid4()
        idempotencyKey = uuid.uuid4()
        obj = {
            'id': str(id),
            'idempotencyKey': str(idempotencyKey),
            'version': '1',
            'type': data['Baseclass']['Type']
        }
        obj['data'] = data

        # db.members.insert_one(obj)

        # To JSON!
        # print("%s\t%s\t%s"%(str(id), str(idempotencyKey), json.dumps(obj, default=ser)))
        # print(json.dumps(obj, default=ser))

        # Add the object to our members list
        # members.append(json.loads(json.dumps(obj, default=ser)))
        members.append(obj)

    print("Bulk Insert Iteration: ", N)
    # Now do the bulk insert
    coll.insert_many(members)
