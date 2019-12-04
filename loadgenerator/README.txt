MAKE SURE TO UPDATE ROUTES/PEGA.JS WITH THE CORRECT DB SRV!
build the package by running 
zip -r --exclude=node_modules/* loadgenerator.zip .
Move this elsewhere to upload to beanstalk.
Everything needs to run using node 10.17 and not 11+
I had to create a .npmrc file to get past some node-sass error about making a directory
When configuring EB, you need to select the appropriate security group and pem key access if you want to troubleshoot.
Need to add VPC too for anything that's not t1.micro
They also say to use t3.small and not t1.micro
You also need to make sure the security group for beanstalk instance allows for port 3000
Remove Nginx web server from EB
Change the npm start command to be npm start else it won't launch the right node process
Make sure to set the environment variable SRV, e.g. export SRV=mongodb+srv://<user>:<password>@<srv>/test?retryWrites=true
So the pega route can use this variable to connect to the db

load.sh is a single script that will loop through the standard set of operations in a single thread.
loadmulti.sh will spawn off numerous threads of load.sh
