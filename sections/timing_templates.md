

Since nmap as we have seen has many options to set the
performance vs accuracy tradeoff, it even provides 6 "Timing
Templates" which will go from "super slow" to "crazy fast" which
will let us not set every options manually. We can set one of
these 6 templates:

* -T 0 (paranoid) #super slow
* -T 1 (sneaky)
* -T 2 (polite)
* -T 3 (normal) #this is the default option
* -T 4 (aggressive)
* -T 5 (insane) #super fast

let's see some example of usage of these timing templates:

```sh
 nmap -T polite 109.121.12.11
 # performs a polite scan (-T 2)
```

```sh
 nmap -T 4 10.53.43.21
 # performs an aggressive scan (-T 4)
```

As we can notice, we can specify the timing template with both
the number or a string. If we would inspect some of these
templates we would notice that:

* -T 3 has the following settings:
  * --max-rtt-timeout 1250ms
  * --initial-rtt-timeout 500ms
  * --max-retries 6
  * --scan-delay 10ms
* -T 5 has the following settings:
  * --max-rtt-timeout 300ms
  * --initial-rtt-timeout 50ms
  * --max-retries 2
  * --scan-delay 5ms

Ok which one to use then ? Well it is recommended for:

* Internet Scan (-T 3)
* Local Scan (-T 4)
* My own machines (-T 5)


