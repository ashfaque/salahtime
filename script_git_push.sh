#!/bin/bash

COMMIT_MSG="${1:-'committed and pushed by the git push script'}" \
&& git add --all \
&& git commit -m "$COMMIT_MSG" \
&& git pull \
&& git push
