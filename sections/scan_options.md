
Let's examine the various scan options mentioned in the previous
section.

## -sU Port Scan (or UDP Scan)

-sU or UDP port scanning is useful to determine if a UDP port is
open/closed/filtered and can be done with:

```sh
 nmap -sU 192.168.20.198
 # open UDP ports are only detected when
 # the application on the target provides a reply to our UDP
 # message on the mentioned port
```
now the responses can be:

* -sU Open: The application gives a response, with a UDP packet
* -sU Closed: In this case we receive an ICMP 3,3 packet error
  message (port unreachable)
* -sU Error: In this case we receive from another host (router or
  firewall) an ICMP message 3,10 (10 is dest filtered, while 9 is
  net filtered) which means the port is filtered
* -sU No Response: In this case there are two explanations (filtered|open):
  * there is a router or firewall is silently dropping the
    packets (filtered)
  * the port is open and doesn't give replies, this can happen
    since there are many UDP services who don't provide response,
    such as syslog (open)


It has to be noticed that UDP scanning is slow (compared to TCP
scanning) as open/filtered ports typically don't respond so nmap
has to time out and then retransmit whilst closed ports will send
a ICMP port unreachable error, which systems typically rate
limit. We can speed up our scan (if we are not concerned about
making a lot of traffic on the network) with the flag "-T 5" or "
-T 4", the higher the number the faster the scan will be, but we
are even less precise with faster scan analysis.


## -sT Port Scan (or TCP Connect Scan)

-sT or Connect port scanning is useful to determine if a port is
open/closed/filtered (when we are not root) and can be done with:

```sh
 nmap -sT 192.168.20.198
 # this scan tries to implement a full 3
 # way handshake. if the connection is established in a correct
 # way, then nmap sends an RST packet aborting connection
```

now the responses can be:

* -sT Open: the target sends a SYN+ACK response after the first
  SYN received
* -sT Closed: the targets sends a RST after the first SYN
  received
* -sT Error: In this case we receive from another host (router or
  firewall) an ICMP message 3,10 (10 is dest filtered, while 9 is
  net filtered) which means the port is filtered
* -sT No Response: there is a router or firewall which is
  silently dropping the packets, so nmap reports the port as
  filtered again

## -sS Port Scan (or TCP Half-Open Scan)


-sS or Half-Open port scanning is useful to determine if a port
is open/closed/filtered (when we are root) and can be done with:

```sh
 nmap -sS 192.168.20.198
 # this scan tries to implement a
 # half-open 3 way handshake; this means that if a SYN+ACK packet
 # arrives after the SYN packet, we reset the connection with a
 # RST packet
```

This scan requires root privileges, and this is the default root
scan since it is fastest and since it uses minimum resources on
both the scanning system and the target.

now the responses can be:

* -sS Open: the target sends a SYN+ACK response after the SYN
  received
* -sS Closed: the targets sends a RST after the first SYN
  received
* -sS Error: In this case we receive from another host (router or
  firewall) an ICMP message 3,10 (10 is dest filtered, while 9 is
  net filtered) which means the port is filtered
* -sS No Response: there is a router or firewall is silently
  dropping the packets, so nmap reports the port as filtered
  again

So -sT and -sS are equal in terms of results, but -sS is more
efficient, so it should always be used instead of -sT, so why
still use and implement -sT ? Well because, -sS requires root
privileges, and we not always have these privileges.

## -sN, -sF and -sX Port Scan (or TCP Null, TCP Fin, and TCP Xmas Scan)

These three kind of scans are very similar, and they are rarely
used, but useful to determine if a port generally is filtered(in
a particular case may be open)/closed so we'll discuss them
together. We can perform these scans with:

```sh
 nmap -sN 192.168.20.198
 # the null scan sends a packet with none flag set
```

```sh
 nmap -sF 192.168.20.198
 # the fin scan sends a packet with the FIN flag set
```

```sh
 nmap -sX 192.168.20.198
 # the Xmas scan sends a packet with the URG, PSH and FIN flag set
```

It has to be noticed that every TCP packet must have one of the
essential flags who are "SYN", "ACK" or "RST", if a packet
doesn't have none of these flags, then it has to be dropped; and
these three scans make use of packets with none of these flags,
so what happens is:

* -sN(or F or X) Open & No Response: the target simply doesn't
  reply when we send these packets, but we can't understand if
  the port is open or is filtered
* -s(or F or X) Closed: in this case the target replies with a
  RST packet
* -s(or F or X) Error: in this case we receive from another host
  (router or firewall) an ICMP message 3,10 (10 is dest filtered,
  while 9 is net filtered) which means the port is filtered

Since the N,F,X scans will never identify an open port they are
of limited usefulness, their usage is limited to situations in
which there is a packet filtering firewall and we are attempting
to avoid IDS detection, and even so they should be used as a last
resort.


## -sA Port Scan (or TCP ACK Scan)

-sA or ACK port scanning is useful to determine if a port is
filtered/unfiltered and can be done with:

```sh
 nmap -sA 192.168.20.198
 # in this case, as we did for the enumeration technique, the scanner sends
 # an ACK packet to the target, so when scanning both closed or opened port
 # the target will send back a RST packet
```

This scan is useful only to determine if the port is
filtered/unfiltered, since the responses can be:

* -sA Open: the target sends an RST packet
* -sA Closed: the target sends an RST packet
* -sA Error: In this case we receive from another host (router or
  firewall) an ICMP message 3,10 (10 is dest filtered, while 9 is
  net filtered) which means the port is filtered
* -sA No Response: there is a router or firewall is silently
  dropping the packets, so nmap reports the port as filtered
  again

This is useful in determining the presence of a firewall and on
which port it is filtering.


## Other Scan Options, and other notes about scanning

When we don't want to make any port-scan (maybe because we are
making host enumeration or other things), we can run:

```sh
 nmap 192.168.1.21 -sn
 # this disables port scan
```

To sum up the two most common/used scan methods in nmap are:

* -sU ;to make UDP Scans
* -sS ;to make TCP Scans (but this works only if we are root,
      if we are not root, we could use the -sT)

A table summarizing all the scans we have examined with the
possible results can be observed below:

| Type of Scan |   App Res  |   RST  | ICMP33 |  ICMP3x  |     No Res    |
|:------------:|:----------:|:------:|:------:|:--------:|:-------------:|
|       U      |    open    |    /   | closed | filtered | open/filtered |
|       T      |    open    | closed |    /   | filtered |    filtered   |
|       S      |    open    | closed |    /   | filtered |    filtered   |
|      NFX     |      /     | closed |    /   | filtered | open/filtered |
|       A      | unfiltered | closed |    /   | filtered |    filtered   |


