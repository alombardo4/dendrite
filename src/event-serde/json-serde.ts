import { DendriteEvent } from '../event/dendrite-event'
import { EventSerde } from './event-serde'

const ISODateRegex = new RegExp(
  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
)

export class JSONSerde extends EventSerde {
  private static customParser(this: any, key: string, value: unknown): any {
    // Date check
    if (typeof value === 'string' && value.match(ISODateRegex)?.length > 0) {
      return new Date(value)
    }
    return value
  }

  private static customSerializer(this: any, key: string, value: any): any {
    if (value instanceof Date) {
      return value.toISOString()
    }
    return value
  }

  serialize<T extends DendriteEvent>(obj: T): string {
    return JSON.stringify(obj, JSONSerde.customSerializer)
  }
  deserialize<T extends DendriteEvent>(raw: string, constructor: T): T {
    const rawObj = JSON.parse(raw, JSONSerde.customParser)
    return Object.assign(constructor, rawObj)
  }
}
