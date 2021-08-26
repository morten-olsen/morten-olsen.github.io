#!/bin/bash

FORMAT=$1; shift

docker run \
  --user "$UID:$GID" \
  --net=none \
  -v $(pwd):/var/texlive \
  blang/latex:ubuntu
  lualatex "latex/$FORMAT.tex"
