__Description__: Set vars should overwrite local vars

__Notes__

+ This behavoir differers from local vars in the `create` method which are __not__ overwriten.
+ The thinking behind this is if the user want they could create global vars that would then be inherited by the classes if they are present otherwise they will default to the set var
+ If this behavoir is unwelcomed, then you can use private local vars that can only be overwriten explicitly and not globaly