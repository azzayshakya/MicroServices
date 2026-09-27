import { createKafkaInstance } from "./client.js";
import { ManagedProducer } from "./producer.js";
import { ManagedConsumer } from "./consumer.js";

/**
 * High-level factory to instantiate a Kafka cluster context.
 */
export function createKafkaClient(config, logger = console) {
  const kafka = createKafkaInstance({ ...config, logger });

  return {
    raw: kafka,
    createProducer: () => new ManagedProducer(kafka, logger),
    createConsumer: (groupId) => new ManagedConsumer(kafka, groupId, logger),
  };
}

export { ManagedProducer, ManagedConsumer, createKafkaInstance };
