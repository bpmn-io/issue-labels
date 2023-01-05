> Preview our labels [on this page](https://cdn.statically.io/gh/bpmn-io/labels/main/icons/preview.html).

# Issue Labels

This documents our usage of issue labels across bpmn.io and related projects.

In our projects we build upon a set of [default labels](#default-labels) and define a framework for [custom, per-repository labels](#custom-labels). 


## General guidelines

* Labels add important additional meta-data, we don't overuse them
* We are label less per default (no _low priority_ or _task_ labels)
* We use colors to group labels semantically


## Default labels

[`labels-default.yml`](./labels-default.yml) defines labels that are available out of the box, across all our repositories. 


#### Automatic synchronization

```sh
# fetch issue view via our task board
curl https://tasks.bpmn.io/wuffle/board/cards > issues.json

# execute the label sync utility:
ACCESS_TOKEN=ghp_PERSONAL_ACCESS_TOKEN_WITH_REPO_SCOPE node index.js

# for debugging purposes run it in `DRY_RUN` mode
DRY_RUN=1 ACCESS_TOKEN=ghp_PERSONAL_ACCESS_TOKEN_WITH_REPO_SCOPE node index.js
```


## Custom labels

[`labels-additional.yml`](./labels-additional.yml) showcases some custom labels. Those _may_ be added to individual repositories to reflect domain specific aspects. 

We use color for semantic grouping of important aspects, within a repository, but also across repository boundaries.

| What   | Example | Color   | Preview |
| :----- | :------ | :------ | :------ |
| Theme / feature cluster  | `ux`, `a11y`, `modeling`, `refactoring actions` | `#0E8A16` | ![a11y](https://img.shields.io/badge/a11y-0E8A16?style=flat) |
| Domain | `{ BPMN, DMN, FORM }`, `{ Camunda Platform, Camunda Cloud }` | `#4369a0` | ![Camunda Platform](https://img.shields.io/badge/Camunda%20Platform-4369a0?style=flat)|
| Environment | `browsers = { IE, Edge, Safari }`, `os = { Windows, MacOS, Darwin }` | `#e2a465` | ![browser:IE](https://img.shields.io/badge/browser:IE-e2a465?style=flat)|
