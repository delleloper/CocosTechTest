import { _decorator, Button, Color, Component, instantiate, Label, Layout, Node, Prefab } from 'cc';
import { GameManager } from './GameManager';
import { CharacterHireButtonController } from './CharacterHireButtonController';
import { QueueIconManager } from './QueueIconManager';

const { ccclass, property } = _decorator;

@ccclass('UnitCreationPanelController')
export class UnitCreationPanelController extends Component {

    @property(Layout)
    private hirebuttonsContainer: Layout = null;
    @property(Prefab)
    private hirebuttonPrefab: Prefab = null;
    @property(QueueIconManager)
    private queueFrames: QueueIconManager[] = [];
    @property(Button)
    private hireButton: Button | null = null;
    @property(Label)
    private hirePriceLabel: Label | null = null;


    private selectedButton: CharacterHireButtonController | null = null;
    private selectedHero: any | null = null;
    private currency = 700;

    setup(buildingId: string, gameManager: GameManager) {
        const heroes = gameManager.getHeroes();
        this.hireButton.node.on(Button.EventType.CLICK, this.onHireClicked, this);

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

    onReady() {
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
    }


    onHireClicked() {
        const available = this.queueFrames.find(element => element.isAvaliable());
        if (available) {
            available.addToQueue(this.selectedHero, this.onReady.bind(this));
        } else {
            console.log("QUEUE FULL");
        }
        const children = this.node.children;
    }


}


