SETUP GUIDE
===========

Ensure that you have python3 and the venv module installed at
the system level. E.g., in an Ubuntu/Debian system:

```
# sudo apt install python3-venv
```

Within this foder, create a new Virtual Environment so that 
you can install required python packages:

```
# cd cleanroom/demo
# python3 -m venv venv
```

It is important that you name the virtual environment `venv`. 
That name is in our `.gitignore` to ensure that we don't check 
in the binary virtual environment to Git. So be sure to use the 
exact command above from within the `demo` folder.

In order to run the scripts, first activate the virtual 
environment, which will place the correct libraries on your 
python path for this shell:

```
# . venv/bin/activate
```

You can exit the virtual environment by running `deactivate`.

On your first usage of the scripts, install required libraries:

```
# pip install -r requirements.txt
```

For AWS EC2 setup, here are the commands I ran to get running.
    5  sudo yum install python3
    6  python3
    7  curl -O https://bootstrap.pypa.io/get-pip.py
    8  python3 get-pip.py --user
   10  pip --version
    exit shell and scp demo.zip...
   13  unzip demo.zip
   14  cd demo
   23  pip install -r requirements.txt --user

Generate fake memeber records, one per line, by running:

Note that the fake data expects the following:
Members ranging from 1-65M
Providers ranging from 1-1M
Claims ranging from 1-500M
Policies ranging from 1-65M

```
# python fake-data.py model-tables/<model>.csv <# of loops of batch inserts> <# of records to batch> <starting id> "mongodb://<username>:<password>@<shard0>:27017,<shard1>:27017,<shard2>:27017/test?replicaSet=<replset name>&ssl=true&authSource=admin" <db name> <collection name> 
```

Here is an example of a utility script to run multiple threads in parallel to load all the data.

```
# ./fake-data-loader.sh <csv model name without the path of model-tables> <# of parallel threads> <# of loops of batch inserts> <# of records to batch> "mongodb://<username>:<password>@<shard0>:27017,<shard1>:27017,<shard2>:27017/test?replicaSet=<replset name>&ssl=true&authSource=admin" <db name> <collection name>
```
