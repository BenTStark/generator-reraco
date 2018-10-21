var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var changeCase = require('change-case');
var _ = require('lodash');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  async prompting() {
    this.log(yosay(
      'Welcome to ' + chalk.red('reraco') + '. Create your react-redux piece. Be sure you`re in the desired directory!'
    ));

    this.answers = await this.prompt([{
      type: 'list',
      name: 'componentType',
      message: 'Do you want a complete container component with ducks [full], only container component [container] or presentational component[component]?',
      choices: [
        'full',
        'container',
        'component'
      ]
    }, {
      type: 'input',
      name: 'feature',
      message: 'What`s the name of the feature (camelCase - e.g. home, about, etc.)? Can be the same as container/component.',
      default: 'feature'
   }, {
      type: 'confirm',
      name: 'featureEqual',
      message: 'Is the feature name equal to the container/component?'
   }, {
      when: function(response) {
        return !response.featureEqual
      },
      type: 'input',
      name: 'featurePart',
      message: 'What´s the name of your container/component (camelCase)?',
      default: 'newFeature'
   }, {
      when: function(response) {
        return response.featureEqual && -.includes(['home','about','contact'],response.feature)
      },
      type: 'confirm',
      name: 'template',
      message: 'Do you want to use the ' + chalk.green(response.feature) + ' template?',
      default: false
   }]);

  };

  writing() {
    var props = this.answers;
    if (this.answers.featureEqual)  {
      props.featurePart = props.feature;
      if (this.answers.template) {
        props.featureTemplate = props.feature;
      } else {
        props.featureTemplate = '(n/a)'
      }
        }

    props.capFeaturePart = changeCase.pascalCase(props.featurePart);

    var copy = this.fs.copy.bind(this.fs);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);


    if (_.isEqual(props.componentType,'full')) {
      // ducks are only required when full feature is installed.
      copy(tPath('duck/actions.js'),dPath('duck/actions.js'));
      copy(tPath('duck/operations.js'),dPath('duck/operations.js'));
      copy(tPath('duck/reducers.js'),dPath('duck/reducers.js'));
      copy(tPath('duck/tests.js'),dPath('duck/tests.js'));
      copy(tPath('duck/types.js'),dPath('duck/types.js'));
      copyTpl(tPath('duck/index.js'),dPath('duck/index.js'),props);
    }

    if (_.isEqual(props.componentType,'container') || _.isEqual(props.componentType,'full')  ) {
      // for container of full feater; container is installed
      copyTpl(tPath('featurePart.container.js'),dPath(props.featurePart + '.container.jsx'),props);
    }
    // default files
    copyTpl(tPath('featurePart.component.jsx'),dPath(props.featurePart + '.component.jsx'),props);
    copyTpl(tPath('featurePart.test.js'),dPath(props.featurePart + '.test.js'),props);
  }

};
