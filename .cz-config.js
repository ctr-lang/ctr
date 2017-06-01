
module.exports = {
  types: [
    {value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
    {value: 'docs',     name: 'docs:     Documentation only changes'},
    {value: 'feat',     name: 'feat:     A new feature'},
    {value: 'fix',      name: 'fix:      A bug fix'},
    {value: 'init',     name: 'init:     Initial commit'},
    {value: 'perf',     name: 'perf:     A code change that improves performance'},
    {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
    {value: 'release',  name: 'release:  A code release and tag'},
    {value: 'revert',   name: 'revert:   Revert to a commit'},
    {value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
    {value: 'syntax',   name: 'syntax:   Spelling, grammar, punctuation, or mechanics'},
    {value: 'update',   name: 'update:   Updates feature'},
    {value: 'test',     name: 'test:     Adding missing tests'},
    {value: 'WIP',      name: 'WIP:      Work in progress'}
  ],
  // scopes: {Array of Strings}: Specify the scopes for your particular project.
  // Eg.: for some banking system: ["acccounts", "payments"].
  // For another travelling application: ["bookings", "search", "profile"]
  scopes: [
    {name: 'less'},
    {name: 'stylus'},
    {name: 'javascript'},
    {name: 'yaml'},
    {name: 'lib'},
    {name: 'lib/ctr-nodes'},
    {name: 'lib/ctr-js-nodes'},
    {name: '__tests__/'},
    {name: '__tests__/cases-api'},
    {name: '__tests__/cases-core'},
    {name: '__tests__'},
    {name: 'root'}
  ],
  // scopeOverrides: {Object where key contains a Array of String}:
  // Use this when you want to override scopes for a specific commit type.
  // Example bellow specify scopes when type is fix:
  scopeOverrides: {},
  // allowCustomScopes: {boolean, default false}: adds the option custom to
  // scope selection so you can still typea scope if you need.
  allowCustomScopes: true,
  // allowBreakingChanges: {Array of Strings: default none}. List of commit
  // types you would like to the question breaking change prompted. Eg.: ['feat', 'fix']
  allowBreakingChanges: ['feat', 'fix']
};
