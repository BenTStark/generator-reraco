var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag
  }

  prompting() {
    var done = this.async();
    this.log(
      yosay(
        "Welcome to " +
          chalk.red("reraco") +
          ". This will be a full generator to create react-redux-boilerplate. You can choose to have Auth0, Axios, PWA, etc. For now, you can only use the sugenerator ´piece´ which allows you to create containers or components."
      )
    );
    const questionOne = [
      { type: "confirm", name: "sub", message: "Call Sub generator?" }
    ];
    this.answers = {};
    const loop = (questions, index) => {
      var key = [questions[index][0].name];
      if (this.answers[key] === undefined) {
        return this.prompt(questions[index]).then(props => {
          this.answers[key] = props[key];
          done();
        });
      }
      questions.length === index ? this.prompt([]) : loop(questions, index + 1);
    };

    return loop([questionOne], 0);
  }

  writing() {
    if (this.answers.sub) {
      this.composeWith(
        "reraco:component",
        {
          answers: { one: true },
          fromCompose: true
        },
        { local: require.resolve("./../component") }
      );
    }
  }
};
