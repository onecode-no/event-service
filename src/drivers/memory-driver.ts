import type {
  EventDriver,
  EventInterface,
  EventListenerCallback,
  EventListenerOptions,
} from "../types";

export class MemoryDriver implements EventDriver {
  private _bus: Record<string, [EventListenerCallback][]> = {};

  async listen(
    eventName: string,
    callback: EventListenerCallback,
    options: EventListenerOptions = {},
  ): Promise<void> {
    if (!this._bus[eventName]) {
      this._bus[eventName] = [];
    }

    let handler: EventListenerCallback = callback;
    if (options.once) {
      handler = async (ctx: EventInterface) => {
        const listenerIdx = this._bus[eventName].indexOf([handler]);
        this._bus[eventName].splice(listenerIdx, 1);
        return handler(ctx);
      };
    }

    this._bus[eventName].push([handler]);
  }

  async emit(event: EventInterface): Promise<void> {
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
