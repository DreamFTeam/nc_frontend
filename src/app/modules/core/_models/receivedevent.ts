import { Message } from './message';
import { EventType } from './eventtype';

export class ReceivedEvent{
    message: Message;
    type: EventType;
}