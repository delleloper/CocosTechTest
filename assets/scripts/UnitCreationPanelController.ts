/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { _decorator, Button, Color, Component, instantiate, Label, Layout, Node, Prefab, RichText } from 'cc';
import { GameManager } from './GameManager';
import { CharacterHireButtonController } from './CharacterHireButtonController';
import { QueueIconManager } from './QueueIconManager';
import { QueueManager, QueueEventType, QueueEvent } from './QueueManager';

const { ccclass, property } = _decorator;

@ccclass('UnitCreationPanelController')
export class UnitCreationPanelController extends Component {

    @property(Layout)
    private hirebuttonsContainer: Layout | null = null;
    @property(Prefab)
    private hirebuttonPrefab: Prefab | null = null;
    @property(QueueIconManager)
    private queueFrames: QueueIconManager[] = [];
    @property(Button)
    private hireButton: Button | null = null;
    @property(RichText)
    private title: RichText | null = null;
    @property(RichText)
    private subtitle: RichText | null = null;
    @property(Label)
    private hirePriceLabel: Label | null = null;
    // @property(QueueManager)
    private queue: QueueManager | null


    private selectedButton: CharacterHireButtonController | null = null;
    private selectedHero: any | null = null;
    private currency = 700;
    private queue_size = 5 //REPLACE
    private firstFrame = null


    setup(buildingId: string, gameManager: GameManager) {
        const heroes = gameManager.getHeroes();
        const buildingData = gameManager.buildingsData[buildingId];

        this.title.string = buildingData.name;
        this.subtitle.string = buildingData.description;
        this.hireButton.node.on(Button.EventType.CLICK, this.onHireClicked, this);

        this.queue = gameManager.node.getComponent(QueueManager)

        this.queue.init(buildingData.settings.hireSlots);
        this.queue.queueSubject.subscribe(event => this.handleEvent(event));
        for (const key in heroes) {
            const hero = heroes[key];
            const button = instantiate(this.hirebuttonPrefab);
            this.hirebuttonsContainer.node.addChild(button);
            const buttonController: CharacterHireButtonController = button.getComponent(CharacterHireButtonController)
            buttonController.setupButton(hero);
            button.on(Button.EventType.CLICK, () => { this.onCharacterClicked(hero, buttonController) })

        }
    }

    onCharacterClicked(hero, button: CharacterHireButtonController) {
        if (this.selectedButton != null) {
            this.selectedButton.setSelected(false);
        }
        this.selectedButton = button;
        button.setSelected(true);
        this.hirePriceLabel.string = hero.cost;
        this.selectedHero = hero;

        if (hero.cost <= this.currency) {
            this.hirePriceLabel.color = Color.GREEN
            this.hireButton.enabled = true;
        } else {
            this.hirePriceLabel.color = Color.RED
            this.hireButton.enabled = false;
        }
    }

    updateFrames() {
        const children = this.queueFrames;
        children.sort((a, b) => {
            const aActive = a.getComponent(QueueIconManager).isAvaliable();
            const bActive = b.getComponent(QueueIconManager).isAvaliable();
            if (aActive && !bActive) {
                return 1;
            } else if (!aActive && bActive) {
                return -1;
            } else {
                return 0;
            }
        });
        children.forEach((child, index) => {
            child.node.setSiblingIndex(child, index);
        });
        this.firstFrame = children[0];
    }


    onHireClicked() {
        const result = this.queue.addToQueue(this.selectedHero);
        if (!result) {
            console.log("QUEUE FULL");
        }
    }

    handleEvent(event: QueueEvent) {
        if (event.type === QueueEventType.ENQUEUE) {
            console.log(`ClassB: Elemento añadido a la cola: ${event.item.id}`);
            const available = this.queueFrames.find(element => element.isAvaliable());
            if (available) {
                available.setup(event.item);
            } else {
                console.log("NO AVALIABLE FRAMES")
            }
        } else if (event.type === QueueEventType.PROCESS_END) {
            this.firstFrame.characterReady();
            console.log(`ClassB: Finalizando el procesamiento: ${event.item.id}`);

        }
        this.updateFrames();
    }

    update(dt: number) {
        if (this.queue.isProcessing()) {
            this.firstFrame.setProgress(this.queue.getProgress());
        }
        this.hireButton.enabled = !this.queue.isFull();
    }


}


