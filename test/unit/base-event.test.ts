import { beforeEach, describe, expect, it } from "vitest";
import type { BaseEventInterface } from "../../src";
import BaseEvent from "../../src/events/base-event";

describe("events::base-event", () => {
  const eventCtx = {};
  let baseEvent: BaseEventInterface;

  beforeEach(() => {
    baseEvent = new BaseEvent("name", eventCtx);
  });

  it("should hava a string name", () => {
    expect(baseEvent.getName()).to.eq("name");
  });

  it("should have an empty context", () => {
    expect(baseEvent.getContext()).to.be.equal(eventCtx);
  });
});
