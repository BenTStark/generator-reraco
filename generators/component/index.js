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

    const questionPreference = {
      type: "list",
      name: "preference",
      message: "Do want a template or design your own component?",
      choices: ["custom", "template"],
      nextAnswers: [
        { condition: "custom", name: "template", value: "n/a" },
        { condition: "template", name: "type", value: "n/a" },
        { condition: "template", name: "auth", value: "n/a" },
        { condition: "template", name: "proptypes", value: "n/a" }
      ]
    };

    const questionTemplate = {
      type: "list",
      name: "template",
      message: "Choose your template?",
      choices: ["contact", "to-do list"],
      nextAnswers: [
        { condition: "contact", name: "type", value: "presentational" },
        { condition: "contact", name: "name", value: "contact" },
        { condition: "to-do list", name: "type", value: "functional" },
        { condition: "to-do list", name: "name", value: "todo" }
      ]
    };

    const questionName = {
      type: "input",
      name: "name",
      message: "What's the component's name (camelCase)?"
    };

    const questionType = {
      type: "list",
      name: "type",
      message: "Do want a functional or presentational component?",
      choices: ["functional", "presentational"],
      nextAnswers: [{ condition: "functional", name: "auth", value: "n/a" }]
    };

    const questionAuth = {
      type: "confirm",
      name: "auth",
      message: "Do want to add authentication (auth0js)?"
    };

    const questionProptypes = {
      type: "confirm",
      name: "proptypes",
      message: "Do you want to implement propTypes?"
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

    return loop([
      questionPreference,
      questionTemplate,
      questionType,
      questionAuth,
      questionProptypes
    ]);
  }

  writing() {
    this.log(this.answers);
  }
};
