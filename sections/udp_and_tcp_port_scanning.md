
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


