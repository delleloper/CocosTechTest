import { _decorator, Component, Node, Prefab, instantiate, UITransform, RichText, tween, Vec3, Button, Sprite, } from 'cc';
import { GameManager } from './GameManager';
import { UnitCreationPanelController } from './UnitCreationPanelController';
import { CurrencyManager } from './CurrencyManager';
import { TowerComponent } from './TowerComponent';
import { QueueManager } from './QueueManager';
import { UnitListController } from './UnitListController';
const { ccclass, property, integer } = _decorator;

@ccclass('UiManager')
export class UiManager extends Component {

    @property({ type: Prefab })
    private unitCreationPanelPrefab: Prefab = null;
    @property({ type: Prefab })
    private unitListPanelPrefab: Prefab = null;
    @property({ type: GameManager })
    private gameManager: GameManager = null;
    @property(CurrencyManager)
    private currencyManager: CurrencyManager | null = null;
    @property(QueueManager)
    private queue: QueueManager | null;
    @property(Node)
    private signpost: Node | null;

    private unitsListPanel: Node;
    private unitsCreationListPanel: Node;
    @integer
    private unitCreationPanelHiddenY: number = 0;
    @integer
    private unitCreationPanelY: number = 0;

    private durationTime = 0.5
    private panelSize;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onAnyClick, this);
        this.signpost.on(Node.EventType.TOUCH_START, this.showUnitsPanel, this);
    }

    onAnyClick(event: EventTouch) {
        if (this.targetUIElement && this.targetUIElement.active) {
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
        if (this.unitsCreationListPanel.isReady) {
            this.hidePanel();
        }

    }

    showUnitCreationPanel(buildingId: String, tower: TowerComponent) {
        if (this.unitsCreationListPanel == null) {
            this.unitsCreationListPanel = instantiate(this.unitCreationPanelPrefab);
            this.unitsCreationListPanel.isReady = false;
            this.node.addChild(this.unitsCreationListPanel);
            let trans = this.unitsCreationListPanel.getComponent(UITransform);
            this.panelSize = trans?.contentSize.height;
            this.unitsCreationListPanel.setPosition(0, this.unitCreationPanelY - this.panelSize, 0);
            this.unitsCreationListPanel.getComponent(UnitCreationPanelController).setup(buildingId, this.gameManager, this.currencyManager, tower)
            this.targetUIElement = this.unitsCreationListPanel
            this.targetUIElement.on(Node.EventType.TOUCH_START, this.onTargetUIClick, this);

        } else {
            this.unitsCreationListPanel.isReady = false
            this.unitsCreationListPanel.active = true;
        }

        tween(this.unitsCreationListPanel.position)
            .to(this.durationTime, new Vec3(0, this.unitCreationPanelY, 0), {
                easing: "linear",
                onUpdate: (target: Vec3, ratio: number) => {
                    this.unitsCreationListPanel.position = target;
                },
                onComplete: (target: Vec3, ratio: number) => {
                    this.unitsCreationListPanel.isReady = true;
                }
            })
            .start();

    }


    hidePanel() {
        if (this.unitsCreationListPanel == null) {
            return;
        }
        this.unitsCreationListPanel.isReady = false

        tween(this.unitsCreationListPanel.position)
            .to(this.durationTime / 2, new Vec3(0, this.unitsCreationListPanel.position.y - this.panelSize, 0), {
                easing: "linear",
                onUpdate: (target: Vec3, ratio: number) => {
                    this.unitsCreationListPanel.position = target;
                },
                onComplete: (target: Vec3, ratio: number) => {
                    this.unitsCreationListPanel.active = false;
                }
            })
            .start();
    }

    showUnitsPanel() {
        this.hidePanel();
        if (this.unitsListPanel == null) {
            this.unitsListPanel = instantiate(this.unitListPanelPrefab);
            this.unitsListPanel.setPosition(0, 0, 0);
            this.node.addChild(this.unitsListPanel);
            let controller = this.unitsListPanel.getComponent(UnitListController);
            controller.setup(this.gameManager, this.queue);
        } else {
            this.unitsListPanel.active = true;
        }
    }

}


