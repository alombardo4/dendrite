"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventBus {
    constructor(connectionString, queueName, queueConfig) {
        this.connectionString = connectionString;
        this.queueName = queueName;
        this.queueConfig = queueConfig;
        this.connect();
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.class.js.map