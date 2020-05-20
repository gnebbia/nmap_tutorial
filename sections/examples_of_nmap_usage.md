# nmap: Usage Examples

Let's see now a real case example of NMAP usage, the first thing
we do is:

```sh
 ifconfig
 # this will let us understand which is the network and which is the
 # subnet mask on the interested interface, from these
 # informations we can deduce which is the network address, let's
 # take as example that our inet addr is 192.168.25.221 and that
 # the subnet is 255.255.255.0
```

now the first thing to do is to find the other hosts on our
network:

```sh
 nmap -sn -n 192.168.25.0/24
 # in this case, we:
 # disabled port scanning with "-sn";
 # we disabled host name resolution with "-n", 
 # in this way we get quickly the list of live hosts on the
 # network, we didn't specify any specific option for host
 # enumeration, since we are doing this operation in a local
 # network, so no matter which options we would have used, it
 # always relies on the ARP, so this basic host enumeration
 # technique in LAN is more than fine!
```

now the results can be better disaplayed with the help of awk,
for example we could have done:

```sh
 nmap -sn -n 192.168.25.0/24 | awk '/scan report/ {print $5}' > ip.lst
 # in this way we get a simple list of live hosts and save the list into a file
```

now in a real case we should audit all the machines in this list,
but is not useful to repeat all the operations for all the hosts,
let's see a scan on one host, the others will be very similar.

Now for our example let's say we are interested in another remote
branch of the network which is the network 192.168.130.0, we'll
run an nmap scan for that network, with:

```sh
 nmap -sn -n 192.168.130.0/24 | awk '/scan report/ {print $5}' > ip.lst
 # in this way we get a simple list of live hosts and save the list into a file
```

now if we do a traceroute and the HOP is 1, that means that we
are directly connected to that host; indeed in our case if we do:

```sh
 nmap -p 80 --traceroute 192.168.25.244
 # since the host is in the same network, we see only a single hop
```
if we do instead:

```sh
 nmap -p 80 --traceroute 192.168.130.254
 # so we nmap another
 # network with traceroute, we'll see different hops, relating to
 # the different host on which the traffic goes, the first hop is
 # our router, and the last hop is the arrival
```
now we run our port scan against the list of IPs we have
collected with, we first will start with a TCP scan:

```sh
 nmap -sS -iL ip.lst -oN ports.tcp
 # in this case we do a TCP
 # scan with the "half-open scan" technique using the "-sS"
 # option, and we specify a file with hosts with "-iL" option, and
 # we output the results to a "normal" file with the "-oN" option
```

now execute a UDP scan with:

```sh
 nmap -sU -iL ip.lst -oN ports.udp
 # in this case we do a UDP
 # scan using the "-sU" option, and we specify a file with hosts
 # with "-iL" option, and we output the results to a "normal" file
 # with the "-oN" option
```

Now let's say we notice two systems with an interesting number of
ports opened, let's say the machine 102.168.130.99 with opened
ports 22,80,443,8080 and the 192.168.130.101 with
135,445,3389,5800,5900,8194 and let's say that we want to
identify the OS version of the 192.168.130.99 machine and the
services versions, we'll do:

```sh
 nmap -p 22,80,443,8080,8081 -sV -O 192.168.130.99 | less
 # in this case we specified all the open ports plus an additional
 # closed port (we hope that is closed) since as we said in the
 # previous sections, in order to do a good software version
 # retrieval we must give to the port scanner at least an opened
 # port and at least a closed port, after we specify service
 # version inspection with "-sV" and OS inspection with "-O"
```

now if we don't get an exact match, we may use some scripts as:

```sh
 nmap -p 80 --script http-headers 192.168.130.99
 # this scan will give sometimes some indication on the system we are testing
 # if we get nothing, we'll try on port 8080
```

```sh
 nmap -p 8080 --script http-headers 192.168.130.99
```

if we didn't get much info, or these weren't of any help, we can
try other scripts such as:

```sh
 nmap -p 8080 --script http-enum 192.168.130.99
 # in this way we even find out some interesting folders
```

if we don't get any useful info we can try with:

```sh
 nmap -p 8080 --script http-title 192.168.130.99
 # usually here we'll find some info
```

```sh
 sudo nmap --script "vuln and not (dos or exploit or intrusive)" www.22hits.com
```

in our case the last script gave "March Networks Command Client",
if we seach this on the internet we find out, that this is some
recording system.

To execute all vuln scripts in order to see to which
vulnerabilities our system is affected we can do:

```sh
 sudo nmap --script www.22hits.com
 # WARNING: This command is not safe since it will execute several
 # exploits in ordr to check for vulnerability, the following one is the adviced one
```

```sh
 sudo nmap --script "vuln and not (dos or exploit or intrusive)" www.22hits.com
 # this is a safer version of the last command, since it won't execute exploits
```

```sh
 sudo nmap -sS -sV -O www.example.com --stats-every 1m
 # this is useful, since it uses the option --stats-every 1m
 # which prints the progress as a percentage every minute
```

```sh
 sudo nmap -A -oA example www.example.com --stats-every 1m
 # the -A flag is the equivalent of -sC -sV -O,
 # so it can be a very useful shortcut
```

We can also perform port knocking with nmap, by doing:
```sh
for x in 7000 8000 9000; do nmap -Pn --host-timeout 201 --max-retries 0 -p $x 1.1.1.1; done
```
