# The Semi-Serious Guide on Network Scanning with nmap

## introduction

One of the first steps to perform when we are pentesting is
related to footprinting. In this phase what we typically do after
having gathered information about the target is performing
network scanning and enumeration. One of the most famous tool to
perform network analysis and service discovery is nmap. In this
document I will try to explain the basic concepts behind a
network mapper and the varying types of analysis that can be
performed. Although many pentesters out there are sticking to
just a single (or a couple) of nmap commands, we will find out
that depending on the situation, there may be various tunings
that can be applied. These tunings can help us in order to:

* gather more information;
* be stelthier;
* bypass firewalls;
* devise advanced analysis techniques;

## nmap

NMAP (NETwork MAPper) is a security scanner used to discover
hosts and services on a computer network, thus creating a "map"
of the network. Performing a complete "network mapping" consists
of four steps:

1. Creation of the Network Map:this is done in order to identify
  servers and routers, thus creating a map of the
  interconnections;
2. Host Identification
3. Service Identification
4. Service Details Identification

Let's see the most basic example with which we can start using
nmap:

```sh
 nmap 192.168.1.1
 # tells us if the host is up, and it analyzes
 # 1000 ports on the host determining which is closed and which is
 # opened
 # TO TRANSLATE
 # Se non viene fornita alcuna opzione di host discovery, Nmap manda di default ad
 # ogni macchina obiettivo un pacchetto ICMP di tipo "echo request", un pacchetto
 # TCP SYN alla porta 443, un pacchetto TCP ACK alla porta 80 e un pacchetto ICMP
 # di tipo "timestamp request" (per IPv6, il pacchetto ICMP di tipo "timestamp
 # request" viene escluso dato che non fa parte del ICMPv6). Questa default è
 # l'equivalente delle opzioni -PE -PS443 -PA80 -PP. Eccezioni a questo
 # comportamento sono le scansioni ARP (per IPv4) e Neighbor Discovery (per IPv6)
 # che sono usate per tutti gli obiettivi in una rete ethernet locale. Se Nmap
 # viene lanciato da un utente non privilegiato all'interno di un ambiente UNIX, i
 # probe di default saranno pacchetti SYN alle porte 80 e 443 inviati mediante la
 # chiamata di sistema connect. Questo tipo di host discovery è spesso sufficiente
 # quando si deve effettuare una scansione su reti locali, anche se per un
 # security auditing si raccomanda di usare un set di opzioni più avanzato.
 # In rete locale nmap usa sempre -PR perche' piu' efficiente
```

In this basic example, nmap performs two operations:

1. checks if the host is up
2. performs a port scan

Another basic example could be:

```sh
 nmap -sn 192.168.1.0/24
 # in this case nmap just executes an enumeration of the
 # hosts on the network address
```
Notice that Nmap has plenty of features, and can also integrate
script capabilities.

Using Nmap as we have done in the basic examples is like dropping
bombs on a network, and is not a good strategy if we want to be
stealthier or do not want to be detected by an IDS/IPS. In order
to understand the amount of data we are transmitting, the reader
is invited to do a network analysis with tools like tcpdump,
wireshark (or tshark).

Since we want to avoid this huge quantity of transactions there
is a need to gain better control over nmap, because the standard
usage we've seen is acceptable only in specific scenarios.

In order to understand how to properly use nmap and how to
effectively tune it, we must understand the various phases
involved in an nmap scan. The scan phases can be cronologically
divided in this way:

* Target Expansion: determination of the IP addresses to scan
* Host Enumeration: determination of the alive hosts
* (Reverse) DNS Resolution: association of a name to a specific
  IP address (or viceversa)
* Port Scanning: determination of the opened/closed/filtered
* Service Version Detection: determination of the services
  running on the ports
* OS detection: determination of the operating system
* Traceroute: determination of a path that can be used to arrive
  to the target
* Script Scanning: execution of the user-mentioned scripts
* Ouput: printing of the output on stdout or in files

## target_expansion

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
 # the ip mentioned in the expansion
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

## port_scanning

There are two technique to "Port Specification" in nmap:

1. Explicitly using the "-p" flag

