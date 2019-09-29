
## Service Versioning


From the results we have gathered until now, we only got as
information the open port with a general description of the
service, in this section, we want to inspect the services in a
better way. What we are interested in is:

* Service Protocol
* Application Name
* Version Number
* Hostname
* Device Type
* OS family

Versioning can also be used to let us solve abiguity some times,
as for example as some ports can be open/filtered, we can solve
these kind of doubts. Version detection is enabled by the flag "
-sV", optionally we can even include a:

* `--version-intensity <0-9>`, with -sV it uses a default which
  is equal to 7

where:

* `--version-light`, it is equivalent to a version intensity option
  with a value of 2
* `--version-all` it is equivalent to a version intensity option
  with a value of 9

Versioning can take a lot of time, so we should use it with care;
nad it is preferred to run the service versioning, on a single
port at a time, in the other case, it will take too much time.

