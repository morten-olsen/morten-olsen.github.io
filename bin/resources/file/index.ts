import { readFile } from "fs/promises";
import { Observable } from "../../observable";
import { watch } from "fs";

type FileOptions = {
  path: string;
};

const createFile = ({ path }: FileOptions) => {
  const file = new Observable(async () => readFile(path, "utf-8"));

  watch(path, () => {
    file.recreate();
  });

  return file;
};

export { createFile };