2. By reference using nmap-services

### The "-p" flag

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


### The nmap-services

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


## output

Let's look at some way to obtain better output:

* while in the interactive mode, if we are waiting for results we
  can press "Enter" and get some lines describing what nmap is
  doing

* if we append the --reason in any case nmap is doing a port scan,
  we'll notice the reason why nmap determined that the examined
  ports were closed or opened

* if we are only interested in the open ports, and not even the
  filtered ones, so we must append --open
* we can output the results in a file with: "-o", we can save
  results into different formats:

  * N, normal format
  * X, XML format
  * G, grepable format
  * A, all formats

an example of these could be:
```sh
nmap -oN fileName.txt
```

What I personally prefer in scanning activities is:

```sh
nmap -oA filename_prefix
```

## host_enumeration_and_network_mapping

Nmap works at the OSI Network layer and Transport layer. We have
to remember that each layer has its own:

* header section
* data section

We remember that the Network Layer is the one responsible for the
movement or routing of packets across the network, the protocol
used on internet at this layer is the "IP" (Internet Protocol).

The Transport layer provides the flowof data between two hosts,
for the application layer above. Examples of protocols at this
layer are:

* Internet Control Message Protocol (ICMP)
* User Datagram Protocol (UDP)
* Transmission Control Protocol (TCP)


## icmp

ICMP is used to:

* send messages between systems
* perform network diagnostics

ICMP Headers are 8 Bytes in length, and ICMP messages are one of
the two types:

* Request/Response pair
* One flow communication


### Request/Response Pairs in ICMP

The two header fields that we need to understand are:

* type: designates the major category of the message
* code: further defines and specifies the message

There are 3 types of request/response pairs:

* echo; specified in nmap with -PE
* timestamps; specified in nmap with -PP
* address mask; specified in nmap with -PM

The -PP and -PM requests can be used with some machines where ICMP ping requests
have been blocked only.


### One Flow Communication in ICMP

One flow communication in ICMP are usually used for errors,
normally the type field is euqal to 3 and the most common codes
are:

* 0=network unreachable
* 1=host unreachable
* 2=protocol unreachable
* 3=port unreachable
* 4=frag needed, don't frag bit set
* 9=dest net admin prohibited
* 10=dest host admin prohibited
* 11=network unreachable
* 12=host unreachable
* 13=comm admin prohibited


## udp

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


### How to probe systems using UDP

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


## tcp

The TCP protocol is:

* Reliable, reliability mechanisms
* Ordered, the delivery of packets is ordered
* Error-checked, it has some more error checking techniques

The TCP protocol is similar to a phone call, when we use a phone
to call, we use the "phone protocol" without knowing it, indeed,
considering two persons A and B, what they do to start a call is:

1. A requests a call to B with a "Ring"
2. B replies "Hello?" to A
3. A replies back "Hi" to B

TCP establish a connection with a similar technique. The most
interesting fields in the TCP Header are:
* source port
* destination port
* sequence number: these numbers are used to reassemble packets
  in the correct orderon an end-point
* acknowledgement number: is used from the receiver to let the
  sender know that a packet has been received
* flags (or control bits): are used to indicate the type of
  packet sent, or to call attention to other significant
  conditions, the flags that we need to be familiar with are:
  * RST (Reset)
  * SYN (Synchronize)
  * FIN (Finish)
  * URG (Urgent)
  * ACK (Acknowledgement)
  * PSH (Push)

Instead of giving now a definition for all of these flags, let's
see an example of communication: if host A wants to communicate
with host B in TCP, what happens is:

1. host A sends a packet with SYN flag to host B
2. host B replies with a packet with SYN+ACK flags to A
3. host A replies back with a packet with ACK flag

this sequence is what is called "Three-way handshake". After the
three-way handshake, data can flow and ACK packets can be sent as
confirm, then when A wants to terminate (finish) the conversation,
it sends a packet with the FIN flag, and B replies with a packet
containing the ACK flag, then it does the same, by sending a FIN
packet to A and waiting for A to send an ACK packet.
We can do host enumeration using TCP packets in nmap is possible through:

