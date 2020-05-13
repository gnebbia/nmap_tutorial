# nmap Output

Let's look at some way to obtain better output:
- while in the interactive mode, if we are waiting for results we
  can press "Enter" and get some lines describing what nmap is
  doing
- if we append the --reason in any case nmap is doing a port scan,
  we'll notice the reason why nmap determined that the examined
  ports were closed or opened
- if we are only interested in the open ports, and not even the
  filtered ones, so we must append --open
- we can output the results in a file with: "-o", we can save
  results into different formats:
  - N, normal format
  - X, XML format
  - G, grepable format
  - A, all formats

An example of these could be:
```sh
nmap -oN fileName.txt
```

What I personally prefer in scanning activities is:
```sh
nmap -oA filename_prefix
```

Note that saving an output report is extremely useful
also in cases where we are scanning large subnets and
want to handle nmap crashes or reboots.
Indeed, we can restore an interrupted scan from its template
by doing:

```sh
nmap --resume <logfile_name>
```
