import { beforeEach, describe, expect, it } from "vitest";
import MemoryDriver from "../../../src/drivers/memory-driver";
import BaseEvent from "../../../src/events/base-event";

describe("driver::memory-driver", () => {
  const eventName = "test";
  const eventCtx = { label: "value" };
  let driver: MemoryDriver;
  let emitEvent: BaseEvent;
  beforeEach(() => {
    driver = new MemoryDriver();
    emitEvent = new BaseEvent(eventName, eventCtx);
  });

  it("should set up and listen to emitted events", () => {
    let wasCalled = false;
    driver.listen(eventName, async () => {
      wasCalled = true;
    });

    driver.emit(emitEvent);

    expect(wasCalled).to.eq(true);
  });

  it("should return the correct context", () => {
    let lastCalled: unknown;
    driver.listen(eventName, async (event) => {
      lastCalled = event;
    });

    driver.emit(emitEvent);

    expect(lastCalled).to.eq(emitEvent);
  });
});