* -PS80 ;no space between port and options
* -PA80 ;no space between port and options
        notice that the port 80 is even the default port if not specified.
* -PS Option ; The -PS option starts with a SYN packet as in the 3 way
        handshake, once the SYN is sent two things can happen:
    1. if the host is alive and the port is open (rare), we receive a
       SYN+ACK reply from host, and at this point we reply back with a
       RST packet terminating the connection, and so without
       concluding the 3 way handshake, this technique of closing
       connection after the first SYN+ACK reply is called "half-open scanning"
    2. if the host is alive, and the port is closed, we receive a RST
       packet from the host, and the connection is aborted, notice
       that this is different from UDP where the reply is an ICMP
       message, in this case we have a TCP packet
* -PA Option ; The -PA option sends an ACK packet to the host, as if we were in
       the middle of a communication session with the target, since the
       target system has no record of packages, responds with a RST packet.
       This response is right what nmap is trying to listen to,
       since it let us understand that the system at the mentioned
       address is alive
* Other Options; Other possible options in nmap are:
        * -Pn avoids system enumeration and runs a port scan


## traceroute

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

## udp_and_tcp_port_scanning

All the NMAP scan options are available through the lower case "-s" followed
by an uppercase letter:

* U: UDP Scan
* T: TCP Connect Scan
* S: TCP Half-Open Scan
* N: TCP Null Scan
* F: TCP FIN Scan
* X: TCP Xmas Scan
* A: TCP ACK Scan

Let's notice that only one of these scans are used with UDP, all
the others are used with TCP:

* U: UDP Scan
* S,T,N,F,X,A: TCP Scans

Once a specific scan is selected, nmap sends appropriate packets
to the host, and one of four results might occur:

* Open: We received an Application Reply
* Closed: We received either:
  -- UDP:ICMP 3,3
  -- TCP: RST packet
* Error Message: We receive an ICMP 3,x packet, which means there
  is something between me and that port which is not allowing me
  to transmit data to that port
* No response

For each of these scans, we can investigate the reason for the given response.


## scan_options

Let's examine the various scan options mentioned in the previous
section.

### -sU Port Scan (or UDP Scan)

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


### -sT Port Scan (or TCP Connect Scan)

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

### -sS Port Scan (or TCP Half-Open Scan)


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

### -sN, -sF and -sX Port Scan (or TCP Null, TCP Fin, and TCP Xmas Scan)

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


### -sA Port Scan (or TCP ACK Scan)

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


### Other Scan Options, and other notes about scanning

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


## performance_and_timing

When we scan a target, we must deal with the "Performance vs
Accuracy" tradeoff, which is very important in network mapping.
We can set for how much time nmap can probe a host, this will let
us spend only a certain amount of time on specific hosts, since
there is a probability we can spend a lot of time on the hosts
because of blocking firewalls, etc... let's make some examples:

```sh
 nmap --host-timeout 5m 10.56.23.233
 # this will probe the target for at maximum 5 minutes
```

```sh
 nmap --host-timeout 3h 10.56.23.233
 #this will probe the target for at maximum 3 hours
```

the possible options for host timeout are:
* ms #milliseconds
* s #seconds, it is the default value
* m #minutes
* h #hours

Other options to tune up the timing are:

* --max-retries 3 #in this case the maximum number of retries is 3
  before giving up.
* --initial-rtt-timeout 2s #this tells how much time we are going
  to wait after a packet is sent before retransmitting, once a
  reply has been received, nmap adjusts this value accordingly
* --min-rtt-timeout 1s, --max-rtt-timeout 5s #in addition to the
  initial rtt timeout, we can also set the minimum and the
  maximum rtt value before retransmitting the packet
* --host-timeout 15m #in this case the conversation will close
  after 15 minutes, a host that is skipped, won't have any report
  on it
* --scan-delay 20ms, --max-scan-delay 500ms #in this case we can
  set the delay between packet retransmission, this is used in
  order to not flood the network, so how long nmap pauses is
  controlled by these two options
* --min-hostgroup 256, --max-hostgroup 2048 #these options control
  the size of the groups to be scanned
* --min-parallelism 30, --max-parallelism 500 #ports are also
  scanned in parallel, these two options control the number of
  parallel probes used on the host groups
