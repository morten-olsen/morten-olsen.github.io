type Observer = () => void;

type ObservableRecord<T extends Record<string, Observable<any>>> = {
  [K in keyof T]: T[K] extends Observable<infer U> ? U : never;
};

class Observable<T> {
  #observers: Observer[] = [];
  #data?: Promise<T>;
  #loader: (current?: T) => Promise<T>;

  constructor(loader: () => Promise<T>) {
    this.#loader = loader;
  }

  public get ready() {
    return this.#data;
  }

  public get data() {
    if (!this.#data) {
      this.#data = this.#loader(this.#data);
    }
    return this.#data;
  }

  public recreate = () => {
    this.#data = undefined;
    this.notify();
  };

  public set(loader: (current?: T) => Promise<T>) {
    this.#data = undefined;
    this.#loader = loader;
    this.notify();
  }

  public notify = () => {
    this.#observers.forEach((observer) => observer());
  };

  subscribe = (observer: Observer) => {
    this.#observers.push(observer);
    return () => this.unsubscribe(observer);
  };

  unsubscribe = (observer: Observer) => {
    this.#observers = this.#observers.filter((o) => o !== observer);
  };

  pipe = <U>(fn: (data: T) => Promise<U>) => {
    const loader = async () => fn(await this.data);
    const observable = new Observable<U>(loader);
    this.subscribe(() => {
      observable.set(loader);
    });
    return observable;
  };

  static combine = <U extends Record<string, Observable<any>>>(
    record: U
  ): Observable<ObservableRecord<U>> => {
    const loader = () =>
      Object.entries(record).reduce(
        async (accP, [key, value]) => ({
          ...(await accP),
          [key]: await value.data,
        }),
        {} as any
      );
    const observable = new Observable<ObservableRecord<U>>(loader);
    Object.values(record).forEach((item) => {
      item.subscribe(async () => {
        observable.set(loader);
      });
    });
    return observable;
  };
}

export { Observable };
