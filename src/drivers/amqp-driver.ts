import { connect } from "amqplib";
import type { Channel, Connection, ConsumeMessage } from "amqplib";
import { safeDestr } from "destr";
import ListenEvent from "../events/listen-event";
import type {
  BaseEventInterface,
  EventBusInterface,
  EventBusListenerCallback,
  EventBusOptions,
  EventContext,
} from "../types";
import MemoryDriver from "./memory-driver";

export default class AmqpDriver implements EventBusInterface {
  private _connection: Connection | undefined;
  private _channel: Channel | undefined;
  private _internal: MemoryDriver;

  constructor(
    protected url: string,
    protected exchange: string,
    protected queue: string,
  ) {
    this._internal = new MemoryDriver();
  }

  private async createConnection(): Promise<Connection> {
    return connect(this.url);
  }

  private async getConnection(): Promise<Connection> {
    if (!this._connection) {
      this._connection = await this.createConnection();
    }

    this._connection.on("close", () => {
      console.error("Connection closed.");
    });

    //try to get something from amqp server maybe?
    //if it fails, reconnect?

    return this._connection;
  }

  private async createChannel(): Promise<Channel> {
    return (await this.getConnection()).createChannel();
  }

  private async getChannel(): Promise<Channel> {
    if (!this._channel) {
      this._channel = await this.createChannel();
    }

    this._channel.on("close", () => {
      console.error("Channel closed.");
    });

    //try to get something from amqp server maybe?
    //if it fails, reconnect?
    return this._channel;
  }

  public async initialize() {
    this._internal.clear();
    const channel = await this.getChannel();

    channel.consume(this.queue, (msg) => {
      if (!msg) return;
      const { name, context } = safeDestr<{
        name?: string;
        context?: EventContext;
      }>(msg.content.toString("utf8") as string);
      this._internal.emit(new ListenEvent(name || "undefined", context || {}));
    });
  }

  async listen(
    eventName: string,
    callback: EventBusListenerCallback,
    options: EventBusOptions,
  ): Promise<void> {
    return await this._internal.listen(eventName, callback, options);
  }

  async emit(event: BaseEventInterface): Promise<void> {
    const channel = await this.getChannel();

    channel.publish(this.exchange, "", Buffer.from(event.toString()));
  }
}
