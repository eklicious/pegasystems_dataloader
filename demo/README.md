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

Generate 10 fake memeber records, one per line, by running:

```
# python fake-data.py model-tables/member.csv 10
```
