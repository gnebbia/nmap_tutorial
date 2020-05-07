# nmap: NATed systems and Load Balancers

Sometimes the IP address that we are scanning may be a firewall or a network
device which is using NAT and behind this device there may be multiple systems.

It can be important to understand that we are in this scenario, to understand
this, we may first sweep all the ports if possible, and then try with subsets of
the open port to check what kind of OS guessing is made by nmap, if the guessing
is different depending on the chosen ports, then we most probably are dealing
with a NATed network.

In this cases we can use TCP timestamps to infer what is the configuration:

- if timestamps are significantly different(`> 1s`): It is very likely that timestamps
  are coming from different systems
- if timestamps are equal (`<1s`): It is likely that timestamps are coming from
  the same system
- If only one port responds without set TCP timestamp options, it is
  safe to assume that two different systems are responding. If TSopts
  are not included in the answer or TSval = 0 on both ports, then no
  knowledge can be gained, because it could be the same system having
  timestamps disabled or timestamps got disabled on all systems.

This can also be understood by using a simpler tool like `hping`.

Known problems are that some firewalls or NAT gateways terminate the tcp connection
and build a new one -- in this way the timestamp is the one of the firewall/reverse-proxy
and in this scenario it is impossible to find out more about the network behind
the firewall/proxy/NAT gateway using timestamps.
Another known problem comes out if multiple servers are run virtually (so as
virtual machines or containers or any other virtualization technique) on the
same machine, in this case they can have very similar timestamps.

Another cool way to use TCP timestamps is to understand if we are dealing with
load-balancers. While there are many ways of figuring this out, TCP timestamps
offer us an alternative way to access this information.
In practice a load balancer can be detected if there are different timestamps associated
to a single port, in this case the service is likely to be load-balanced.

Currently the best way to defend against all possible information gathering done
using TCP timestamps is disabling them, which comes with the cost of lost
Protection Against Wrapped Sequence numbers (PAWS) and worse Round-Trip
Time Measurement (RTTM).

Disabling timestamps can be done on GNU/Linux using:
```sh
echo 0 > /proc/sys/net/ipv4/tcp_timestamps
```

while on Windows can be done by executing:
```sh
Tcp1323Opts = 0
```


