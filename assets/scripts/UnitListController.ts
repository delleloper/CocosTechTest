import { _decorator, Button, Component, instantiate, Node, Prefab } from 'cc';
import { QueueManager, QueueEventType, QueueEvent, } from './QueueManager';
import { GameManager } from './GameManager';
import { CharacterDataController } from './CharacterDataController';
const { ccclass, property } = _decorator;

@ccclass('UnitListController')
export class UnitListController extends Component {
    @property(Node)
    private charactersContainer: Node | null;
    @property(Button)
    private closeButton: Button | null;
    @property(Prefab)
    private characterDataPrefab: Prefab | null;
    private gameManager: GameManager
    private queueManager: QueueManager;
    setup(gameManager: GameManager, queue: QueueManager): void {
        this.gameManager = gameManager;
        this.queueManager = queue;
        this.recreateAll()
        queue.subscribe((event: QueueEvent) => {
            if (event.type == QueueEventType.PROCESS_END) {
                this.add(event.item)
            }
        });

    }

    recreateAll() {
        var heroes = this.gameManager.getCreatedHeroes()
        if (heroes.length > 0) {
            this.charactersContainer.removeAllChildren();
            heroes.forEach(element => {
                this.add(element)
            });
        }
    }

    add(characterData) {
        if (this.characterDataPrefab == null || this.characterDataPrefab == undefined) {
            return
        }

        var charData = instantiate(this.characterDataPrefab);
        this.charactersContainer.addChild(charData);
        charData.getComponent(CharacterDataController).setup(characterData);
    }

    close() {
        this.node.active = false;
    }


}


