import * as Restify from 'restify';
import { Request, Response, Route } from "@types/restify";
import MockServer from './MockServer';
import ServerSocket from './ServerSocket';

let mockServer = new MockServer();

var api = Restify.createServer({
    name: 'rx-test'
});
Restify.CORS.ALLOW_HEADERS.push('x-access-token');
api.use(Restify.CORS());
api.pre(Restify.pre.sanitizePath());
api.use(Restify.acceptParser(api.acceptable));
api.use(Restify.bodyParser());
api.use(Restify.queryParser());
api.use(Restify.authorizationParser());
api.use(Restify.fullResponse());

api.on('uncaughtException',function(req: Request, res: Response, route: Route, error){
    console.error(error.stack);
    res.send(error);
});

api.get('/cards', mockServer.list.bind(mockServer));
api.del('/cards/:id', mockServer.removeCard.bind(mockServer));
api.put('/cards/:id', mockServer.editCard.bind(mockServer));
api.post('/cards', mockServer.addCard.bind(mockServer));

ServerSocket.listen(api, mockServer);
api.listen(5000, function() {
    console.log(`INFO: is running at ${api.url}`);
});