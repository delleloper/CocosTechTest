import { _decorator, Button, Color, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CharacterHireButtonController')
export class CharacterHireButtonController extends Component {

    @property({ type: Sprite })
    private rank: Sprite | null = null;
    @property({ type: Sprite })
    private type: Sprite | null = null;
    @property({ type: Sprite })
    private portrait: Sprite | null = null;
    @property({ type: Sprite })
    private frame: Sprite | null = null;

    private buttonComponent: Button = new Button;

    setupButton(character) {
        this.rank.spriteFrame = character.rankIcon;
        this.type.spriteFrame = character.typeIcon;
        this.portrait.spriteFrame = character.portrait;
        this.buttonComponent = this.node.getComponent(Button)
    }

    setSelected(value: boolean) {
        this.frame.color = (value) ? Color.RED : Color.WHITE;
    }


}
