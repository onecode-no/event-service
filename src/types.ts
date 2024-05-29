export type EventContext<BaseContext = Record<string, unknown>> = BaseContext;

export interface EventInterface {
  getName(): string;

  getContext(): EventContext;

  toString(): string;
}

export type EventListenerCallback = <Ctx extends EventInterface>(
  event: Ctx,
) => Promise<unknown>;

export interface EventListenerOptions {
  once?: boolean | false;
}

export interface EventDriver {
  listen(
    eventName: string,
    callback: EventListenerCallback,
    options: EventListenerOptions,
  ): Promise<void>;

  emit(event: EventInterface): Promise<void>;
}
