__Description__: If a `.ctrrc.yml` file is in the root of the project, ctr options can be set there and should be picked up and read

__Notes__

+ IMPORANT: as you will notice, the options are not wraped in `option` or `$ctr-option` -> by default ctr just assumes everything defined in the rc is options UNLESS `$$` is defined
+ https://github.com/nodeca/js-yaml