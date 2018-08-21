import { DendriteConsumedEvent } from "./dendrite-consumed-event";

export interface EventHandlerMapping {
  eventName: string;
  handlerFunction: (event: DendriteConsumedEvent<any>) => void;
}