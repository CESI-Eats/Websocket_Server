import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import {Server, Socket} from 'socket.io';
import { initLapinou } from './lapinou';

const sockets: Map<string, Socket> = new Map();
const ids: Map<Socket, string> = new Map();

const io = new Server(Number(process.env.PORT) || 3000);

initLapinou();

io.on('connection', (socket: Socket) => {
    // console.log('IO: a user connected');
    socket.on('setClientId', (token: string) => {
        const id = jwt.decode(token)?.sub;
        sockets.set(String(id), socket);
        ids.set(socket, String(id));
        console.log('IO: a user connected as ' + id);
    });
    socket.on('disconnect', () => {
        console.log('IO: a user disconnected');
        sockets.delete(ids.get(socket)??'');
        ids.delete(socket);
    });
});

export { sockets }