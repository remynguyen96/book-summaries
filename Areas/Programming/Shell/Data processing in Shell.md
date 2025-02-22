##### Downloading data using Curl
`curl` is short for Client for URLs. A Unix command line tool, transfers data to and from a server. Used to download data from HTTP(S) sites and FTP servers
Basic `curl` syntax: `curl [option flags] [URL]`
- Use the optional flag `-O` to save the file with its original name
- To rename the file, use the lower case `-o` + new file name.
- Using wildcards (\*) to download multiple files
- `curl` has two particularly useful option flags in case of timeouts during download
	- `-L` Redirects the HTTP URL if a 300 error code occurs
	- `-C`Resumes a previous file transfer if it times out before completion.
- All option flags come before the URL

```sh
curl -O https://websitename.com/datafilename*.txt

curl -L -O -C https://websitename.com/datafilename*.txt
```

