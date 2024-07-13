import { _decorator, Component, Node, Prefab, instantiate, UITransform, Input, RichText, input } from 'cc';
import { GameManager } from './GameManager';
import { UnitCreationPanelController } from './UnitCreationPanelController';
const { ccclass, property } = _decorator;

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
    private unitsListPanel: Node;
    private unitsCreationListPanel: Node;


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
        // Handle the click on the target UI element
        event.propagationStopped = true;
    }

    handleClickOutside() {
        this.unitsCreationListPanel.active = false;
    }

    showUnitCreationPanel(buildingId: String) {
        if (this.unitsCreationListPanel == null) {
            this.unitsCreationListPanel = instantiate(this.unitCreationPanelPrefab);
            this.unitsCreationListPanel.setPosition(0, 0, 0);
            this.node.addChild(this.unitsCreationListPanel);
            this.unitsCreationListPanel.getComponent(UnitCreationPanelController).setup(buildingId, this.gameManager)
            this.targetUIElement = this.unitsCreationListPanel
            this.targetUIElement.on(Node.EventType.TOUCH_START, this.onTargetUIClick, this);
        } else {
            this.unitsCreationListPanel.active = true;
        }
    }
}


