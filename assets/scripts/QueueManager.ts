import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QueueManager')
export class QueueManager extends Component {
    
    @property
    public queueSize : number = 5;
    

    start() {

    }

    update(deltaTime: number) {
        
    }
}


