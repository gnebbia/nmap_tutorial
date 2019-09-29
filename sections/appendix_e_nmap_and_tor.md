
One option to be able to scan an onionn address is:
```sh
proxychains4 nmap -Pn -sT -v scyllabyeatabumx.onion
# we have to avoid pinging by using -Pn, since Tor does not play well with Tor
# also since proxychains does not work with -sS e use a tcp connect scan with -sT
```

