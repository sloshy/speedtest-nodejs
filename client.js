const crypto = require('crypto');
const http = require('http');

let host, path, port;
let randomData = crypto.randomBytes(1024*1024*10);

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
  host = '127.0.0.1';
}
if (!port) {
  port = 3000;
}
if (!path) {
  path = '/';
}

// Set request options
let options = {
  hostname: host,
  path: path,
  port: port
};

// Debug log
console.log('Host: ' + host);
console.log('Port: ' + port);
console.log('Path: ' + path);

testDownload();

// Function definitions
function testDownload() {
  // Make a request and track the download speed
  console.log('Testing download speed...');
  http.get(options, (res) => {
    let oldSize = 0;
    let newSize = 0;
    let baseTime = new Date().getTime();

    res.on('error', () => {
      console.log('Error downloading! Please check your connection information.');
    });

    res.on('data', (data) => {
      newSize += data.length;
      let currentTime = new Date().getTime();
      if (currentTime - baseTime > 1000) {
        baseTime = currentTime;
        let sizeDiff = newSize - oldSize;
        console.log('Download speed: ' + (sizeDiff * 8) + ' Bits/sec');
        oldSize = newSize;
      }
    });

    // Estimate the final download speed based on the time passed
    res.on('end', () => {
      let currentTime = new Date().getTime();
      let finalTime = currentTime - baseTime;
      let finalSize = newSize - oldSize;
      let finalSpeed = (finalSize) / (finalTime/1000);
      console.log('Download size: ' + newSize * 8 + ' bits');
      console.log('Download speed: ' + Math.round(finalSpeed * 8) + ' bits/sec');
      testUpload();
    });
  });
}

function testUpload() {
  let baseTime = new Date().getTime();

  console.log('Testing upload speed...');
  options.method = 'POST';

  let req = http.request(options);

  req.on('error', () => {
    console.log('Error uploading! Please check your connection information.');
  });

  req.end(randomData, () => {
    let currentTime = new Date().getTime();
    let finalTime = currentTime - baseTime;
    let finalSpeed = (1024*1024*10) / (finalTime/1000);
    console.log('Upload size: ' + (1024*1024*10*8) + ' bits');
    console.log('Upload speed: ' + Math.round(finalSpeed * 8) + ' bits/sec');
  });
}