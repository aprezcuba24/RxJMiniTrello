import CardHandler from './CardHandler';
import * as $ from "jquery";
import { Card } from '../lib/Card';
import * as _ from 'underscore';
import * as Rx from 'rxjs/Rx';

class HandlerView {
    private handler: CardHandler;
    static create() {
        return new HandlerView();
    }
    constructor() {
        this.handler = new CardHandler();
        this.addOperators();
        this.addSubscribe();
        this.removeSubscribe();
        this.editSubscribe();
        this.formAddSubscribe();
    }
    private addOperators() {
        Rx.Observable.prototype.fillForm = function (form: string, card: Card) {
            return this.do(() => {
                $('#' + form + ' .text').val(card.text);
                $('#' + form + ' .email').val(card.userEmail);
                $('#' + form + ' .id').val(card.id);
            });
        };
        Rx.Observable.prototype.getFormValue = function (form: string) {
            return this.map(() => {
                return {
                    id: $('#' + form + ' .id').val(),
                    text: $('#' + form + ' .text').val(),
                    userEmail: $('#' + form + ' .email').val(),
                }
            });
        };
        Rx.Observable.prototype.preventDefault = function (form: string) {
            return this.map(event => event.preventDefault());
        };
        Rx.Observable.prototype.showLoading = function (form: string) {
            return this.do(() => $('#' + form + ' .loading').show());
        };
        Rx.Observable.prototype.hideLoading = function (form: string) {
            return this.do(() => $('#' + form + ' .loading').hide());
        };
    }
    deleteEvent(card: Card) {
        Rx.Observable.fromEvent($('#item-delete-' + card.id), 'click')
            .preventDefault()
            .flatMap(() => this.handler.delete$(card))
            .subscribe()
        ;
    }
    editEvent(card: Card) {
        Rx.Observable.fromEvent($('#item-edit-' + card.id), 'click')
            .preventDefault()
            .fillForm('edit', card)
            .do(() => $('#edit').show())
            .flatMap(() => Rx.Observable.fromEvent($('#edit .send'), 'click').take(1))
            .getFormValue('edit')
            .showLoading('edit')
            .flatMap(card => this.handler.put$(card))
            .concat(
                this.handler.edit$()
                    .filter((socketCard: Card) => socketCard.id == card.id)
            )
            .hideLoading('edit')
            .subscribe(() => {
                $('#edit').fadeOut();
            })
        ;
    }
    formAddSubscribe() {
        Rx.Observable.fromEvent($('#add .send'), 'click')
            .getFormValue('add')
            .showLoading('add')
            .flatMap(card => this.handler.post$(card))
            .hideLoading('add')
            .subscribe(
                data => {
                    console.log(data);
                    $('#add .text').val('');
                    $('#add .email').val('')
                },
                err => console.log('fff')
            )
        ;
    }
    editSubscribe() {
        this.handler.edit$().subscribe(
            (card: Card) => {
                let li = $('#item-' + card.id);
                li
                    .fadeOut(() => {
                        li.find('.card').html(this.renderCard(card));
                        li.fadeIn(1000)
                    })
                ;
            }
        );
    }
    removeSubscribe() {
        this.handler.remove$().subscribe(
            (card: Card) => {
                let li = $('#item-' + card.id);
                li
                    .fadeOut(1000, () => {
                        li.remove();
                    })
                ;
            }
        );
    }
    addSubscribe() {
        this.handler.list$().subscribe(
            (card: Card) => {
                let li = $(this.renderLi(card));
                $('#list').append(li);
                this.deleteEvent(card);
                this.editEvent(card);
                li.hide().fadeIn(1000);
            }
        )
    }
    renderCard(card: Card) {
        let cardTemplate = _.template(
            '<span class="name"><%= text %></span>' +
            '<span class="email"><%= email %></span>'
        );

        return cardTemplate({
            text: card.text,
            email: card.userEmail,
            id: card.id
        });
    }
    renderLi(card: Card) {
        let cardTemplate = _.template(
            '<li id="item-<%= id %>">' +
                '<a href="#" class="item-delete" id="item-delete-<%= id %>">eliminar</a>' +
                '<a href="#" class="item-edit" id="item-edit-<%= id %>">editar</a>' +
                '<div class="card">' +
                    '<%= card %>' +
                '</div>' +
            '</li>'
        );

        return cardTemplate({
            card: this.renderCard(card),
            id: card.id
        });
    }
}

HandlerView.create();

Rx.Observable.fromEvent($('selector'), 'click')
    .do(() => {/*Fill form*/})
    .do(() => $('#edit').show())
    .flatMap(() => Rx.Observable.fromEvent($('#edit .send'), 'click').take(1))
    .map(() => {/*get form value*/})
    .do(() => {/*show loading*/})
    .flatMap(item => this.handler.put$(item))
    .concat(
        this.handler.edit$()
            .filter((socketCard: Card) => socketCard.id == item.id)
    )
    .do(() => {/*hide loading*/})
    .subscribe(() => {
        /*hide form*/
    })
;