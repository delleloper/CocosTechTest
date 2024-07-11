import { _decorator, Component, Node, Prefab,instantiate } from 'cc';
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
    
    private unitsListPanel :Node;
    private unitsCreationListPanel :Node;

    showUnitCreationPanel(buildingId: String){
        if (this.unitsListPanel == null){
            this.unitsCreationListPanel = instantiate(this.unitCreationPanelPrefab);
            this.unitsCreationListPanel.setPosition(0,0,0);
            this.node.addChild(this.unitsCreationListPanel);
            this.unitsCreationListPanel.getComponent(UnitCreationPanelController).setup(buildingId,this.gameManager)
        } else{
            this.unitsCreationListPanel.active = false;
        }
    }
}


