export interface QueueConfig {
    durable?: boolean;
    clusterExclusive?: boolean;
    isConsumer?: boolean;
    isProducer?: boolean;
}