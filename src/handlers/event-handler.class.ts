import { Channel } from 'amqplib';
import { EventHandlerMapping } from '.';

export abstract class EventHandler {

  abstract register(): EventHandlerMapping[];
}