* --min-rate 100, --max-rate 200 #these options control the rate at
  which packets are sent out, this rate is sent in \frac{packets}{s}

## timing_templates


Since nmap as we have seen has many options to set the
performance vs accuracy tradeoff, it even provides 6 "Timing
Templates" which will go from "super slow" to "crazy fast" which
will let us not set every options manually. We can set one of
these 6 templates:

* -T 0 (paranoid) #super slow
* -T 1 (sneaky)
* -T 2 (polite)
* -T 3 (normal) #this is the default option
* -T 4 (aggressive)
* -T 5 (insane) #super fast

let's see some example of usage of these timing templates:

```sh
 nmap -T polite 109.121.12.11
 # performs a polite scan (-T 2)
```

```sh
 nmap -T 4 10.53.43.21
 # performs an aggressive scan (-T 4)
```

As we can notice, we can specify the timing template with both
the number or a string. If we would inspect some of these
templates we would notice that:

* -T 3 has the following settings:
  * --max-rtt-timeout 1250ms
  * --initial-rtt-timeout 500ms
  * --max-retries 6
  * --scan-delay 10ms
* -T 5 has the following settings:
  * --max-rtt-timeout 300ms
  * --initial-rtt-timeout 50ms
  * --max-retries 2
  * --scan-delay 5ms

Ok which one to use then ? Well it is recommended for:

* Internet Scan (-T 3)
* Local Scan (-T 4)
* My own machines (-T 5)


## evading_firewalls_and_other_sneakiness

We are going to make assumptions which are very probable for many
firewalls, but won't be accurate, because they can vary from
firewall to firewall. We can list as anti-scanning technologies:

* Firewall
* NAT (Network Address Translation)
* IDS (Intrusion Detection System)

We are going to discuss each and how they will affect the result.


### Firewalls

A firewall is a network security system that controls network
traffic passing between two networks, and is based on a
configured rule set. A firewall establish a barrier between a
trusted internal network, and an external network (such as
internet), a firewall inspects the packets passing between these
networks; and either allows or denies the forwarding of the
packet, based on the content of the packet header or sometimes on
the content of the packet payload.

Decisions are primarily made based on the socket which is the
combination "SourceIP,SourcePort and DestIP,DestPort". There are
generally three types of firewall:

* Stateless Packet Filter Firewall
* Stateful Packet Filter Firewall
* Application (aka Proxy) Firewall

We are not interested in the normal scans done with -sS or with
-sT because in these cases we simply receive a response (or the
traffic is normally forwarded) if the port is open and a drop of
the packet (aka no response) if the port is closed


### Stateless Firewall

In a stateless firewall, the only thing checked is the socket, so
the rules are based upon the socket and the allowed ports. This
firewall has no record of prior transactions. A stateless
firewall don't inspect the TCP flags, since it only looks at the
rule, so if we send a:

* NFX or ACK packet scan, we receive a RST packet directly from
  the target for both the cases of open and closed ports,
  bypassing the firewall, while if the firewall has a rule about
  filtering that specific port, we won't receive any RST packet
  (In this case we are evading firewall)


### Stateful Firewall

Stateful firewall, look at inbound packets and make their
pass/drop decision based upon two objects:

* state table
* rule set (describing the allowed TCP flags)

In the state table we have records of approved connections
recording the socket; once the connection has been approved, the
following packets are inspected by the firewall only by looking
the state table, the advantage of a stateful firewall is that
looking for sockets after the approved connection is faster than
looking everytime for the rule set. When a stateful firewall
receives:

* NFX or ACK packet it drops the packet, since the rule set, just
  states to drop the packets with these flags, so we receive no
  response, even in the case of ACK, the firewall will look the
  state table and notice of not having any history of
  conversation with the socket so again it will drop the packet


### Application or Proxy Firewall

In this case we have a complete application who inspects the
packets, and decides if it has to forward the packet or not. An
application firewall will have its own TCP/IP stack protocols, so
he will reply directly to the scanning machine, so we won't get a
response from our target directly but from this firewall (this
was not happening in the previous case, since we always had the
case of either no response or response from the target directly).
Application firewall must have an appropriate application for
each protocol they want to support, if they don't have an
appropriate module to interprete the application data, they
typically behave as a stateful firewall. An application firewall
will reply:

