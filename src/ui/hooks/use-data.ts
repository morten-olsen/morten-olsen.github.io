import { Context } from "../../context";
import { createUseDataContext } from "../../loaders/react";

const useData = createUseDataContext<Context>();

export { useData };
