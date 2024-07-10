import { _decorator, Component, EventMouse, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TowerComponent')
export class TowerComponent extends Component {
    onLoad() {
        this.node.on(Input.EventType.MOUSE_DOWN, this.onClickedTower, this);
    }

    onClickedTower(event: EventMouse) {
        // manage panel opening
        console.log("Open creation menu");
    }
}


