import { DendriteConsumedEvent } from '..';

export interface EventHandlerMapping {
  eventName: string;
  handlerFunction: (event: DendriteConsumedEvent<any>) => void;
}