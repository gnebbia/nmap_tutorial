
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


