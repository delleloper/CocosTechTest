import { _decorator, Component, Label, Node, RichText, tween, UIOpacity, Vec3 } from 'cc';
import { CurrencyEventType, CurrencyManager, QueueEvent } from './CurrencyManager';
const { ccclass, property } = _decorator;

@ccclass('CoinsHUD')
export class CoinsHUD extends Component {
    @property(CurrencyManager)
    private currrencyManager: CurrencyManager;
    @property(Label)
    private moneyLabel: Label;
    @property(Label)
    private spendEffect: Label;
    @property(UIOpacity)
    public opacity: UIOpacity | null = null;

    private durationTime = 0.8
    private movement = 100
    private startPosition;

    start(): void {
        this.currrencyManager.subscribe(this.handleChanges.bind(this))
        this.startPosition = new Vec3(this.spendEffect.node.position.x, this.spendEffect.node.position.y, this.spendEffect.node.position.z);
    }

    handleChanges(event: QueueEvent) {
        if (event.type === CurrencyEventType.CHANGED) {
            this.moneyLabel.string = event.item
        }
        if (event.type === CurrencyEventType.SPENT) {
            this.spendEffect.string = -event.item
            this.spendEffect.node.position = this.startPosition;
            this.opacity.opacity = 255
            tween(this.opacity)
                .to(this.durationTime, { opacity: 0 })
                .start();

            tween(this.spendEffect.node.position)
                .to(this.durationTime * 3, new Vec3(0, this.spendEffect.node.position.y + this.movement, 0), {
                    easing: "linear",
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.spendEffect.node.position = target;
                    },
                    onComplete: () => {
                        this.spendEffect.node.position = this.startPosition;
                    }
                })
                .start();
        }

    }

}


