import csv
import sys
import uuid
import os
import itertools
import multiprocessing
from bson.objectid import ObjectId
from faker import Faker
from collections import defaultdict
import json
import datetime
from deepmerge import Merger
import random
import re

id_map = defaultdict(int)
stripProp = lambda str: re.sub(r'\s+', '', (str[0].upper() + str[1:].strip('()')))
fake = Faker()
num_records = 0

def ser(o):
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

def ID(key):
    id_map[key] += 1
    return key + str(id_map[key])

def n_loader(range_start,range_end):
    # A deep merger using our custom list merge strategy.
    merger = Merger([
        (dict, "merge"),
        (list, zipmerge)
    ], [ "override" ], [ "override" ])

    for N in range(0, range_end): # Generate the numer specified by the user
        # A dictionary that will provide consistent, random list lengths
        counts = defaultdict(lambda: random.randint(1, 5))
        data = {}
        with open(sys.argv[1]) as csvfile:
            propreader = csv.reader(itertools.islice(csvfile, 1, None))
            for row in propreader:
                path = row[0].split('.')
                partial = procpath(path, counts, row[3])
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

        # To JSON!
        print("%s\t%s\t%s"%(str(id), str(idempotencyKey), json.dumps(obj, default=ser)))


####
#  BJB - Added for MultiProc
# Main start function
####
def main():
    print('')
    num_records = int(sys.argv[2])
    if len(sys.argv) < 0:
        print('Error: Insufficient command line parameters provided')
        print_usage()
    else:
        start = datetime.datetime.now()
        print("#--------------------------------------------------#")
        print(f'#  Data Load')
        print(f'#  Start: {start}')
        print("#--------------------------------------------------#")
        connection = pymongo.MongoClient(mongodb_url)
        db = connection[database]
        cursor = db[restaurants].find({"people" : { "$exists" : False}}) #.limit(3)
        collection_size = cursor.count()
        n_cores = 7                # number of splits (logical cores of the CPU-1)
        #batch_size = round(collection_size/n_cores+0.5)
        #skips = range(0, n_cores*batch_size, batch_size)
        skips = range(0, num_procs*batch_size, batch_size)

        processes = [ multiprocessing.Process(target=load_data, args=(skip_n,batch_size)) for skip_n in skips]

    for process in processes:
        process.start()

    for process in processes:
        process.join()
        load_data()
        print("#--------------------------------------------------#")
        end = datetime.datetime.now()
        print(f'#  End: {end} elapsed: {end - start}')

####
# Main
####
if __name__ == '__main__':
    main()
