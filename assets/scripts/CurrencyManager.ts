import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Subject } from 'rxjs';


export enum CurrencyEventType {
    CHANGED,
    SPENT
}

export interface CurrencyEvent {
    type: CurrencyEventType;
    item: number;
}



@ccclass('CurrencyManager')
export class CurrencyManager extends Component {
    private currentCurrency = 0;
    private currencySubject: Subject<QueueEvent> | null = null;

    setCurrency(value) {
        this.currentCurrency = value;
        this.currencySubject.next({ type: CurrencyEventType.CHANGED, item: this.currentCurrency })
    }

    subscribe(handler) {
        if (this.currencySubject == null) {
            this.currencySubject = new Subject<QueueEvent>();
        }
        this.currencySubject.subscribe(event => handler(event))
    }

    add(value) {
        this.currentCurrency += value;
    }

    spend(value) {
        if (this.canAfford(value)) {
            this.currentCurrency -= value;
        }
        this.currencySubject.next({ type: CurrencyEventType.CHANGED, item: this.currentCurrency })
        this.currencySubject.next({ type: CurrencyEventType.SPENT, item: value })
    }

    canAfford(value) {
        return this.currentCurrency - value >= 0;
    }
}


