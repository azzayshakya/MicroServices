export class ManagedConsumer {
  constructor(kafkaInstance, groupId, logger = console) {
    this.consumer = kafkaInstance.consumer({ groupId });
    this.logger = logger;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;
    await this.consumer.connect();
    this.isConnected = true;
    this.logger.info("Kafka Consumer connected successfully.");
  }

  /**
   * Subscribes to topics and runs a message handler.
   *
   * @param {string[]} topics
   * @param {Function} eachMessage - async ({ topic, partition, message }) => {}
   * @param {boolean} [fromBeginning=false]
   */
  async subscribeAndRun({ topics, eachMessage, fromBeginning = false }) {
    await this.connect();

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning });
    }

    await this.consumer.run({
      eachMessage: async (payload) => {
        try {
          const rawValue = payload.message.value?.toString();
          let parsed = rawValue;
          try {
            parsed = JSON.parse(rawValue);
          } catch {
            // retain raw string if not JSON
          }

          await eachMessage({
            ...payload,
            parsed,
          });
        } catch (err) {
          this.logger.error(
            `Error processing Kafka message on ${payload.topic}: ${err.message}`,
          );
        }
      },
    });
  }

  async disconnect() {
    if (!this.isConnected) return;
    await this.consumer.disconnect();
    this.isConnected = false;
    this.logger.info("Kafka Consumer disconnected.");
  }
}
