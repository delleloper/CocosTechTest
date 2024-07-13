import { _decorator, Component, Node, Prefab, instantiate, UITransform, RichText, } from 'cc';
import { GameManager } from './GameManager';
import { UnitCreationPanelController } from './UnitCreationPanelController';
import { CurrencyManager } from './CurrencyManager';
import { TowerComponent } from './TowerComponent';
const { ccclass, property, integer } = _decorator;

@ccclass('UiManager')
export class UiManager extends Component {

    @property({ type: Prefab })
    private unitCreationPanelPrefab: Prefab = null;
    @property({ type: Prefab })
    private unitListPanelPrefab: Prefab = null;
    @property({ type: GameManager })
    private gameManager: GameManager = null;
    @property({ type: RichText })
    private debug: RichText = null;
    @property(CurrencyManager)
    private currencyManager: CurrencyManager | null = null;
    private unitsListPanel: Node;
    private unitsCreationListPanel: Node;
    @integer
    private unitCreationPanelX: number = 0;
    @integer
    private unitCreationPanely: number = 0;



    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onAnyClick, this);
    }

    onAnyClick(event: EventTouch) {
        if (this.targetUIElement) {
            const clickLocation = event.getUILocation();
            const uiTransform = this.targetUIElement.getComponent(UITransform);

            if (uiTransform) {
                const boundingBox = uiTransform.getBoundingBox();
                const containsClick = boundingBox.contains(clickLocation);

                if (!containsClick) {
                    this.handleClickOutside();
                }
            }
        }
    }

    onTargetUIClick(event: EventTouch) {
        event.propagationStopped = true;
    }

    handleClickOutside() {
        this.unitsCreationListPanel.active = false;
    }

    showUnitCreationPanel(buildingId: String, tower: TowerComponent) {
        if (this.unitsCreationListPanel == null) {
            this.unitsCreationListPanel = instantiate(this.unitCreationPanelPrefab);
            this.unitsCreationListPanel.setPosition(this.unitCreationPanelX, this.unitCreationPanely, 0);
            this.node.addChild(this.unitsCreationListPanel);
            this.unitsCreationListPanel.getComponent(UnitCreationPanelController).setup(buildingId, this.gameManager, this.currencyManager, tower)
            this.targetUIElement = this.unitsCreationListPanel
            this.targetUIElement.on(Node.EventType.TOUCH_START, this.onTargetUIClick, this);

        } else {
            this.unitsCreationListPanel.active = true;
        }
    }
}


