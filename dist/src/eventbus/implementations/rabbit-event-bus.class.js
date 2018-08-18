"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_bus_class_1 = require("../models/event-bus.class");
const amqp = __importStar(require("amqplib/callback_api"));
class RabbitEventBus extends event_bus_class_1.EventBus {
    connect() {
        amqp.connect(this.connectionString, (err, connection) => {
            if (err) {
                console.error(err);
                console.error('Could not connect to RabbitMQ. Fatal!');
                process.exit(1);
            }
        });
        throw new Error("Method not implemented.");
    }
    publishEvent(event) {
        throw new Error("Method not implemented.");
    }
}
exports.RabbitEventBus = RabbitEventBus;
//# sourceMappingURL=rabbit-event-bus.class.js.map