
UDP is one of the two most used protocols for communication (the
other one is TCP), UDP differs from TCP since it is:

* unreliable:
  * no guarantee of delivery
  * no error checking
  * no delivery validation
* connectionless:
  * no handshaking
  * no packet ordering
  * no duplicate packets protection
* low overhead
  * reduced latency


The UDP header is 8 Bytes long and contains 4 fields, but the
interesting ones are:

* source port
* destination port

The combination of Source IPAddress+Port and Destination
IPAddress+Port forms what it is needed to communicate over the
internet and this unique combination is called a **Socket**.


## How to probe systems using UDP

Since UDP is connectionless, it is impossible with UDP alone to
probe and scan a system checking if it is alive or if its ports
are opened, etc...
But there are conditions in which it is possible to probe with UDP:

* Rare: Responsive Service (DNS), so on the port on which we are
  sending UDP packets we have a responsive service living on that
  port, in this case we understand the host is alive
* Common: Closed Port (if we send UDP packets to a very probable
  closed port, the target system replies with an ICMP "Port
  Unreachable" message packet, we usually can use this kind of
  technique to check if a system is up or not


Host enumeration using UDP packets is possible in nmap using:

```sh
nmap -PU40125 ipaddress
 # where 40125 is the specified example port, which is
 # also the default probed port if no port is specified
```


