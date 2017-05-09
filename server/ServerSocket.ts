import * as Restify from 'restify';
import * as SocketIo from "socket.io";
import MockServer from './MockServer';

export default class ServerSocket {    
    static listen(server: Restify.Server, mockServer: MockServer) {
        let io = SocketIo.listen(server.server);
        mockServer.getEventEmitter().on(MockServer.CHANGE, (arg: any) => {
            try {
                io.emit(MockServer.CHANGE, arg);
            } catch (e) {
                console.log('ServerSocket');
                console.log(e);
            };
            
        });
    }
}