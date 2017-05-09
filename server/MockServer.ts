import { Card } from '../lib/Card';
import { Message, OPERATION_ADD, OPERATION_EDIT, OPERATION_REMOVE } from '../lib/Message';
import * as Faker from 'faker';
import * as _ from 'underscore';
import { EventEmitter } from "events";
import * as Restify from "@types/restify";

export default class MockServer {
    static readonly CHANGE: string = 'CHANGE';

    private cards: Card[] = [];
    private currentId = 1;
    private eventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
        for (let i = 0; i < 10; i++) {
            this.doAddCard(this.makeMockCard());
        }
        setInterval(() => {
            let pos = Math.floor((Math.random() * this.cards.length));
            let current = this.cards[pos];
            let posCase = Math.floor((Math.random() * 3));
            switch (posCase) {
                case 0:
                    if (this.cards.length < 10) {
                        this.doAddCard(this.makeMockCard());
                    }
                    break;
                case 1:
                    current.text = Faker.lorem.sentence.call();
                    current.userEmail = Faker.internet.email();
                    this.doEditCard(current);
                    break;
                default:
                    if (this.cards.length > 3) {
                        this.doRemoveCard(current.id);
                    }
            }
        }, 10000);
    }
    getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }
    emit(card: Card, operation: string) {
        let message: Message = {
            card: card,
            operation: operation,
        };
        this.getEventEmitter().emit(MockServer.CHANGE, message);
    }
    list(req: Restify.Request, res: Restify.Response, next: Restify.Next) {
        res.send(this.cards);

        return next();
    }
    doRemoveCard(id) {
        let index = _.findIndex(this.cards, {
            id: id,
        });
        if (index == -1) {
            return;
        }
        let card = this.cards[index];
        this.cards = _.filter(this.cards, (item: Card) => {
            return id != item.id;
        });
        this.emit(card, OPERATION_REMOVE);
    }
    removeCard(req: Restify.Request, res: Restify.Response, next: Restify.Next) {
        this.doRemoveCard(parseInt(req.params.id));
        res.send();

        return next();
    }
    doEditCard(card: Card, callback: () => void = null) {
        let index = _.findIndex(this.cards, {
            id: card.id,
        });
        if (index == -1) {
            return;
        }
        this.cards[index] = card;
        if (callback) {
            callback();
        }
        this.emit(card, OPERATION_EDIT);
    }
    editCard(req: Restify.Request, res: Restify.Response, next: Restify.Next) {
        let card: Card = req.params.card;
        card.id = parseInt(req.params.card.id);
        this.doEditCard(card, () => {
            res.send(card);
        });

        return next();
    }
    doAddCard(card: Card) {
        if (card.text == 'card_error') {
            throw new Error('card error, can not was add');
        }
        card.id = this.currentId++;
        this.cards.push(card);
        this.emit(card, OPERATION_ADD);
    }
    addCard(req: Restify.Request, res: Restify.Response, next: Restify.Next) {
        try {
            this.doAddCard(req.params.card);
            res.send();
        } catch (e: Error) {
            console.log('errro');
            res.status(400);
            res.end();
        }

        return next();
    }
    private makeMockCard(): Card {
        let card: Card = {};
        card.text = Faker.lorem.sentence.call();
        card.userEmail = Faker.internet.email();

        return card;
    }
}