package mortenolsen 

import (
  "dagger.io/dagger"
  "dagger.io/dagger/core"
  "universe.dagger.io/docker"
)

dagger.#Plan & {
  _nodeModulesMount: "/node_modules": {
    dest:     "/node_modules"
    type:     "cache"
    contents: core.#CacheDir & {
      id: "morten-olsen.github-io-modules-cache"
    }

  }
  client: {
    filesystem: {
      "./": read: {
        contents: dagger.#FS
        exclude: [
          "node_modules",
          "out",
          ".next"
        ]
      }
      "./docker": read: contents: dagger.#FS
      "./docker/Dockerfile": read: contents: dagger.#FS
      "./_output": write: contents: actions.build.contents.output
    }
  }
  actions: {
    deps: docker.#Build & {
      steps: [
        docker.#Dockerfile & {
          source: client.filesystem."./docker".read.contents
          dockerfile: {
            contents: "foo"
          } 
        }
      ]
    }
  }
}
