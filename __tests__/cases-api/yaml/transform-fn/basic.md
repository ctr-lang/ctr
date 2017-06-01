__Description__: Should be able to pass along a yaml transform function

__Notes__

+ This differs from a `create` transformFn in that is transforms the yaml data befor the render.
+ Same thing as `setYamlTransform(<fn>, {once: true})`
+ `yaml(filePath, selector, option, transformFn)`
+ `yaml(filePath, option, transformFn)`
+ `yaml(filePath, transformFn)`