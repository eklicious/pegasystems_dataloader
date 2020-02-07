MAKE SURE YOUR ENV VARS ARE SET CORRECTLY!
NOTE: Everything needs to run using node 10.17 and not 11+ so we can deploy to AWS Beanstalk

###################################

To test locally, you can run the following command with the proper variables set:

SRV="mongodb+srv://<username>:<password>@<srv>/test?retryWrites=true&w=majority" DB=test_pega CLAIM=claims MEMBER=members MEMBERPOLICY=memberpolicies PROVIDER=providers npm start

Then launch a browser and point it to localhost:3000 with the appropriate route.

###################################

To deploy nodejs app to AWS beanstalk:

1. Build the package by running 
zip -r --exclude=node_modules/* loadgenerator.zip .
Move this elsewhere to upload to beanstalk.
2. I had to create a .npmrc file to get past some node-sass error about making a directory
3. When configuring EB, you need to select the appropriate security group and pem key access if you want to troubleshoot.
4. Need to add VPC too for anything that's not t1.micro
5. They also say to use t3.small and not t1.micro
6. You also need to make sure the security group for beanstalk instance allows for port 3000
7. Remove Nginx web server from EB
8. Change the npm start command to be npm start else it won't launch the right node process
9. Make sure to set the environment variable SRV, e.g. export SRV=mongodb+srv://<user>:<password>@<srv>/test?retryWrites=true
So the pega route can use this variable to connect to the db

###################################

To stress test the nodejs app:

load.sh is a single script that will loop through the standard set of operations in a single thread.
loadmulti.sh will spawn off numerous threads of load.sh

