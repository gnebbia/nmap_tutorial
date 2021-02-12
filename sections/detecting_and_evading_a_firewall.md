## Detecting Firewalls

Detecting a firewall is not easy, the most common tools to detect
a firewall are:

- `--traceroute`
- `-O`
- `--badsum`, this isn't always effective

The badsum option is called as:
```sh
 nmap --badsum 291.122.121.11
 # this option causes nmap to create
 # a bad checksum in the TCP header, all hosts should drop these
 # packets, so if we receive a response, this means that the
 # response comes from a firewall who didn't bother to verify the checksum
```


## Evading Firewalls

There are different ways to evade a firewall:

- Fragmentation fields of the IP header
- Scan Delay
- Idle Scan (using Zombie Hosts)
- Trusted source port
- Badsum (check the presence of an intelligent firewall/IDS/IPS)

There are other techniques (e.g., --data-length) and details about firewall evasion here:
[nmap firewall/IDS bypass](https://nmap.org/book/man-bypass-firewalls-ids.html)
[nmap firewall subversion](https://nmap.org/book/firewall-subversion.html)


###  Fragmentation fields of the IP Header

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
 # note that MTU must be a multiple of 8
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


Used to fragment the packets (i.e. split them into smaller pieces) making
it less likely that the packets will be detected by a firewall or IDS.
An alternative to -f, but providing more control over the size of the
packets: --mtu <number>, accepts a maximum transmission unit size to
use for the packets sent. This must be a multiple of 8.

### Scan Delay 

We can use `--scan-delay <time>ms` to add a delay between packets
sent. This is very useful if the network is unstable, but also for
evading any time-based firewall/IDS triggers which may be in place

### Idle Scan

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

### Trusted source port

There's a quick trick with nmap we should always remember. Sometimes,
network administrators will allow bi-directional port-based filtering
when only egress filtering should by allowed. Whenever you need to
bypass network rules, you should try using commonly allowed ports such
as 22,53,80 and 443. This is what we did with nmap’s source port option.

```sh
nmap --source-port 53  <target>
nmap --source-port 22  <target>
nmap --source-port 80  <target>
nmap --source-port 443 <target>
```
These types of scan are particularly useful and we should give them a try
whenever nmap does not return any results (as if all ports are filtered
or closed) with a scan while we think some results should be available.

Once we find a working port we proceeded to setting up iptables to source 
nat the port. We can do this with this rule:
```sh
iptables -t nat -A POSTROUTING -d <target> -p tcp -j SNAT --to :53
# where instead of 53 we have to put the port that worked
# with the nmap scan
```

### Badsum

The `--badsum` option is used to generate in invalid checksum for
packets. Any real TCP/IP stack would drop this packet, however, firewalls
may potentially respond automatically, without bothering to check the
checksum of the packet. As such, this switch can be used to determine
the presence of a firewall/IDS.

## NAT

This is another thing that can frustrate our scanning, what
happens here is that, if we are inside a NAT and perform a scan,
we have no problems, while in other case if we want to perform
scan on a computer inside a NAT, we are blocked by the firewall,
so the scan of an internal host from the outside of a firewall
won't work.


## IDS

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


## Avoiding IDS Detection

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
 # scan is made on the second IP address
```

```sh
 nmap --spoof-mac Cisco 192.168.1.23
 # in this case we make the target think, we have a Cisco network
 # card, by setting a specific format for the MAC address which the target will
 # recognize as Cisco, and plus additional data
```
Note that setting --spoof-mac 0 will generate a random MAC
```sh
 nmap --spoof-mac 0 192.168.1.23
 # in this case we use a randomly generated mac address
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


### Fake Scan

A possible use of this flag is to spoof the scan to make the targets think
that someone else is scanning them. Imagine a company being repeatedly
port scanned by a competitor! The -e option and -Pn are generally
required for this sort of usage. Note that you usually won't receive
reply packets back (they will be addressed to the IP you are spoofing),
so Nmap won't produce useful reports.

```sh
# get a valid IP address or just do:
./netenum.py -t 2m -i wlp1s0 -w active_hosts.txt
# then get an IP address from the active_hosts file and do:
nmap -S $active_ip $target_ip
```


P.S.: Another scenario to use `-S` is when Nmap is not be able to
determine your source address (this can happen in certain circumstances
and Nmap will tell you if this is the case). In this situation, use -S
with the IP address of the interface you wish to send packets through.
