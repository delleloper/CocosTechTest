import { _decorator, Component, Node, ProgressBar, Sprite, SpriteFrame, } from 'cc';
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

    private processing = false
    private currentCharacter = {};
    private progress = 0
    private timer = 0;
    private duration = -1;
    private callback;

    addToQueue(character, parentCallback) {
        this.processing = true;
        this.currentCharacter = character;
        this.portrait.spriteFrame = character.portrait;
        this.rank.spriteFrame = character.rankIcon;
        this.type.spriteFrame = character.typeIcon;
        this.timer = 0;
        this.duration = character.summonCooldown;
        this.progressBarComponent.progress = 0;
        this.callback = parentCallback;
    }

    protected update(dt: number): void {
        if (!this.processing) {
            return
        }
        this.timer += dt;
        if (this.timer <= this.duration) {
            this.progressBarComponent.progress = ((this.timer * 100) / this.duration) / 100;
        } else {
            this.processing = false;
            this.characterReady();
        }
    }

    isAvaliable() {
        return !this.processing;
    }

    characterReady() {
        this.currentCharacter = {};
        this.portrait.spriteFrame = null;
        this.rank.spriteFrame = null;
        this.type.spriteFrame = null;
        this.remainingTime = -1;
        this.progressBarComponent.progress = 0;
        console.log("READY")
        this.callback();
    }

}


