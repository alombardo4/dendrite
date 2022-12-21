import { DendriteEvent } from '../event/dendrite-event'
import { JSONSerde } from './json-serde'

describe(JSONSerde.name, () => {
  class MockEvent extends DendriteEvent {
    constructor(
      id: string,
      public name: string,
      public time: Date,
      public bool: boolean
    ) {
      super(id)
    }
  }

  describe('deserialize', () => {
    it('should convert from a JSON string', () => {
      const mockObj = new MockEvent(
        '1',
        'name',
        new Date(2022, 1, 2, 3, 4, 5, 6),
        false
      )
      const result = new JSONSerde().deserialize(
        `{"aggregateId":"1","name":"name","time":"${mockObj.time.toISOString()}","bool":false}`,
        MockEvent.prototype
      )
      expect(result).toEqual(mockObj)
    })
  })

  describe('serialize', () => {
    it('should produce a JSON string', () => {
      const mockObj = new MockEvent(
        '1',
        'name',
        new Date(2022, 1, 2, 3, 4, 5, 6),
        false
      )
      const result = new JSONSerde().serialize(mockObj)
      expect(result).toEqual(
        `{"aggregateId":"1","name":"name","time":"${mockObj.time.toISOString()}","bool":false}`
      )
    })
  })
})
