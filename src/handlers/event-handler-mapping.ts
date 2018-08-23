import { DendriteEvent } from '../events';

export interface EventHandlerMapping {
  eventName: string;
  handlerFunction: (event: DendriteEvent) => void;
}