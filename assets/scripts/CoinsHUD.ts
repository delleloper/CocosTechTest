import { _decorator, Component, Label, Node, RichText } from 'cc';
import { CurrencyEventType, CurrencyManager, QueueEvent } from './CurrencyManager';
const { ccclass, property } = _decorator;

@ccclass('CoinsHUD')
export class CoinsHUD extends Component {
    @property(CurrencyManager)
    private currrencyManager: CurrencyManager;
    @property(Label)
    private moneyLabel: Label;

    start(): void {
        this.currrencyManager.subscribe(this.handleChanges.bind(this))
    }

    handleChanges(event: QueueEvent) {
        if (event.type === CurrencyEventType.SPENT) {
            //SHOW
        }
        if (event.type === CurrencyEventType.CHANGED) {
            this.moneyLabel.string = event.item
         }
    }

}


