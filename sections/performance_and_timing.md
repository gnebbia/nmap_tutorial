# Performance and Timing

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

