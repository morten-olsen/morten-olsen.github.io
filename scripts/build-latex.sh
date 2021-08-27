#!/bin/bash

FORMAT=$1; shift

docker run \
  --workdir "/var/texlive/latex" \
  --user "$UID:$GID" \
  --net=none \
  -v $(pwd):/var/texlive \
  blang/latex:ubuntu \
  lualatex "$FORMAT.tex"
