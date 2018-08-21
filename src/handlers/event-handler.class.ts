import { Channel } from 'amqplib';
import { EventHandlerMapping } from '../models/event-handler-mapping';

export abstract class EventHandler {

  abstract register(): EventHandlerMapping[];
}