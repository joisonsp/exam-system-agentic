module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/support/**/*.ts', 'features/step_definitions/**/*.ts'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/**/*.feature'],
    publishQuiet: true,
    dryRun: false,
    failFast: false,
    parallel: 1
  },

  ci: {
    requireModule: ['ts-node/register'],
    require: ['features/support/**/*.ts', 'features/step_definitions/**/*.ts'],
    format: [
      'json:cucumber-report.json'
    ],
    paths: ['features/**/*.feature'],
    publishQuiet: true,
    parallel: 2
  }
};
