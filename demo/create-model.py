import csv
import sys
import uuid
import os
import itertools
import re

stripProp = lambda str: re.sub(r'\s+', '', (str[0].upper() + str[1:].strip('()')))

def createClass(typeName, topLevel):
    os.makedirs("healthcare/classes", exist_ok=True)
    with open("healthcare/classes/%s.json"%typeName, "w") as clazz:
        clazz.write("""
{
  "name": "%s",
  "type": "Class",
  "uuid": "%s",
  "parent": "Baseclass",
  "topLevel": %s,
  "keys":  []
}
        """%(typeName, uuid.uuid4(), topLevel))

def createProp(applyTo, name, propType):
    os.makedirs("healthcare/fields/%s"%applyTo, exist_ok=True)
    with open("healthcare/fields/%s/%s.json"%(applyTo, name), "w") as field:
        field.write("""
{
  "type": "Field",
  "name": "%s",
  "fieldType": "%s",
  "definedOn": "%s",
  "visibility": "GLOBAL",
  "association": "ONE",
  "edge": {
    "type": "OWNED"
  },
  "uuid": "%s",
  "module": {
    "name": "Healthcare",
    "version": 1
  }
}
        """%(name, propType, applyTo, uuid.uuid4()))

scalars = {
  'STRING': 'TEXT',
  'DATE': 'DATE',
  'TRUE/FALSE': 'TRUE_FALSE',
  'BOOLEAN': 'TRUE_FALSE',
  'ARRAY STRINGS': 'LIST{TEXT}',
  'INTEGER': 'INTEGER',
  'DOUBLE': 'DOUBLE'
}

with open(sys.argv[1]) as csvfile:
    propreader = csv.reader(itertools.islice(csvfile, 1, None))
    for row in propreader:
        path = row[0].split('.')
        applyTo = 'Baseclass'
        print(row)
        for element in path[0:-1]:
            typeName = stripProp(element)
            topLevel = "true" if applyTo is 'Baseclass' else "false"
            createClass(typeName, topLevel)
            if applyTo != 'Baseclass':
                propType = "LIST{%s}"%typeName if element.endswith("()") else typeName
                createProp(applyTo, typeName, propType)
            applyTo = typeName
        createProp(applyTo, stripProp(path[-1]), scalars[row[1].upper().strip()])
