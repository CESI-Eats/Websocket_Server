import {Server, Socket} from 'socket.io';
import { initLapinou } from './lapinou';

const sockets: Map<string, Socket> = new Map();
const ids: Map<Socket, string> = new Map();

const io = new Server(3000);

initLapinou();

io.on('connection', (socket: Socket) => {
    console.log('IO: a user connected');
    socket.on('setClientId', (clientId: string) => {
        sockets.set(clientId, socket);
        ids.set(socket, clientId);
    });
    socket.on('disconnect', () => {
        sockets.delete(ids.get(socket)??'');
        ids.delete(socket);
    });
});

export { sockets }