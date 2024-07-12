import { _decorator, Component, debug, EventMouse, Input } from 'cc';
import { UiManager } from './UiManager';
const { ccclass, property } = _decorator;



const buildingId = "hire_tower";

@ccclass('TowerComponent')
export class TowerComponent extends Component {

    @property(UiManager)
    private uiManager: UiManager;

    onLoad() {
        this.node.on(Input.EventType.MOUSE_DOWN, this.onClickedTower, this);
    }

    onClickedTower(event: EventMouse) {
        // manage panel opening
        console.log("Open creation menu");
        this.uiManager.showUnitCreationPanel(buildingId);
    }



}


