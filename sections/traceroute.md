
Another useful tool to understand the network topology and map a
network is the use of traceroute, traceroute is a tool that uses
active probing to discover the physical connectivity or route,
between two networked systems. Traceroute works by manipulating
the TTL (Time to Live) field of the IP header with an ICMP probe
packet, as "echo request". To execute a traceroute, nmap can use
ICMP, UDP or TCP probes; but the choice depends on the type of
scan we will want to execute. To enable traceroute, we just do in
nmap "--traceroute", for example:

```sh
 nmap -n -p 80 --traceroute 162.151.9.221
 # the flag -n disables name resolution
```

