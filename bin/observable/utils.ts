import { Observable } from "./observable";

const getCollectionItems = async <T>(items: Observable<T>[]) => {
  return Promise.all(items.map((item) => item.data));
};

export { getCollectionItems };
