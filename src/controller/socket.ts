import * as socketIo from 'socket.io-client';
import events = require('events');
import { Config } from '../util/config';
import { buildQueryString } from '../util';

export class Socket extends events.EventEmitter{
    playerName : string = '';
    roomName : string = '';
    _socket: any;
    constructor(){
        super()
    }

    get socket(){
        return this._socket;
    }

    setName(player: string){
        this.playerName = player;
    }

    setRoom(room : string){
        this.roomName = room;
    }

    connect(){
        const query = buildQueryString({room: this.roomName, name: this.playerName});
        this._socket = socketIo(Config.baseUrl, {query})
        this._socket.on('connect', this.onConnected);
        this._socket.on('disconnect', this.onDisconnected)
    }

    onConnected = () =>{
        console.log("connected");
        this.emit('connected');
    }
    
    onDisconnected = () => {
        console.log("disconnected");
        this.emit('disconnected');
    }
}