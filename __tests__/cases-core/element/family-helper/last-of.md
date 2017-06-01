__Description__: This I/O mixin will only select the last of **x** items. It will not work if there is not as much as item as you set in **$limit**

__Notes__

+ Parameters
    * `last-of(limit)`
    * `fm-last-of(limit)`
    * `lastOf(limit)`
+ `fm` prefix to avoid collisions
+ `<elm>nth-of-type(${limit}):nth-last-of-type(1)`