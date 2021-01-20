# nmap: Evading Firewalls

We are going to make assumptions which are very probable for many
firewalls, but won't be accurate, because they can vary from
firewall to firewall. We can list as anti-scanning technologies:

- Firewall
- NAT (Network Address Translation)
- IDS (Intrusion Detection System)

We are going to discuss each and how they will affect the result.


## Firewalls

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

- Stateless Packet Filter Firewall
- Stateful Packet Filter Firewall
- Application (aka Proxy) Firewall

We are not interested in the normal scans done with -sS or with
-sT because in these cases we simply receive a response (or the
traffic is normally forwarded) if the port is open and a drop of
the packet (aka no response) if the port is closed


## Stateless Firewall

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


## Stateful Firewall

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


## Application or Proxy Firewall

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


