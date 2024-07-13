import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { Subject } from 'rxjs';

export enum QueueEventType {
    ENQUEUE,
    PROCESS_START,
    PROCESS_END,
}

export interface QueueEvent {
    type: QueueEventType;
    item: any;
}

@ccclass('QueueManager')
export class QueueManager extends Component {

    private processing = false;
    private queue = [];
    private processingProgress = 0;
    private timer = 0;
    private duration = -1;
    private currentElement: any;
    private size = 0;

    private queueSubject: Subject<QueueEvent> | null = null;


    init(size) {
        this.size = size;
        this.queue = [];
    }

    addToQueue(element: any) {
        if (this.isFull()) {
            return false;
        }
        else {
            this.queue.push(element);
            this.queueSubject.next({ type: QueueEventType.ENQUEUE, item: element })
            if (!this.processing) {
                this.startProcessing();
            }
            return true;
        }

    }

    isProcessing() {
        return this.processing;
    }

    protected update(dt: number): void {
        if (!this.processing) {
            if (this.queue.length != 0) {
                this.startProcessing()
            }
            return;
        }

        this.timer += dt;
        if (this.timer <= this.duration) {
            this.processingProgress = ((this.timer * 100) / this.duration) / 100;
        } else {
            this.processing = false;
            this.ready(this.currentElement);
        }
    }

    private startProcessing() {
        if (this.queue.length > 0) {
            this.currentElement = this.queue[0];
            this.processing = true;
            this.duration = this.currentElement.summonCooldown;
            this.timer = 0;
            this.queueSubject.next({ type: QueueEventType.PROCESS_START, item: this.currentElement })
        }

    }

    getProgress() {
        return this.processingProgress;
    }

    getCurrentElement() {
        return this.currentElement;
    }

    isFull() {
        return this.queue.length == this.size;
    }

    ready() {
        this.queueSubject.next({ type: QueueEventType.PROCESS_END, item: this.currentElement });
        this.currentElement = null
        this.queue.shift();

    }

    subscribe(handler) {
        if (this.queueSubject == null) {
            this.queueSubject = new Subject<QueueEvent>();
        }
        return this.queueSubject.subscribe(event => handler(event))
    }


}


