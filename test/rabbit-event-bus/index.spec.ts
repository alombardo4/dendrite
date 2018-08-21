import { RabbitEventBus } from '../../src';
import * as uuid from 'uuid';

describe('Rabbit Event Bus Implementation', () => {
    const connectionString = 'amqp://localhost:5672';

    it('adding topic bindings to a non-consumer should throw an error', () => {
        // Arrange
        const eventBus = new RabbitEventBus(connectionString, { isProducer: true, isConsumer: false });

        // Act
        try {
            eventBus['registerTopicBindings'](['topic1']);
            throw new Error('Error was not received');
        } catch (e) {
            // Assert
            expect(e.message).toBe('Topic bindings can only be registered by consumers');
        }
    });

    it('adding empty topic bindings should throw an error', () => {
        // Arrange
        const eventBus = new RabbitEventBus(connectionString, { isProducer: true, isConsumer: true }, uuid.v4());

        // Act
        try {
            eventBus['registerTopicBindings']([]);
            throw new Error('Error was not received');
        } catch (e) {
            // Assert
            expect(e.message).toBe('At least one topic binding must be provided');
        }
    });

    it('adding topic bindings before connecting should throw an error', () => {
        // Arrange
        const eventBus = new RabbitEventBus(connectionString, { isProducer: true, isConsumer: true }, uuid.v4());

        // Act
        try {
            eventBus['registerTopicBindings'](['test.event.name']);
            throw new Error('Error was not received');
        } catch (e) {
            // Assert
            expect(e.message).toBe('A connection to rabbit must be established before registering topic bindings');
        }
    });

});