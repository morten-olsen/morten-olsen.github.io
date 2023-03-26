import { Observable } from "../../observable";

const forEach = async <T extends Observable<any[]>>(
  observable: T,
  fn: (
    value: T extends Observable<infer U>
      ? U extends Array<infer A>
      ? A
      : never
      : never
  ) => Promise<void>
) => {
  const knownValues = new Set();
  const update = async () => {
    for (let value of await observable.data) {
      if (knownValues.has(value)) {
        continue;
      }
      await fn(value);
      knownValues.add(value);
    }
  };
  await update();
  observable.subscribe(update);
};

export { forEach };
