[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nepwork/admin-ui)

# UiCore

This app and website is being developed by the covidsim.team for research, modeling and simulations for mitigation of COVID-19 spread in LDCs and EM/DEs.

This repo contains 4 major modules

- first is the scaffolding for our own **website**. this is currently on hold because Google Sites is currently enough for our fairly static content. We are using Angular 9.1 (thus Typescript 3.8, RxJS 6.5) with SCSS for the web frontend and Ionic 5 for Android and iOS apps. Shared components will be made into libraries using Nx. This will be placed under ***covidsim.team*** when we move away from Google Sites, possibly due to need for dynamic and interactive components/content.

- second is the **dashboard** folder which I started today. this is going to see the most contribution activity and is the most urgently needed deliverable. The main focus of this will be the interactive map of Nepal with hotspots and other embedded stats. It also has the foundation needed for different kinds of charts and graphs. It uses Angular 9+ & Typescript
Bootstrap 4+ & SCSS. This will be placed under ***dashboard.covidsim.team***

- third is the serverless **functions** folder within the dashboard folder. This is our light backend for the dashboard. unify-core has a more involved python backend, which will be supplemented with a Java/Scala middleware soon. I will explain why we have 3 of these backend projects in authorea. These cloud functions are responsible for enriching our dashboards with its contents. The python setup will be for Apache Spark jobs. The Java/Scala setup will sit closer to neo4j and the ELK stack for search, logging and monitoring tools. The end points from these will be accessible for authenticated and/or authorized clients and users from ***api.covidsim.team***

- fourth is the **ion** folder which contains our ionic/angular based apps and has subfolders for android, ios and a PWA. It uses Ionic 5. This will be accessible from play store, app store and ***app.covidsim.team***

The app, the website and the dashboard might have shared components and libraries. These will be put in a common 5th folder **lib**.

Please check the README folder for further information regarding the app, requirements, build process and contribution guidelines. Each of the above 4 may have their own additional README files too.

__________________________________________________

# Development flow for the website

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests.



## Repo Stats
```
--------------------------------------------------------------------------------
Language                      files          blank        comment           code
--------------------------------------------------------------------------------
JSON                             65             51              0          59383
TypeScript                      388           2323            820          16785
JavaScript                       89           2291           4237          12417
Objective C                      46           2018           1557           7791
Java                             54           1363           3040           7322
HTML                            105            437            119           4923
Markdown                         35           1404              0           3907
Sass                            111            748             12           3577
XML                              20            129            252            827
C/C++ Header                     53            419            932            774
Gradle                            7            100            145            592
DOS Batch                        20             18              0            450
C#                                3             67             63            305
SVG                               6              1              0            198
YAML                              6             37             10            182
CSS                               6             14             41             84
Bourne Shell                      2             10             43             33
Bourne Again Shell                1              4             20              6
--------------------------------------------------------------------------------
SUM:                           1017          11434          11291         119556
--------------------------------------------------------------------------------
```
