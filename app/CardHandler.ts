import { RxHttpRequest } from 'rx-http-request/browser';
import { Message, OPERATION_ADD, OPERATION_EDIT, OPERATION_REMOVE } from '../lib/Message';
import * as Rx from 'rxjs/Rx';
import * as SocketClient from 'socket.io-client';
import {Observable} from "rxjs/Rx";
import {Card} from "../lib/Card";

export default class CardHandler {
    private domain = 'http://localhost:5000';
    private options = {
        json: true
    };
    private socket;
    constructor() {
        this.createSocket();
    }
    private createSocket() {
        this.socket = Rx.Observable.webSocket({
            url: 'ws://localhost:5000',
        });
        this.socket.WebSocketCtor = (url) => {
            let socket = SocketClient(url);
            socket.on('CHANGE',
                data => {
                    //console.log(data);
                    console.log('WebSocketCtor');
                    socket.onmessage({
                        data: JSON.stringify(data),
                    });
                }
            );

            return socket;
        };
        this.addOperators();
    }
    private addOperators() {
        Rx.Observable.prototype.filterByOperation = function (operation: string) {
            return this.filter((mess: Message) => mess.operation == operation);
        };
        Rx.Observable.prototype.takeCard = function () {
            return this.map((mess: Message) => mess.card);
        };
    }
    private uri(uri: string) {
        return this.domain + uri;
    }
    delete$(card: Card) {
        return RxHttpRequest.delete(this.uri('/cards/' + card.id));
    }
    put$(card: Card) {
        return RxHttpRequest.put(this.uri('/cards/' + card.id), {
                form: {card}
            })
            .map(res => JSON.parse(res.body))
        ;
    }
    post$(card: Card) {
        return RxHttpRequest.post(this.uri('/cards'), {
            form: {card}
        });
    }
    list$() {
        let list$ = RxHttpRequest.get(this.uri('/cards'), this.options)
            .map(res => res.body)
            .flatMap(objects => Rx.Observable.from(objects))
            ;
        let socket$ = this.socket
            .filterByOperation(OPERATION_ADD)
            .takeCard()
        ;

        return Observable.merge(list$, socket$);
    }
    edit$() {
        return this.socket
            .filterByOperation(OPERATION_EDIT)
            .takeCard()
        ;
    }
    remove$() {
        return this.socket
            .filterByOperation(OPERATION_REMOVE)
            .takeCard()
        ;
    }
}