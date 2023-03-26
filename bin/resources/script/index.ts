import { Observable } from "../../observable";
import { InputPluginOption, ModuleFormat, watch } from "rollup";

type ScriptOptions = {
  path: string;
  format: ModuleFormat;
  plugins?: InputPluginOption;
};

const build = (options: ScriptOptions, update: (code: string) => void) =>
  new Promise<string>((resolve, reject) => {
    let compiled = false;
    const watcher = watch({
      input: options.path,
      plugins: options.plugins,
      onwarn: () => { },
      output: {
        format: options.format,
      },
      watch: {
        skipWrite: true,
      },
    });

    watcher.on("event", async (event) => {
      if (event.code === "BUNDLE_END") {
        const { output } = await event.result.generate({
          format: options.format,
        });
        const { code } = output[0];
        if (!compiled) {
          resolve(code);
          compiled = true;
        } else {
          update(code);
        }
      }
      if (event.code === "ERROR") {
        reject(event.error);
      }
    });
  });

const createScript = (options: ScriptOptions) => {
  const script: Observable<string> = new Observable(() =>
    build(options, (code) => script.set(() => Promise.resolve(code)))
  );

  return script;
};

export { createScript };