* to an NFX or ACK request, the firewall will drop the packets,
  even if with an ACK request we could even receive a RST packet,
  but this will come from the firewall itself and not from the
  target machine

Firewall Commonalities are:

* Default deny policy
* Rate limiting
  * ICMP on UDP Scan

## detecting_and_evading_a_firewall

### Detecting Firewalls

Detecting a firewall is not easy, the most common tools to detect
a firewall are:

* --traceroute
* -O
* --badsum #this isn't always effective

The badsum option is called as:
```sh
 nmap --badsum 291.122.121.11
 # this option causes nmap to create
 # a bad checksum in the TCP header, all hosts should drop these
 # packets, so if we receive a response, this means that the
 # response comes from a firewall who didn't bother to verify the checksum
```


### Evading Firewalls

There are two other ways to evade a firewall:

* Fragmentation fields of the IP header
* Idle Scan (using Zombie Hosts)

####  Fragmentation fields of the IP Header

Fragmentation is useful since fragments are passed to the target
machine uninspected from the firewall. Fragmentation is more
effective when we split TCP header in different packets, in nmap
we can request a fragmentation with the "-f" option which will
request a fragmentation of 8 byte chunks, while it is even
possible to use "-f-f" to achieve 16 byte chunks, or still we can
specify the chunk size by using "--mtu" and specifying the chunks,
let's see some examples:

```sh
 nmap -f 223.23.23.12
 # this is the preferred and most used
 # option, when doing such things, the packet is split into 3 fragments
```

```sh
 nmap --mtu 24 223.23.23.12
```
Since the TCP Header is 20 bytes, the packet sent is split into 3
fragments, when using the "-f" flag.

When using fragmentation we must pay attention to two potential
issues:

* Source Defragmenting: on some systems, is not posible to send
  highly fragmented packets, this is the case for for example for
  IPTables, in this case we must ensure that nmap uses raw
  ethernet frames
* Fragment Queuing: this issue is related to the fact that some
  firewall defrags (aka reassembles) the packets before sending
  them to destination, in this case fragmentation doesn't work
  and we must use something else


#### Idle Scan

This scan is based upon the fact that some systems use a
monotonicly increasing "id" field in the IP header when sending
packets out, these systems are called "idle systems" and if we
can find an idle system (i.e. a system who is using the id field
or increments it when sending packets out), we can perform a scan
that completely hides our identity, and this is very sneaky. Here
is how it all works, let's say we found an idle system which is a
printer; and we want to inspect another target machine port; what
happens is:

