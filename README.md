# Labels

Documentation and syncronization utilities for labels used across our projects.


## Synchronize Default Labels

The following steps allow you to synchronize [default labels](./labels.yml) across bpmn.io projects.

```sh
# fetch issue view via our task board
curl https://tasks.bpmn.io/wuffle/board/cards > issues.json

# execute the label sync utility:
ACCESS_TOKEN=ghp_PERSONAL_ACCESS_TOKEN_WITH_REPO_SCOPE node index.js

# for debugging purposes run it in `DRY_RUN` mode
DRY_RUN=1 ACCESS_TOKEN=ghp_PERSONAL_ACCESS_TOKEN_WITH_REPO_SCOPE node index.js
```


