var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    var that = this;
    //this.option('babel');
    that.options.answers === undefined
      ? (this.answers = {})
      : (this.answers = that.options.answers);
  }

  prompting() {
    var done = this.async();
    var introduction =
      "Design your React component or choose a fully working template.";

    this.options.fromCompose
      ? this.log(introduction)
      : this.log(yosay(chalk.red("Component Generator: ") + introduction));

    const questionType = {
      type: "list",
      name: "type",
      message: "Do want a template or design your own component?",
      choices: ["Custom", "Template"]
    };

    const questionTemplate = {
      type: "list",
      name: "template",
      message: "Choose your template?",
      choices: ["blog", "contact"]
    };

    const questionTwo = {
      type: "confirm",
      name: "two",
      message: "questionTwo"
    };

    return this.prompt(questionOne);
    const loop = (questions, index = 0) => {
      const finish = function(array, index, cb) {
        return array.length - 1 === index ? done() : cb(array, index + 1);
      };

      var key = [questions[index].name];
      if (this.answers[key] === undefined) {
        return this.prompt([questions[index]]).then(props => {
          this.answers[key] = props[key];
          finish(questions, index, loop);
        });
      }
      finish(questions, index, loop);
    };

    return loop([questionType, questionTemplate]);
  }

  writing() {
    this.log(this.answers);
  }
};
