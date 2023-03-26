import { Observable } from "./observable";
import { getCollectionItems } from "./utils";

describe("observable", () => {
  it("should be able to create an observable", async () => {
    const observable = new Observable(() => Promise.resolve(1));
    expect(observable).toBeDefined();
    const data = await observable.data;
    expect(data).toBe(1);
  });

  it("should be able to combine observables", async () => {
    const observable1 = new Observable(() => Promise.resolve(1));
    const observable2 = new Observable(() => Promise.resolve(2));
    const combined = Observable.combine({ observable1, observable2 });
    const data = await combined.data;
    expect(data.observable1).toBe(1);
    expect(data.observable2).toBe(2);
  });

  it("should be able to update observable", async () => {
    const observable = new Observable(() => Promise.resolve(1));
    const data = await observable.data;
    expect(data).toBe(1);
    observable.set(() => Promise.resolve(2));
    const data2 = await observable.data;
    expect(data2).toBe(2);
  });

  it("should be able to extract collection items", async () => {
    const observable = new Observable(() =>
      Promise.resolve([
        new Observable(() => Promise.resolve(1)),
        new Observable(() => Promise.resolve(2)),
        new Observable(() => Promise.resolve(3)),
      ])
    );
    const flatten = observable.pipe(getCollectionItems);
    const data = await flatten.data;
    expect(data).toEqual([1, 2, 3]);
  });

  it("should update observable when subscribed", async () => {
    const observable = new Observable(() => Promise.resolve(1));
    const spy = jest.fn();
    observable.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    observable.set(() => Promise.resolve(2));
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should update combined observable when subscribed", async () => {
    const observable1 = new Observable(() => Promise.resolve(1));
    const observable2 = new Observable(() => Promise.resolve(2));
    const combined = Observable.combine({ observable1, observable2 });
    const spy = jest.fn();
    const data1 = await combined.data;
    expect(data1.observable1).toBe(1);
    expect(data1.observable2).toBe(2);
    combined.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    observable2.set(() => Promise.resolve(3));
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    const data2 = await combined.data;
    expect(data2.observable1).toBe(1);
    expect(data2.observable2).toBe(3);
  });
});
