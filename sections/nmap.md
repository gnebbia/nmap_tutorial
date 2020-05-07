
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
 # hosts on the network address, it actually uses
 # different techniques to understand if a host is alive or not
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


In addition, we may say that as a guideline an nmap operation
can be subdivided into two major phases:
- host discovery (or "ping phase"), controlled with the -P option
- port scan, controlled with the -s option

Also remember that the default behavior of nmap also depends on whether
we are executing the command:
- as root vs non-privileged user
- on a local network segment vs to a remote host

That's why sometimes using the same flags could lead to a slightly
different network traffic.
