
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const cors = require('cors');

const commJs = require('./comm.js');
const worldJs = require('./world.js');

const commBus = commJs.CommunicationBus();
const world = worldJs.World();

world.commBus = commBus;
world.start();
const router = express.Router();

const datastoreJs = require('./datastore.js');
const datastore = new datastoreJs.Datastore();
datastore.initialize();

const appServices = require('./services.js');
appServices.configure(router,commBus,datastore,world);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
commBus.linkToWebSocket(wss);

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});
