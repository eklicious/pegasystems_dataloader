# Welcome to Project Cleanroom

![Logo](cleanroom.png)

Cleanroom is a prototype implementation of the rules engine that allows engineers
to try out new ideas without having to work around current engine code. This
repository is not intended to replace the engine. Instead, we will use this
space to prototype new ideas so that we can incrementally apply the successful
ones to mainline development.

Build out documentation by running `./gradlew bake`

# On this branch, Cleanroom is going through a MAJOR REFACTOR. Prior instructions and code may not work. Use master if you require a stable repo.

# Bring up a demo Cleanoom

**Build the Docker images for the various parts of Cleanroom** by running the Gradle `docker` task (from the root 
`cleanroom` directory).

**Start up all the parts of Cleanroom** using Docker Compose and the `docker-compose.yml` compose file or the 
`debug-compose.yml` compose file in `demo`.  These are the same, except the "debug" version exposes the ports for the various services to the 
outside world.  


# Unit tests

At least some of the unit tests require Cleanroom to be up and running, with various service ports exposed.  This can
be done using the `debug-compose` Docker Compose file as described in the previous section.

# JMeter demo

A JMeter script can be used to make many "save" requests to Cleanroom.  

**Make sure you have Python installed and generate a "fake data" file containing JSON representations for a number of 
Instances** as described [here](demo/README.md).

On the last step, when you use `fake-data` to actually generate the instances, redirect the output to a file named
`demo/member-ingest-data.txt`.

**Feed the instances from the "fake data" file into Cleanroom** using the JMeter script 
`demo/member-ingest-test.jmx`.

---

_[Cleanroom icon](https://thenounproject.com/term/cube/197684/) created by
[Gregor Cresnar](https://thenounproject.com/grega.cresnar) from
the Noun Project and shared under the
[Creative Commons License 3.0](https://creativecommons.org/licenses/by/3.0/)._
