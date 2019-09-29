
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



