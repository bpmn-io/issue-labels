# Labels

Documentation and syncronization utilities for labels used across our projects.


## Synchronize Default Labels

The following steps allow you to synchronize [default labels](./labels-default.yml) across bpmn.io projects.

```sh
# fetch issue view via our task board
curl https://tasks.bpmn.io/wuffle/board/cards > issues.json

# execute the label sync utility:
ACCESS_TOKEN=ghp_PERSONAL_ACCESS_TOKEN_WITH_REPO_SCOPE node index.js

# for debugging purposes run it in `DRY_RUN` mode
DRY_RUN=1 ACCESS_TOKEN=ghp_PERSONAL_ACCESS_TOKEN_WITH_REPO_SCOPE node index.js
```


## Custom Labels

Beyond our [default labels](./labels-default.yml) we may add [custom labels](./labels-additional.yml) to repositories to reflect certain (domain specific) aspects. We use color codes to ensure those aspects are recognizable across repository boundaries.

| What   | Example | Color   | Preview |
| :----- | :------ | :------ | :------ |
| Theme / feature cluster  | `ux`, `a11y`, `modeling`, `refactoring actions` | `#0E8A16` | ![a11y](https://img.shields.io/badge/a11y-0E8A16?style=flat) |
| Domain | `{ BPMN, DMN, FORM }`, `{ Camunda Platform, Camunda Cloud }` | `#006b75` | ![Camunda Platform](https://img.shields.io/badge/Camunda%20Platform-006b75?style=flat)|
| Environment | `browsers = { IE, Edge, Safari }`, `os = { Windows, MacOS, Darwin }` | `#eb6420` | ![browser:IE](https://img.shields.io/badge/browser:IE-eb6420?style=flat)|