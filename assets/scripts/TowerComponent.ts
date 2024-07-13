import { _decorator, color, Color, Component, debug, easing, EventMouse, Input, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { UiManager } from './UiManager';
import { QueueEventType, QueueManager } from './QueueManager';
const { ccclass, property } = _decorator;
const buildingId = "hire_tower";

@ccclass('TowerComponent')
export class TowerComponent extends Component {

    @property(UiManager)
    private uiManager: UiManager;

    @property(QueueManager)
    private QueueManager: QueueManager;

    @property(Sprite)
    private rayIcon: Sprite;
    @property(Sprite)
    private towerSprite: Sprite;
    @property(UIOpacity)
    public opacity: UIOpacity | null = null;


    private durationtime = 0.5;
    private queueProcessing = false;
    private uiOpen = false;

    private uiPanel;

    onLoad() {
        this.towerSprite.node.on(Input.EventType.MOUSE_DOWN, this.onClickedTower, this);
        this.QueueManager.subscribe(this.onQueue.bind(this));
        this.opacity.opacity = 0;
    }

    onClickedTower(event: EventMouse) {
        // manage panel opening
        console.log("Open creation menu");
        this.uiManager.showUnitCreationPanel(buildingId, this);
        this.uiOpen = true
        this.hideIcon();
    }

    onQueue(event: QueueEvent) {
        if (event.type === QueueEventType.PROCESS_START) {
            this.queueProcessing = true;
            this.showIcon();

        }
        if (event.type === QueueEventType.PROCESS_END) {
            this.queueProcessing = false;
            this.hideIcon();
        }
    }

    closedUi() {
        this.uiOpen = false;
        this.showIcon();
    }

    hideIcon() {
        console.log("hide");
        tween(this.opacity)
            .to(this.durationtime, { opacity: 0 })
            .start();


    }

    showIcon() {
        const movement = 30
        if (this.queueProcessing && !this.uiOpen) {
            console.log("show");

            tween(this.opacity)
                .to(this.durationtime, { opacity: 255 })
                .start();

            tween(this.rayIcon.node.position)
                .to(this.durationtime, new Vec3(this.rayIcon.node.position.x, this.rayIcon.node.position.y + movement, 0), {
                    easing: "rayIcon",
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.rayIcon.node.position = target;
                    }
                })
                .to(this.durationtime, new Vec3(this.rayIcon.node.position.x, this.rayIcon.node.position.y - movement, 0), {
                    easing: "rayIcon",
                    onUpdate: (target: Vec3, ratio: number) => {
                        this.rayIcon.node.position = target;
                    }
                })
                .union()
                .repeatForever()
                .start();
        }
    }




}


