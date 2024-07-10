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

    @property([SpriteFrame])
    public spriteArrayCharacters: SpriteFrame[] = [];
    @property([SpriteFrame])
    public spriteArraytypes: SpriteFrame[] = [];
    @property([SpriteFrame])
    public spriteArrayRanks: SpriteFrame[] = [];


    setProgress(value: number) {
        if (this.progressBarComponent != null) {
            this.progressBarComponent.progress = value;
        }
    }
}


