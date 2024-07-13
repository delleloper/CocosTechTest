import { _decorator, Component, Label, Node } from 'cc';
import { CharacterHireButtonController } from './CharacterHireButtonController';
const { ccclass, property } = _decorator;

@ccclass('CharacterDataController')
export class CharacterDataController extends Component {
    @property(Label)
    private rankLabel: Label;
    @property(Label)
    private costLabel: Label;
    @property(Label)
    private typeLabel: Label;
    @property(Label)
    private summonLabel: Label;
    @property(Label)
    private nameLabel: Label;
    @property(Label)
    private descriptionLabel: Label;
    @property(CharacterHireButtonController)
    private characterIcon: CharacterHireButtonController;





}


