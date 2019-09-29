
The NMAP Scripting Engine (or NSE) is a capability who allows us
to extend nmap with user-defined plugins. Currently there are 400
scripts in the NSE library. The NMAP scripting engine is called
through the option "-sC", which is equivalent to running "
--script=default", so without specifying anything else, we are
going to call all the scripts in the category called "default",
while if we want to specify a specific script, we can do: "
--script=list,of,scripts,comma,separated", where in the list we
can even append entire categories of scripts. NMAP has 15 script
categories:

* auth
* broadcast
* brute
* default
* discovery
* dos
* exploit
* external
* fuzzer
* intrusive
* malware
* safe
* safe
* version
* vuln

And since it is impossible to know them all, it is hugely adviced
to read the documentation found online for the NSE. Many scripts
require additional arguments which can be specified with "
--scripts-args arg1=val1, arg2=val2,...".

Let's see some example:

```sh
 nmap -sC -p 80 www.cnn.com
 # in this case, we are executing all
 # the scripts in the "default" category to run on port 80 of the
 # cnn website
```
```sh
 nmap -p 80 --scipt http-chrono www.ibm.com
 # in this case we are
 # executing the script called "http-chrono" on the port 80 of the ibm website
```


## NSE Capabilities

The NMAP NSE was created in order to extend NMAP capabilities in
5 ways:

* version detection
* network discovery
* vulnerability detection
* backdoor detection
* vulnerability exploitation


### Examples


Let's see some examples of NSE scripting:

```sh
 nmap -p 80 --script http-headers, http-chrono www.abc.com
 # in this case we are calling the two scripts, the http-headers,
 # and the http-chrono on the website www.abc.com
```
```sh
 nmap -p 80 --script http-email-harvest www.bankvisioninc.com
 # in this case we are running the http-email-harvest script,
 # which will gather all the emails found on that webserver, this script
 # called without arguments sets default arguments
```
```sh
 nmap -p80 --script http-email-harvest --script-args \
  http-email-harvest.maxdepth=9, \
  http-email-harvest.maxpagecount=30 www.bankvisioninc.com
  # this script will the http-email.harvest, but will pass as arguments
  # the one mentioned
```

The possible arguments for all the scripts and their relative
meaning is found in the documentation of the NSE scripts. Let's
see other examples:

```sh
 nmap --script ipidseq 102.121.33.45
 # in this case we are running the ipidseq script, this script will tell us
 # if the mentioned target can be used as a zombie, indeed it checks
 # if incremental packets are used on the target, if the response on a specific
 # target is "unknown" or "all zeros", then we cannot use that
 # target as zombie, but if the response is "Incremental" then we
 # can use that machine as a zombie
```
```sh
 nmap -p 23 --script telnet-brute --script-args userdb=myFile.txt,\
  passdb=myPasswdList.txt 192.168.1.118
  # this script will try to
  # brute force telnet accounts of the target machine from port 23,
  # the dictionary used for the attack are on the attacker machine
  # and passed as arguments
```