* in the case of Port Opened:
  * We send a SYN+ACK packet to the idle system (the printer)
  * he replies back with RST,ID=55 (55 is used only as example
  * we then send a spoofed SYN packet to the target machine (so
    we mask our IP as we were the printer)
  * now if the port is open, the system will send to the printer
    a SYN+ACK packet, and the printer will reply to the target
    system with a RST,ID=56
  * now we send again a SYN+ACK packet to the printer and if the
    printer replies with RST,ID=57 (i.e. ID=initialID+2) then
    this means that the port on the target machine is open, since
    it replied to our fake (spoofed) request
* in the case of Port Closed:
  * We send a SYN+ACK packet to the idle system (the printer)
  * he replies back with RST,ID=55 (55 is used only as example
  * we then send a spoofed SYN packet to the target machine (so
    we mask our IP as we were the printer)
  * now since the port is closed the target system won't send any
    packet to the printer
  * now we again send a packet to the printer, and if the printer
    sends a packet with RST, ID=initialID+1, this means that the
    inspected port is closed


In order to find a zombie machine, we can use nmap or hping3, with nmap
if we want to understand if a machine is a zombie we can do:

```sh
nmap -O -v <target>
```
If the machine is a zombie, we should see the message:
"IP ID Sequence Generation: Incremental".


Idle scans are sneaky and perform the check with the help of a
zombie host, we can perform this kind of scans with the flag "-sI",
and these kind of scans are of the form:

```sh
 nmap -sl zombieHostIPAddress targetHostIPAddress
```

Anyway this technique becomes effective only if we can find the
above defined "idle systems", and we'll check this in the nmap
scripting modules (to be precise this can be achieved with --script ipidseq);
now let's see an example of idle scan from nmap:

```sh
 nmap -sI 192.168.5.4 192.168.23.88
 # in this case we use as zombie host (aka idle system)
 192.168.5.4 and our target host is 192.168.23.88
```


### NAT

This is another thing that can frustrate our scanning, what
happens here is that, if we are inside a NAT and perform a scan,
we have no problems, while in other case if we want to perform
scan on a computer inside a NAT, we are blocked by the firewall,
so the scan of an internal host from the outside of a firewall
won't work.


### IDS

A network IDS (Intrusion Detection System) is a device that
monitors network traffic from malicious activity and produces
reports about policy violation which are published to a
management station. An IDS works in promiscous mode and performs
analysis of passing traffic for the entire subnet, once an attack
is identified or abnormal behaviour is sensed, an alert can be
sent to the network administrator. An IDS can be configured to
sense for many kind of attacks:

* signatures
* anomalies
* packet rates


### Avoiding IDS Detection

There are diverse techniques to avoid IDS detection,

1. Send traffic at a very low rate
2. Make traffic appear as if it was legit
3. Hiding ourself with IP spoofing
4. Hiding ourself with MAC spoofing
5. Flooding IDS with misleading data

The first solution can be achieved by this option:
 -T paranoid (or -T 0), in this case, we are absolutely not
  flooding the network, so attacks can be hard to detect

The seconnd solution is about to make my traffic seem as legitimate as
possible, this can be achieved with the following options:

* --source-port portnum (or) -g portnum ;this specifies the source
  port from which the traffic is coming
* --data-length num ;this appends random data in a packet

Let's see an example in action:

```sh
 nmap -PA -g 443 -p 6756 --data-length 812 218.45.187.23
 # in this case we are making the IDS think that we are sending our
 # packets from the https protocol (port 443), so the random data
 # will be interpreted as encrypted
```

Another technique is hiding ourself, this can be done through a
"source spoofing", which can be done with "-S source-address", in
this case we make the IDS think that the sent packet is coming
from the mentioned ip address. This creates some interesting
traffic on the target system, but we won't get any additional
info, since the reply is sent to the mentioned ip address and not
to us, this can be useful only in the case of an idle scan. This
option can even have a "legitimate" use, indeed we can have
multiple network interfaces and different network addresses, so
with "-S sourceAddress" and "-r interface" we can set on which
interface or with which ip address we are sending our packets.

Another similar technique is the one of MAC spoofing, this can be
done with the "--spoof-mac" option, here we can specify:

* Full MAC address
* Prefix
* Vendor Name

Let's see some examples of the above mentioned options:

```sh
 nmap -e eth0 218.45.187.23
 # we set as interface eth0 to scan the mentioned ip address
```

```sh
 nmap -S 192.168.1.1 192.168.1.23
 # we set as source ip address the first mentioned IP and the
 scan is made on the second IP address
```

```sh
 nmap --spoof-mac Cisco 192.168.1.23
 # in this case we make the target think, we have a Cisco network
 # card, by setting a specific format for the MAC address which the target will
 # recognize as Cisco, and plus additional data
```

Another technique to hide our scans is by flooding the IDS with
misleading data. The "-D" option in nmap allows us to specify
other addresses which will work as decoys. The
target system will see that he's been scanned from multiple
hosts, and won't know for sure which one has initiated the probe,
or which one is innocent. An example is:

```sh
 nmap -D 56.23.52.98,12.34.18.9 218.45.187.23
 # in this case the first two addresses will be the decoys,
 # and we are going to scan the third address
```

Another option is to use random decoys, we can do that like this:

```sh
 nmap -D RND:10 218.45.187.23
 # here we use 10 random decoys
```

Notice that the decoys are comma separated, and the more decoys
we put, the more we hide, but the scan will take longer times,
since nmap has to generate several packets to send to the target
machine.

## os_and_service_version_detection

### Service Versioning


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

## os_versioning


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

## nated_systems_and_load_balancers

Sometimes the IP address that we are scanning may be a firewall or a network
device which is using NAT and behind this device there may be multiple systems.

It can be important to understand that we are in this scenario, to understand
this, we may first sweep all the ports if possible, and then try with subsets of
the open port to check what kind of OS guessing is made by nmap, if the guessing
is different depending on the chosen ports, then we most probably are dealing
with a NATed network.

In this cases we can use TCP timestamps to infer what is the configuration:

* if timestamps are significantly different(> 1s): It is very likely that timestamps
  are coming from different systems
* if timestamps are euql (<1s): It is likely that timestamps are coming from
  the same system
* If only one port responds without set TCP timestamp options, it is
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


## nmap_scripting_engine

The NMAP Scripting Engine (or NSE) is a capability who allows us
to extend nmap with user-defined plugins. Currently there are 400
scripts in the NSE library. The NMAP scripting engine is called
through the option "-sC", which is equivalent to running "
--script=default", so without specifying anything else, we are
going to call all the scripts in the category called "default",
while if we want to specify a specific script, we can do: "
--script=list,of,scripts,comma,separated", where in the list we
can even append entire categories of scripts. NMAP has 15 script
categories:

* auth
* broadcast
* brute
* default
* discovery
* dos
* exploit
* external
* fuzzer
* intrusive
* malware
* safe
* safe
* version
* vuln

And since it is impossible to know them all, it is hugely adviced
to read the documentation found online for the NSE. Many scripts
require additional arguments which can be specified with "
--scripts-args arg1=val1, arg2=val2,...".

Let's see some example:

```sh
 nmap -sC -p 80 www.cnn.com
 # in this case, we are executing all
 # the scripts in the "default" category to run on port 80 of the
 # cnn website
```
```sh
 nmap -p 80 --scipt http-chrono www.ibm.com
 # in this case we are
 # executing the script called "http-chrono" on the port 80 of the ibm website
```


### NSE Capabilities

The NMAP NSE was created in order to extend NMAP capabilities in
5 ways:

* version detection
* network discovery
* vulnerability detection
* backdoor detection
* vulnerability exploitation


#### Examples


Let's see some examples of NSE scripting:

```sh
 nmap -p 80 --script http-headers, http-chrono www.abc.com
 # in this case we are calling the two scripts, the http-headers,
 # and the http-chrono on the website www.abc.com
```
```sh
 nmap -p 80 --script http-email-harvest www.bankvisioninc.com
 # in this case we are running the http-email-harvest script,
 # which will gather all the emails found on that webserver, this script
 # called without arguments sets default arguments
```
```sh
 nmap -p80 --script http-email-harvest --script-args \
  http-email-harvest.maxdepth=9, \
  http-email-harvest.maxpagecount=30 www.bankvisioninc.com
  # this script will the http-email.harvest, but will pass as arguments
  # the one mentioned
```

The possible arguments for all the scripts and their relative
meaning is found in the documentation of the NSE scripts. Let's
see other examples:

```sh
 nmap --script ipidseq 102.121.33.45
 # in this case we are running the ipidseq script, this script will tell us
 # if the mentioned target can be used as a zombie, indeed it checks
 # if incremental packets are used on the target, if the response on a specific
 # target is "unknown" or "all zeros", then we cannot use that
 # target as zombie, but if the response is "Incremental" then we
 # can use that machine as a zombie
```
```sh
 nmap -p 23 --script telnet-brute --script-args userdb=myFile.txt,\
  passdb=myPasswdList.txt 192.168.1.118
  # this script will try to
  # brute force telnet accounts of the target machine from port 23,
  # the dictionary used for the attack are on the attacker machine
  # and passed as arguments
```

## examples_of_nmap_usage

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
 # in this case, we disabled port
 # scanning with "-sn" and we disabled host name resolution with "
 # -n", in this way we get quickly the list of live hosts on the
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

## appendix_a_nmap_flags_cheatsheet

Here we'll put an nmap cheatsheet, which wraps up all the Network
Mapping phases with relative commands, this can be useful to us
for many situations.

![alt text](img/nmap_cheatsheet.png "nmap cheatsheet")


## appendix_b_ipv4_subnet_cheatsheet

/31 255.255.255.254 1 Host

/30 255.255.255.252 2 Hosts

/29 255.255.255.249 6 Hosts

/28 255.255.255.240 14 Hosts

/27 255.255.255.224 30 Hosts

/26 255.255.255.192 62 Hosts

/25 255.255.255.128 126 Hosts

/24 255.255.255.0 254 Hosts

/23 255.255.254.0 512 Host

/22 255.255.252.0 1022 Hosts

/21 255.255.248.0 2046 Hosts

/20 255.255.240.0 4094 Hosts

/19 255.255.224.0 8190 Hosts

/18 255.255.192.0 16382 Hosts

/17 255.255.128.0 32766 Hosts

/16 255.255.0.0 65534 Hosts

/15 255.254.0.0 131070 Hosts

/14 255.252.0.0 262142 Hosts

/13 255.248.0.0 524286 Hosts

/12 255.240.0.0 1048674 Hosts

/11 255.224.0.0 2097150 Hosts

/10 255.192.0.0 4194302 Hosts

/9 255.128.0.0 8388606 Hosts

/8 255.0.0.0 16777214 Hosts


## appendix_c_typical_usage_for_pentesting

In a general pentest we may go with a simple:

```sh
 sudo nmap -sC -sV -oA outputfile ipaddress --stats-every 1m
 # with the -sC flag we launch the common scripts
 # this combination is one of the most commonly used during
 # basic pentests or CTFs, it is also used by ippsec
```

```sh
 sudo nmap -sV -O -sC -oA outputfile <ipaddress> --stats-every 1m
 # this is a more complete scan, which tries also to attempt the guess
 # of the OS
```

these combinations of flags/options/parameters gives us a good initial
point to start to pentest the machine, of course in the meanwhile, if
we can do it, we could also launch a more accurate scan on every port
with:

```sh
 sudo nmap -sV -p- -oA fulloutputfile <ipaddress> --stats-every 1m
 # this checks all 65535 ports
```

## appendix_d_random_facts

* My External Facing IP Address
If we scan our router with either the local IP address or the external facing IP
address, we can notice that the results are the same.

This is because what happens is that when my network card realize I'm querying
the external IP address which is actually a host in my LAN, it just fallbacks to
the local IP Address, to perform a real external scan, we should perform the
scan from an external network or used some internet based network scanner such
as:  GRC shields up.

* IP Cameras and other IoT
If we can magically access our home IP camera or other devices without
configuring our router, such as port forwarding or DMZ and so on, then the
device sends data to the cloud.

Notice that other devices in certain cases may use the UPnP infrastructure,
basically with UPnP on a router a daemon on the gateway receives request from clients
on the LAN to open ports and forward them automatically to the device requesting it.

An example would usually be when the camera starts. Most gateways anyway allow
disabling uPnP too, if that is an issue.

While other cameras try to reach a server on cloud using the STUN protocol.

* Search for remotely accessible Web UI
It is enough to limit our scans to ports 80 and 443 for web services,
we can use a more aggressive scan, and not care about DNS lookups, we also don't
care if devices respond to ping.

An example is:
```sh
nmap -sS -sV -vv -n -Pn -T5 101.53.64.1/24 -p80,443 -oG - | grep 'open' | grep -v 'tcpwrapped'
```

Once you get your access to the router, you can do a lot more, like DNS
hijacking, steal username and passwords (for example: Social Media username
passwords (FaceBook, Twitter, WebMail etc.)) using tcpdump/snoop on router’s
interface and many more using ADSL router hack



## appendix_e_nmap_and_tor

One option to be able to scan an onionn address is:
```sh
proxychains4 nmap -Pn -sT -v scyllabyeatabumx.onion
# we have to avoid pinging by using -Pn, since Tor does not play well with Tor
# also since proxychains does not work with -sS e use a tcp connect scan with -sT
```

## appendix_f_scripts


### Bruteforce RTSP Directories

```sh
nmap --script rtsp-url-brute -p 554 <ip>
```
