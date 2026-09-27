export class ManagedProducer {
  constructor(kafkaInstance, logger = console) {
    this.producer = kafkaInstance.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    });
    this.logger = logger;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;
    try {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.info("Kafka Producer connected successfully.");
    } catch (err) {
      this.logger.error(
        `Kafka Producer connection failed: ${err.message || err}`,
      );
      throw err;
    }
  }

  /**
   * Publishes an event to a Kafka topic.
   *
   * @param {Object} params
   * @param {string} params.topic
   * @param {string} [params.key] - Optional partition key
   * @param {any} params.value - Object or string to serialize
   * @param {Object} [params.headers]
   */
  async sendEvent({ topic, key, value, headers = {} }) {
    if (!this.isConnected) {
      throw new Error("Kafka Producer is not connected. Call connect() first.");
    }

    const payload = typeof value === "string" ? value : JSON.stringify(value);

    return this.producer.send({
      topic,
      messages: [
        {
          key: key ? String(key) : null,
          value: payload,
          headers,
        },
      ],
    });
  }

  async disconnect() {
    if (!this.isConnected) return;
    await this.producer.disconnect();
    this.isConnected = false;
    this.logger.info("Kafka Producer disconnected.");
  }
}
