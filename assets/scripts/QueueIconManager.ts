import { _decorator, Component, Node, ProgressBar, Sprite, SpriteFrame, } from 'cc';
import { QueueEventType } from './QueueManager';
const { ccclass, property } = _decorator;

@ccclass('QueueIconManager')
export class QueueIconManager extends Component {


    @property({ type: ProgressBar })
    public progressBarComponent: ProgressBar | null = null;
    @property({ type: Sprite })
    public rank: Sprite | null = null;
    @property({ type: Sprite })
    public type: Sprite | null = null;
    @property({ type: Sprite })
    public portrait: Sprite | null = null;

    private currentCharacter = null;

    setup(character) {
        this.currentCharacter = character;
        this.portrait.spriteFrame = character.portrait;
        this.rank.spriteFrame = character.rankIcon;
        this.type.spriteFrame = character.typeIcon;
        this.progressBarComponent.progress = 0;
    }

    isAvaliable() {
        return this.currentCharacter == null;
    }

    characterReady() {
        this.currentCharacter = null;
        this.portrait.spriteFrame = null;
        this.rank.spriteFrame = null;
        this.type.spriteFrame = null;
        this.progressBarComponent.progress = 0;

    }

    setProgress(value) {
        this.progressBarComponent.progress = value;
    }

    // handleEvent(event: QueueEvent) {
    //     if(this.currentCharacter == null){
    //         return
    //     }
    //     if (event.type === QueueEventType.PROCESS_END) {
    //         this.characterReady()
    //     }
    //     if (event.type === QueueEventType.PROCESSING) {
    //         this.progressBarComponent.progress = event.item;
    //     }
    // }
}

