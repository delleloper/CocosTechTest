/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { _decorator, Button, Color, Component, Input, input, instantiate, Label, Layout, Node, Prefab, RichText, UITransform } from 'cc';
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
        let buttons = [];
        for (const key in heroes) {
            const hero = heroes[key];
            const button = instantiate(this.hirebuttonPrefab);
            this.hirebuttonsContainer.node.addChild(button);
            const buttonController: CharacterHireButtonController = button.getComponent(CharacterHireButtonController)
            buttonController.setupButton(hero);
            buttons.push(buttonController)
            button.on(Button.EventType.CLICK, () => { this.onCharacterClicked(buttonController) })
        }
        this.onCharacterClicked(buttons[0])
        this.firstFrame = this.queueFrames[0];

    }

    onCharacterClicked(button: CharacterHireButtonController) {
        if (this.selectedButton != null) {
            this.selectedButton.setSelected(false);
        }
        this.selectedButton = button;
        button.setSelected(true);
        this.selectedHero = button.getCharacter();
        this.updateHireButton();

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

    updateHireButton() {
        if (this.selectedHero != null) {

            this.hirePriceLabel.string = this.selectedHero.cost;

            if (this.selectedHero.cost <= this.currency && !this.queue.isFull()) {
                this.hirePriceLabel.color = Color.GREEN
                this.hireButton.interactable = true;
            } else {
                this.hirePriceLabel.color = Color.RED
                this.hireButton.interactable = false;
            }
        }
    }


    update(dt: number) {
        if (this.queue.isProcessing() && this.firstFrame != null) {
            this.firstFrame.setProgress(this.queue.getProgress());
        }

    }




}


