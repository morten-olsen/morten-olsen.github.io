import { createContext, useContext } from "react";

const DataContext = createContext<any>(null);

const createUseDataContext = <T>() => {
  const context = DataContext as React.Context<T>;

  const useDataContext = <TOutput = any>(selector: (input: T) => TOutput) => {
    const data = useContext(context);

    return selector(data);
  }

  return useDataContext;
}

export { DataContext, createUseDataContext };
