# Contributing

A healthy community is a contributing community, and contributions are welcomed and appreciated with open hearts and open fingers. First things first, make sure you [search the issue tracker](https://github.com/ctr-lang/ctr/issues) to ensure your issue/fix/update has not previously been discussed and/or fixed in the `master`. Additionally, if you're planning to implement a new feature, change the API, or any change that will take over a handful of minutes, please create an issue first and wait for a response from one of the maintainers. Otherwise, there are no guarantees your hard work will be merged, and then we will feel shitty that you feel shitty since all your efforts will have been for naught.


## Issue Tracker

The [issue tracker](https://github.com/ctr-lang/ctr/issues) is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests), and [submitting pull requests](#pull-requests). Please respect the following guidelines:

+ Please **do not** use the issue tracker for personal support requests (use [Stack Overflow](https://stackoverflow.com/questions/tagged/ctr)).
+ Please **do not** post comments consisting solely of "+1" or ":+1:".
+ Keep the discussion on topic, respect the opinions of others, and most importantly don't be a prick; or in other words, don't be a fucking asshole.


## Bug Reports

A "bug" is defined as a demonstrable problem that is caused by the code in the repository. If you find a bug, please report it so we can fix it. Remember, you're the first defense against the war on bugs.

__Guidelines for bug reports__:

1. Use the GitHub [issue](https://github.com/ctr-lang/ctr/issues) search, and check if the issue has already been reported.
2. Try to reproduce the bug using the latest `master` (or `development` if present) branch in the repository.
3. Isolate the problem, and ideally, create a test case and/or upload the code to a repository or post the code inline if the size is reasonable.

A good bug report shouldn't leave others needing to chase you down for more information. Please try to be as detailed as possible in your report. It's important you include the following:

+ What's your environment?
+ Expected behavior
+ Actual behavior
+ What steps and/or code will reproduce the bug?
+ Have you identified what's causing the bug, and potential solutions or opinions?
+ Any other useful details that will help fix the potential bugs.


## Feature Requests

Feature requests are welcomed. But take a moment to find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case and demonstrate the merits of this feature. Furthermore, provide as much detail and context as possible.


## Pull Requests

1. [Fork](https://help.github.com/fork-a-repo/) the repository.

   ```bash
   git clone https://github.com/<your-username>/ctr.git
   cd ctr
   git remote add upstream https://github.com/ctr-lang/ctr.git
   ```

2. Link `ctr`, to symlink the package folder during development.

   ```bash
   yarn run link
   ```

3. Install the dependencies. Make sure you have [yarn](https://yarnpkg.com) [installed](https://yarnpkg.com/en/docs/install).

   ```bash
   yarn install
   ```

4. Create a new branch to contain your feature, change, or fix.

   ```bash
   git checkout -b <topic-branch-name>
   ```

5. Commit your changes in logical chunks.
    + To keep commits uniform, this project uses [commitizen](http://commitizen.github.io/cz-cli/), but don't worry if you've never heard about commitizen or don't know how to use it. Everything is pre-configured and ready for you to rock 'n' roll out of the box. Just follow these simple steps:
        1. Make your update/change/fix
        2. Add your changes `git add .`
        3. Run: `npm run commit` - An interactive command prompt will appear and lead you step-by-step through the whole process. It's easy peasy lemon squeezy so don't worry about a thing.
    + If commitizen does not work or for some extraneous reason you wish not to use it your commit must follow the [angular commit](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) format: `<type>(<scope>): <subject>`. Otherwise, your pull request will fail during approval, but it’s highly encouraged you use `npm run commit` to make everyone's life just a bit easier.

6. Test changes and/or write test(s) to validate feature, change, or fix.

   ```bash
   npm run test
   ```

7. Locally merge (or rebase) the upstream development branch into your topic branch.

   ```bash
   git pull [--rebase] upstream master
   ```

8. Push your topic branch up to your fork.

   ```bash
   git push origin <topic-branch-name>
   ```

9. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description against the `master` branch. Suggestions, changes, or improvements may be required for your changes to be merged, but small pull requests should be accepted quickly. Ideally, your pull request meets the four pillars of quality:
    1. Update/change/fix has test(s)
    2. Follows the existing code style
    3. Has decent commit message(s)
    4. Commit, and code comes with a smile


# License

**IMPORTANT:** By contributing your code, you agree to license your contribution under the [Apache-2.0](https://github.com/ctr-lang/ctr/blob/master/LICENSE.txt) License.
