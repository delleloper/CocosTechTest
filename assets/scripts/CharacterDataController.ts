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



    setup(character) {
        this.characterIcon.setupButton(character);
        this.rankLabel.string = "Rank: " + character.rank.toUpperCase();
        this.costLabel.string = "Cost: " + character.cost;
        this.typeLabel.string = "Type: " + character.type.charAt(0).toUpperCase() + character.type.slice(1);
        this.summonLabel.string = "Summon Time: " + character.summonCooldown + "s";
        this.nameLabel.string = character.name;
        this.descriptionLabel.string = character.description;
    }

}


