#speedtest-nodejs
A simple utility for testing speeds across a network.

##Installation
Install [NodeJS 6.9.x][1] if you haven't already on your machine.

Clone this repository locally and run `npm install` to set up dependencies.

##Usage
speedtest-nodejs uses both a server and a client part.
If customizing settings on the server, the client should be customized
as well.

###Server
Run `node server.js` on the machine you wish to use as the server.
Use the following command line arguments to customize its settings:

* `--server-ip` - Set a string representing the IPv6 or IPv4 allowed hostname.
  ('0.0.0.0' by default, allowing all IPv4 hostnames)
* `--server-path` - Set a path for hosting each test.
  ('*' by default, allowing all paths)
* `--server-port` - Set the port the server will listen on.
  (3000 by default)
  
Ignoring any of the above arguments will simply use the default option.

###Client
Run `node client.js` on the machine you wish to use as the client.
Use the following command line arguments to customize its settings:

* `--server-ip` - Set a string representing the IPv6 or IPv4 server hostname.
  ('0.0.0.0' by default, allowing all IPv4 hostnames)
* `--server-path` - Set a path to connect to for each test.
  ('*' by default, allowing all paths)
* `--server-port` - Set the port the server is listening on.
  (3000 by default)
  
Ignoring any of the above arguments will simply use the default option.

##Speed Test Information
Once the client is configured and running in tandem with the server,
the client will begin downloading 100MiB of random data.
After each second, the client will report the current estimated download speed
in terms of bits/sec. If the download takes longer than 15 seconds,
the server will close the connection early.

After the download speed test, it will begin uploading 10MiB of random data.
Once all of the data is uploaded, the client will determine the estimated
upload speed by the time it took to upload.

##Notes
In addition to the requirement for host and port information, I've
also allowed setting an arbitrary path to host both tests.

This project uses only NodeJS 6.9.x and the Express web server.
Express is actually just a simple front-end to Node's built-in HTTP facilities.
All other functionality is provided by the standard Node APIs.

[1]: https://nodejs.org/en/
