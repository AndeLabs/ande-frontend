const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const containers = ['single-sequencer', 'ev-reth-sequencer', 'local-da'];

wss.on('connection', (ws) => {
  console.log('Client connected');

  containers.forEach(container => {
    const dockerLogs = spawn('docker', ['logs', '-f', container]);

    dockerLogs.stdout.on('data', (data) => {
      ws.send(JSON.stringify({ container, line: data.toString() }));
    });

    dockerLogs.stderr.on('data', (data) => {
      ws.send(JSON.stringify({ container, line: `ERROR: ${data.toString()}` }));
    });

    dockerLogs.on('close', (code) => {
      ws.send(JSON.stringify({ container, line: `child process exited with code ${code}` }));
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Log server listening on port 8080');
});
