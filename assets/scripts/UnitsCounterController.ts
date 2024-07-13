import { _decorator, Component, Label, Node, UIOpacity } from 'cc';
import { QueueEvent, QueueEventType, QueueManager } from './QueueManager';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('UnitsCounterController')
export class UnitsCounterController extends Component {

    @property(Label)
    private counter: Label;
    @property(QueueManager)
    private queueManager: QueueManager;
    @property(GameManager)
    private gameManager: GameManager;
    @property(UIOpacity)
    private opacity: GameManager;

    protected onLoad(): void {
        this.queueManager.subscribe((event: QueueEvent) => {
            if (event.type == QueueEventType.PROCESS_END) {
                this.counter.string = this.gameManager.createdHeroes.length;
                this.opacity.opacity = 225;
            }
        });
    }
}




