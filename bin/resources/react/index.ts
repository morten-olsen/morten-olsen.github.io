import vm from "vm";
import React, { ComponentType } from "react";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import sucrase from "@rollup/plugin-sucrase";
import alias from "@rollup/plugin-alias";
import externalGlobals from "rollup-plugin-external-globals";
import { createScript } from "../script";
import orgStyled from "styled-components";
import * as styledExports from "styled-components";
import ReactHelmetAsync from "react-helmet-async";
import { resolve } from "path";

const styled = orgStyled.bind(null);
for (let key of Object.keys(orgStyled)) {
  if (key === "default") {
    continue;
  }
  (styled as any)[key] = (orgStyled as any)[key];
}
for (let key of Object.keys(styledExports)) {
  if (key === "default") {
    continue;
  }
  (styled as any)[key] = (styledExports as any)[key];
}

const createReact = <TProps = any>(path: string) => {
  const script = createScript({
    path,
    format: "cjs",
    plugins: [
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      alias({
        entries: [
          { find: "@", replacement: resolve("content/templates/react") },
        ],
      }),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["jsx", "typescript"],
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
        extensions: [".js", ".ts", ".tsx"],
      }),
      json(),
      commonjs({
        include: /node_modules/,
      }),
      externalGlobals({
        react: "React",
        "styled-components": "StyledComponents",
        "react-helmet-async": "ReactHelmetAsync",
      }),
    ],
  });
  const template = script.pipe<ComponentType<TProps>>(async () => {
    const scriptContent = await script.data;
    const exports: any = {};
    const module = { exports };
    const globals = {
      module,
      exports,
      React,
      StyledComponents: styled,
      ReactHelmetAsync,
    };
    vm.runInNewContext(scriptContent, globals);
    return module.exports;
  });

  return template;
};

export { createReact };
