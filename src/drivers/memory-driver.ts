import type {
  BaseEventInterface,
  EventBusInterface,
  EventBusListenerCallback,
  EventBusOptions,
} from "../types";

export class MemoryDriver implements EventBusInterface {
  private _bus: Record<string, [EventBusListenerCallback][]> = {};

  async listen(
    eventName: string,
    callback: EventBusListenerCallback,
    options: EventBusOptions = {},
  ): Promise<void> {
    if (!this._bus[eventName]) {
      this._bus[eventName] = [];
    }

    let handler: EventBusListenerCallback = callback;
    if (options.once) {
      handler = async (ctx: BaseEventInterface) => {
        const listenerIdx = this._bus[eventName].indexOf([handler]);
        this._bus[eventName].splice(listenerIdx, 1);
        return handler(ctx);
      };
    }

    this._bus[eventName].push([handler]);
  }

  async emit(event: BaseEventInterface): Promise<void> {
    if (!this._bus[event.getName()]) {
      return;
    }

    for (const [callback] of this._bus[event.getName()]) {
      await callback(event);
    }
  }

  clear() {
    this._bus = {};
  }
}
export default MemoryDriver;
