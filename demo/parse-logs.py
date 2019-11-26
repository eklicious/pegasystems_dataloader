from collections import defaultdict
import dateutil.parser


data = defaultdict(dict)

#print('Key\tPut Time\tLock Delay\tLock Time\tCommit Time\tConsistent Delay\tConsistent Time')

with open("combined.txt") as logfile:
    for row in logfile:
        fields = row.split('\t')
        timestamp = dateutil.parser.parse(fields[0].split(' ')[0])
        idkey = fields[0].split(' ')[-1]
        msg = fields[1]
        data[idkey][msg] = int(fields[2])
        # 'PUT_START': 1553050381339, 'PUT_COMPLETE': 1553050381539, 'LOCK_START': 1553050387833, 'LOCK_COMPLETE': 1553050388041, 'COMMIT': 1553050388151, 'CONSISTENT_START': 1553050388152, 'CONSISTENT_COMPLETE': 1553050388277}})
        if len(data[idkey]) == 7:
            print("%s\t%d\t%d\t%d\t%d\t%d\t%d"%(
                    idkey,
                    data[idkey]['PUT_COMPLETE'] - data[idkey]['PUT_START'],
                    data[idkey]['LOCK_START'] - data[idkey]['PUT_START'],
                    data[idkey]['LOCK_COMPLETE'] - data[idkey]['LOCK_START'],
                    data[idkey]['COMMIT'] - data[idkey]['PUT_START'],
                    data[idkey]['CONSISTENT_START'] - data[idkey]['PUT_START'],
                    data[idkey]['CONSISTENT_COMPLETE'] - data[idkey]['CONSISTENT_START']
                ))
