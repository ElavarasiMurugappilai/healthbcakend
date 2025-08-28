// Save this as check-port.js in your backend folder
const net = require('net');

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(port, (err) => {
      if (err) {
        resolve(false); // Port is in use
      } else {
        server.close(() => {
          resolve(true); // Port is available
        });
      }
    });
    
    server.on('error', (err) => {
      resolve(false); // Port is in use
    });
  });
}

async function findAvailablePort(startPort = 5000) {
  for (let port = startPort; port <= startPort + 10; port++) {
    const available = await checkPort(port);
    if (available) {
      console.log(`✅ Port ${port} is available`);
      return port;
    } else {
      console.log(`❌ Port ${port} is in use`);
    }
  }
  console.log("No available ports found in range");
  return null;
}

// Check ports 5000-5010
findAvailablePort(5000).then(port => {
  if (port) {
    console.log(`\n🚀 You can use port ${port}`);
    console.log(`Update your .env file: PORT=${port}`);
    console.log(`Update your frontend API URL: http://localhost:${port}/api`);
  }
});