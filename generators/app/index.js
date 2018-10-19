var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  info() {
    this.log(yosay(
      'Welcome to ' + chalk.red('reraco') + '. This will be a full generator to create react-redux-boilerplate. You can choose to have Auth0, Axios, PWA, etc. For now, you can only use the sugenerator ´piece´ which allows you to create containers or components.'
    ));
  }
  paths() {
    this.log(this.destinationRoot());
    // returns '~/projects'

    this.log(this.destinationPath('index.js'));
    // returns '~/projects/index.js'
  }

};
