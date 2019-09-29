

OS versioning can be very useful for several reasons, such as:
network inventory, support/patching, discover unauthorized
devices, etc...

OS Detection is enabled with the option "-O", and it better works
if on the system there is at least one closed and one opened
port, a useful option with this, can be to add the "-v" to be
verbose. Other useful options related to OS detection are:

* --osscan-limit #this will disable OS detection if no at least
  one closed and one opened ports are found, so we'll speed up
  the whole scan process of nmap
* --osscan-guess, --fuzzy #these options tell nmap to be more
  aggressive when trying to retrieve the operating system
* --max-os-tries num #this sets the maximum number of attempts
  done by nmap to identify the OS (default=5)

So let's say we have identified an opened and a closed port,
which are respectively the open port 80 and the closed port 81,
now to make a fast OS detection exploit the knowledge of these
ports and do a:

```sh
 nmap -O -v -p 80,81 192.168.1.50
 # we added even the "-v" to be verbose, and gather more
 # information from the output
```

