import { _decorator, Button, Component, Node, Prefab } from 'cc';
import { QueueManager, QueueEventType, QueueEvent, } from './QueueManager';
const { ccclass, property } = _decorator;

@ccclass('UnitListController')
export class UnitListController extends Component {
    @property(Node)
    private charactersContainer: Node | null;
    @property(Button)
    private closeButton: Button | null;
    @property(Prefab)
    private characterDataPrefab: Prefab | null;

    start(): void {
        this.recreateAll()
        closeButton.on
    }

    recreateAll() {
        charactersContainer.removeAllChildren();
    }

    add() {
        charactersContainer
    }

    close() {
        this.node.destroy();
    }

    eventHandler(event: QueueEvent) {
        if (event.type = QueueEventType.PROCESS_END) {
            add(event.item)
        }
    }

}


