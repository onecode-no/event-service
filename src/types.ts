export type EventContext<BaseContext = Record<string, unknown>> = BaseContext;

export interface BaseEventInterface {
  getName(): string;

  getContext(): EventContext;

  toString(): string;
}

export type EventBusListenerCallback = <Ctx extends BaseEventInterface>(
  event: Ctx,
) => Promise<unknown>;

export interface EventBusOptions {
  once?: boolean | false;
}

export interface EventBusInterface {
  listen(
    eventName: string,
    callback: EventBusListenerCallback,
    options: EventBusOptions,
  ): Promise<void>;

  emit(event: BaseEventInterface): Promise<void>;
}
