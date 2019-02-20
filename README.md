[![pipeline status](https://gitlab.com/eamonnmurray/ironsworn-web/badges/master/pipeline.svg)](https://gitlab.com/eamonnmurray/ironsworn-web/commits/master)
---

Ironsworn Web Assistant
=======================

Plain HTML site with javascript dice roller and oracle for the Ironsworn RPG.

---

## GitLab CI

This project's static Pages are built by [GitLab CI][ci], following the steps
defined in [`.gitlab-ci.yml`](.gitlab-ci.yml):

```
image: alpine:latest

pages:
  stage: deploy
  script:
  - echo 'Nothing to do...'
  artifacts:
    paths:
    - public
  only:
  - master
```

For this to work, all HTML files should be placed in the `public/` directory.


[ci]: https://about.gitlab.com/gitlab-ci/
