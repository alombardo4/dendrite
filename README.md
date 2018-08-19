# DentriteJS
An event-sourcing framework built for NodeJS, RabbitMQ, and Typescript.

DendriteJS draws inspiration heavily from [Axon](http://www.axonframework.org/)

[![CircleCI](https://circleci.com/gh/alombardo4/dendrite.svg?style=svg)](https://circleci.com/gh/alombardo4/dendrite)

---

## Running Tests
- First, run `docker-compose up` or run RabbitMQ locally on port 5672
- Then, run `npm i` to install dev dependencies
- Finally, run `npm test` to run tests

## Current Features
- Basic event bus implementation with topic exchange and topic-bound queues based on event "names"
- Simple "publishEvent" functionality

## Future Features
- EventGateway to register event handlers and automatically add topic bindings
- Event Handlers to handle incoming events
- CommandGateway to register command handlers
- CommandHandlers to execute commands
- Aggregates to maintain state in command services
- Example command and query services
- Mongo integration for eventstore