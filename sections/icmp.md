# nmap: ICMP

ICMP is used to:

* send messages between systems
* perform network diagnostics

ICMP Headers are 8 Bytes in length, and ICMP messages are one of
the two types:

* Request/Response pair
* One flow communication


## Request/Response Pairs in ICMP

The two header fields that we need to understand are:

* type: designates the major category of the message
* code: further defines and specifies the message

There are 3 types of request/response pairs:

* echo; specified in nmap with -PE
* timestamps; specified in nmap with -PP
* address mask; specified in nmap with -PM

The -PP and -PM requests can be used with some machines where ICMP ping requests
have been blocked only.

For example we could perform a ping sweep similar to what the UNIX or Windows
ping tool does to discover hosts on a network by doing:
```sh
nmap -sn -n -PE 172.28.128.0/24
# -sn turns off the port scanning
# -n  does not resolve the IP addresses into domain names
# -PE uses ICMP type 8 messages to ping hosts on the subnet
```

Note that if we are on a local segment, we may also only see ARP packets,
and this happens since nmap does as little as possible it can do to discover
hosts. However we can see the ping probes whenever we try to perform this
on a host outside our local network segment.

Whenever we want to force ping probes within our local network segment
we can do:
```sh
sudo nmap -sO -p 1 -n -Pn <target>
# in this case we:
# `-Pn` disable the discovery phase (or "ping phase")
# `-n` do not perform IP address resolution
# `-sO -p 1` perform a raw IP scan where the -p1 indicates ICMP type 8 messages
```

## One Flow Communication in ICMP

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


