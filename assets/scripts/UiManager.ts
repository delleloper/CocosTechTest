import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiManager')
export class UiManager extends Component {

    @property({ type: Prefab })
    private unitCreationPanelPrefab: Prefab = null;
    @property({ type: Prefab })
    private unitListPanelPrefab: Prefab = null;
    
    private unitsListPanel :Node;
    private unitsCreationListPanel :Node;

    showUnitCreationPanel(){
        if (this.unitsListPanel == null){
            let scene = director.getScene();
            this.unitsCreationListPanel = instantiate(this.unitCreationPanelPrefab);
            this.unitsCreationListPanel.parent = scene;
            this.unitsCreationListPanel.setPosition(0,0,0);
        } else{
            this.unitsCreationListPanel.active = false;
        }
    }
}


