# Tests

Oh boy, do I love me tests. They allow me to act like a cowboy on these keys and sleep like a baby at night. I practice the dark art of write-and-forget-testing, so while the code is correct, the test description might be a bit or completely out of date with the current reality. And before you go spelunking through these test here are some helpful tidbits.

+ __Test Generation__
    * Both Less and YAML tests are automatically generated and built from the Stylus test respectively. Let me tell you a funny story. At one point, I was writing all the YAML tests by hand until I realized my sheer senselessness after countless hours. Needless to say, automation has been on the forefront of my mind as of late not only when it comes to ctr but all other aspects.
    * The generation of theses tests is as follows
        1. Test entry point is invoked, `run.[type].test.js`
        2. Before tests run `run.[type].clean.js` deletes all `[file].[type]` tests in preperation for generation
        3. `run.[type].build.js` is called to generate the tests using the template Stylus file of `[file].styl` to generate and write out `[file].[type]`. Although, some tests don't translate one-to-one, and in that case there is a `[file].[type].styl` file that then acts as the tempalte file. It's not pretty but it works.

+ __Folder Structure__
    * `/benchmark` -> Raw benchmark to ensure memoization - don't put much weight into them
    * `/cases-api` -> The Javascript API tests along with YAML API tests
    * `/cases-core` -> Core `ctr` tests that test the mechanics in Stylus, Less, and YAML

+ __Basic Structure__: Three parts to every test
    1. `[file].md` 
        - What the test is testing or some other words about the test. Kinda depends on the state of mind I was in and when I wrote the test.
        - Could be wrong or inaccurate, so read with caution
        - I can't spell, and at this stage of life, it's something I have given up on. I did not spell check since the tests are not public facing in the same way as the documentation is. So you're in for a dyslexia treat of butchered spelling and active and passive switching tense.
    2. `[file].css`
        - What the various test file should complile to, wheater that be Stylus, Less, YAML, or Javascript
    3. `[file].{styl, less, yml, js}`
        - The `ctr` logic that should compile to `[file].css`
