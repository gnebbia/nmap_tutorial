# Target Expansion

We can express targets in various ways:

* single address: 192.168.1.50
* host name: ftp.example.com
* list of addresses: 192.168.54,55.1,10;in this case the scanned
  ip addresses are: 192.168.54.1, 192.168.54.10, 192.168.55.1,
  192.168.55.10
* range of addresses:

  * 192.168.64.20-29 #in this case all addresses from 20 to 29
    will be scanned
  * 172.16.-4.1 #in this case all addresses 172.16.0.1,
    172.16.1.1, 172.16.2., 172.16.3.1,172.16.4.1 will be scanned
  * 10.-.20.1 #in this case all the addresses with this structure
    the the second part of the address as a number from 0 to 255
    will be scanned
  * CIDR (Classless Interdomain Routing): 192.168.128.240/29 #in
  this case the last two digits represent the subnet mask, who
  let us understand which part of the ip address makes up the
  host and which part of the address makes up the network

Even combinations of the target expansions are available, we just
separate them with a space, for example:

* 172.16-32.-.1,254 (using both ranges and lists)
* 192.168.56.12 webmail.example.com (ip address and dns name)
* ...

If we want to expand the list of scanned ip, we can do:
```sh
 nmap -sL 192.168.1.56/29
 # this command will list all the ip
 # which will be scanned by specifying the mentioned target
 # expansion, in this case nmap won't try to see if the hosts are
 # up or not, and won't perform any port scan, but will just list
 # the ip mentioned in the expansion and try to resolve names through DNS
```
If we also want to avoid any kind of DNS resolution and just have a list
of IP addresses we can do:
```sh
nmap -n -sL 192.168.1.56/29
```

to pass a large list of targets to nmap, we can use:

```sh
 nmap -iL filename
 # where filename is the name of the file
 # containing the hosts, targets in the file can be expanded by
 # spaces, tabs or newlines
```
we can run:

```sh
 nmap -p 80 www.ibm.com
 # this will make a scan on the mentioned
 # website and on the mentioned port, this will also perform a
 # reverse dns lookup, to see if the two website match or don't
```
anyway the reverse DNS resolution are heavy, and will take their
time, to avoid doing rDNS we must add the "-n" flag to nmap,
while there are other cases where we want to make a reverse DNS
for all the targets, even the not alive targets, in this case we
add the "-R" flag.

