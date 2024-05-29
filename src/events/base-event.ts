import { safeDestr } from "destr";
import type { EventContext, EventInterface } from "../types";

export class BaseEvent<Ctx extends EventContext = EventContext>
  implements EventInterface
{
  constructor(
    protected name: string,
    protected context: Ctx & EventContext,
  ) {}

  public getName(): string {
    return this.name;
  }

  public getContext(): Ctx {
    return this.context;
  }

  public toJson(): string {
    return JSON.stringify({
      name: this.getName(),
      context: this.getContext(),
    });
  }

  toString() {
    return this.toJson();
  }

  public static fromJson(
    this: new () => BaseEvent,
    json: string,
  ): EventInterface {
    const { name, context } = safeDestr<{
      name: string;
      context: EventContext;
    }>(json);
    // @ts-ignore
    // eslint no-this-in-static "off"
    return new [Symbol.species](name, context);
  }
}

export default BaseEvent;
