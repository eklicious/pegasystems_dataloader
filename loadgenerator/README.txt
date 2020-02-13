MAKE SURE YOUR ENV VARS ARE SET CORRECTLY!
NOTE: For this demo, I used Node 10.17 to match what was available in Elastic Beanstalk. As of 2/12/2020, EB now supports 12.14.1 so you may be able to use a high version. 

###################################
# LOCAL DEVELOPMENT
###################################

To test locally, you can run the following command with the proper variables set:

SRV="mongodb+srv://<username>:<password>@<srv>/test?retryWrites=true&w=majority" DB=test_pega CLAIM=claims MEMBER=members MEMBERPOLICY=memberpolicies PROVIDER=providers npm start

Then launch a browser and point it to localhost:3000 with the appropriate route, e.g. http://localhost:3000/pega/transaction/6000000/50000000/100000.

###################################
# AWS ELASTIC BEANSTALK DEPLOYMENT
###################################

Note: I had to create a .npmrc file to get past some node-sass error about making a directory.

To deploy the nodejs app to AWS beanstalk:

1. Build the package by running from within the same directory as this readme file 
zip -r --exclude=node_modules/* loadgenerator.zip .
Move this zip file elsewhere to upload to beanstalk.
2. Configure EB
   a. select "Web server environment". 
   b. Preconfigured platform: Node.js
   c. Upload your code - upload your zip file from step 1
   d. Configure more options. Note, I believe you can skip the 'Instances' config because once you set up 'Network', it will auto-set it up for you.
      i. Configuration Presets: Custom configuration
      ii. Software
         a. Proxy server: None
         b. Node.js version: 10.17.0
         c. Node command: npm start
         d. Environment Properties, e.g. SRV, DB, CLAIM, MEMBER, etc., that the nodejs app requires
      iii. Capacity
         a. Environment Type: Load balanced
         b. Instance type: select the right size nodes
      iv. Security
         a. EC2 key pair: pick a key pair if you want to be able to log onto the vm's
      v. Network
         a. VPC: specify a valid VPC
         b. Load balancer subnets, e.g. us-east-1a
         c. Instance subnets, e.g. us-east-1a
3. Test
   a. Get the EB url and test one of the nodejs end points, e.g. http://pega.us-east-1.elasticbeanstalk.com/pega/member/update/100. This should return a successful response and it should update a random record in the db for a member if your env vars are set correctly.

###################################
# EXECUTE LOAD GENERATOR
###################################

To stress test the local or deployed nodejs app:

load.sh is a single script that will loop through the standard set of operations in a single thread.
loadmulti.sh will spawn off numerous threads of load.sh
loadparallel.sh will run curl commands in bulk multithreaded and use GNU parallel. This is the script to use to maximize load testing.

