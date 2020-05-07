# nmap Port Scanning

There are two technique to "Port Specification" in nmap:

1. Explicitly using the "-p" flag
2. By reference using nmap-services

## The "-p" flag

We can specify:

* single port: 443
* list of ports: 80,43,8080
* range of ports:
    * 135-139 ;  all ports from 135 to 139
    * -1024 ;  all ports from 1 to 1024
    * - ; all ip addresses, which is analogous to 1-65535
* protocol:
  * U:53; udp scan on port 53
  * T:25; tcp scan on port 25


## The nmap-services

The nmap-services file is a file containing a list of ports with
associated services, and a value representing the probability of
finding that port opened. We can make nmap-services port
specifications by:

* name: ftp
* wildcard: `http*` #all the services who contains http
* top ports: we can try to see the top "n" ports (e.g., 5 ports) by doing a:
  * --top-ports 5
* port ratio: we specify the frequency range in this case

It has to be noted that by default nmap will execute a " --top-ports 1000",
so it will make scans on the top 1000 ports opened.
Remember that port specifications can be combined, for example:

* -p 80,443,8080-8089
* -p http,`ftp*`,25
* -p U:53, 123, 161 T:1-1024,3306


