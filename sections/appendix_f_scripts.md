# Nmap Scripts

## Bruteforce RTSP Directories

```sh
nmap --script rtsp-url-brute -p 554 <ip>
```

## Detect Sniffers on a Network (host with NIC in promiscuous mode)

```sh
nmap -sV --script=sniffer-detect <target>
```


## Other Common Scripts

- dns-blacklist
    Check if host is blacklisted by DNS servers

- dns-zeustracker
    Check if host is a part of Zeus botnet

- http-config-backup
    Search form CMS config backups

- http-wordpress-enum
    Enumerate WordPress plugins
    check-latest - check if pluigns are up to date
    root - base path of root installation

- mysql-empty-password
    Check for anonymous MySQL  login

- mysql-users
    List SQL users on host

- address-info
    Extract information about IPv6 address

- krb5-enum-users
    Enumerate Kerberos usernames
    * .realm - domain name
    * userdb - usernames file

- traceroute-geolocation
    Perform geolocation (requires --traceroute flag)
    * .kmlfile - name of the KML file to write to

- fingerprint-strings
    Print readable banner strings from unknown services
    * n - number of characters to print

- ftp-bounce
    Check if server allows bounce scanning

- hddtemp-info
    Retrieve information from hddtemp service

- ipidseq
    Classify host's IP ID sequence
    * probeport - destination port to probe

- modbus-discover
    Enumerate SCADA slaves and get information about deFanavice and firmware
    * aggressive - enumerate all slaves (not only first sid)

- path-mtu
    Check the maximum length of non-fragmented packets

- qscan
    Probe ports to obtain round-trip time value and search forn anomalies
    * numclosed - max number of closed ports to probe (default: 1, negaive to disable the limit)
    * numopen - maximum number of opened ports to probe (default: 8)
    * numtrips - number of RTTs to get
    * delay - average delay between packets (default: 200ms)

- reverse-index
    Show which host runs particular serice
    * mode - [horizontal|vertical]
    * names - index by service names rather than ports


- smb-os-discovery
    Pull host info (OS, workgroup etc.)

- sniffer-detect
    Check if target has network card in promiscous mode

- targets-sniffer
    Sniff the network for hosts and add them to scanning queue
    * iface - interface used for sniffing
    * timeout - listening time (default: 10s)
    * newtargets - add found targets to scan queue

- unusual-port
    Report deviations if service is running on uncommon port

- xmlrpc-methods
    List available XMLRPC methods

- snmp-[interfaces|netstat]
    Extract info from SNMP service

- ldap-search
    Perform queries against LDAP protocol
    * ldap.username, ldap.password - credentials to use
    * ldap.qfilter - quick filter to use [all|ad_dcs|users|computers|custom]
    * ldap.attrib - comma-separated LDAP attributes to pull, enclosed with curly brackets
    Set this to ms-Mcs-AdmPwd to extract cleartext passwords from LAPS
    * ldap.savesearch - file prefix to save gathered data to, constructed as <prefix>_<ip>_<port>.csv
