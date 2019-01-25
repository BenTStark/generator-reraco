var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
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
    const questionOne = {
      type: "confirm",
      name: "sub",
      message: "Call Sub generator?"
    };

    const loop = (questions, index = 0) => {
      const finish = function(array, index, cb) {
        return array.length - 1 === index ? done() : cb(array, index + 1);
      };
      const isUndefined = function(obj) {
        return obj === undefined ? true : false;
      };
      const handleFollowUp = function(question, answers, condition) {
        if (!isUndefined(question.nextAnswers)) {
          question.nextAnswers.map(answer => {
            if (condition === answer.condition) {
              return (answers[answer.name] = answer.value);
            }
          });
        }
      };
      var key = [questions[index].name];
      var question = questions[index];

      if (isUndefined(this.answers[key])) {
        return this.prompt([question]).then(props => {
          this.answers[key] = props[key];
          handleFollowUp(question, this.answers, props[key]);
          finish(questions, index, loop);
        });
      }
      handleFollowUp(question, this.answers, this.answers[key]);
      finish(questions, index, loop);
    };

    return loop([questionOne]);
  }

  writing() {
    if (this.answers.sub) {
      this.composeWith(
        "reraco:component",
        {
          answers: { preference: "template", template: "contact" },
          fromCompose: true
        },
        { local: require.resolve("./../component") }
      );
    }
  }
};
