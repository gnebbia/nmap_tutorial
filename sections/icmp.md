
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


