const express = require('express');
const http = require('http');
const crypto = require('crypto');
const app = express();

let host, path, port;
let randomData = crypto.randomBytes(1024*1024);

// Set the host and port if supplied
let args = process.argv;
args.forEach((arg, index) => {
  if (arg === '--server-ip' && index < args.length - 1) {
    host = args[index + 1];
  } else if (arg === '--server-path' && index < args.length - 1) {
    path = args[index + 1];
  } else if (arg === '--server-port' && index < args.length - 1) {
    port = args[index + 1];
  }
});

// If options are not supplied, set sane defaults
if (!host) {
  host = '0.0.0.0';
}
if (!port) {
  port = 3000;
}
if (!path) {
  path = '*';
}

// On all requests, send random data
app.get(path, (req, res) => {
  console.log("Sending data...");
  let baseTime = new Date().getTime();

  // Sends up to 100MiB or for 15 seconds, whichever comes first.
  for (let i = 0; i < 100; i++) {
    let currentTime = new Date().getTime();
    if (currentTime - baseTime > 15000) {
      console.log('15s elapsed');
      break;
    }
    res.write(randomData);
  }
  console.log('Finished sending data');
  res.end();
});

app.post('*', (req, res) => {
  console.log('Receiving data...');
  let baseTime = new Date().getTime();
  let dataSize = 0;
  req.on('data', (data) => {
    dataSize += data.length;
    let currentTime = new Date().getTime();
    if (currentTime - baseTime > 1000) {
      console.log('Received ' + (dataSize * 8) + ' bits');
    }
  });
  req.on('end', () => {
    console.log('Received ' + (dataSize * 8) + ' bits');
    res.sendStatus(200);
  })
});

http.createServer(app).listen(port, host, () => {
  console.log('Hosting speedtest server on port ' + port + ', host ' + host + ', and path ' + path);
});
