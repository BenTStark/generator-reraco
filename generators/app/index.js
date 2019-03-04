var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var _ = require("lodash");
const util = require("util");

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
    const questionApplicationType = {
      type: "list",
      name: "applicationType",
      message:
        "Do you want to create a Single Page Application (SPA) or Multi Page Application (MPA)?",
      choices: ["SPA", "MPA"]
    };

    const questionLoopSPA = {
      type: "array",
      name: "SPAContent",
      subQuestions: [
        {
          type: "input",
          name: "feature",
          message: "What's the name of the current feature?"
        },
        {
          type: "confirm",
          name: "repeat",
          message: "Do you want to add another feature?"
        }
      ]
    };

    const questionLast = {
      type: "confirm",
      name: "last",
      message: "Finished?"
    };

    // SPA:
    // 1. Das heißt erstmal, dass ich nur mit Komponenten arbeite. Axios einbindung mache ich dann erstmal
    // testweise bei meiner Seite. Login ist noch in weiter ferne!
    // 2. erstmal festlegen welche Blöcke rein sollen. D.h. da brauch ich erstmal
    // z.b. erst will ich eine template header,
    // dann ne freie Seite mit Namen "Foo Bar"
    // zum schluss ein Contact Template

    const loop = (questions, index = 0) => {
      const isUndefined = function(obj) {
        return obj === undefined ? true : false;
      };
      // --------------------
      // If Questionsgroup should be repeated n times
      const loopQuestion = function(subQuestions, key, counter, that) {
        const finishInLoop = function(array, index, key, counter, cb, that) {
          return array.length - 1 === index
            ? that.answers[key][counter].repeat
              ? loopQuestion(array, key, counter + 1)
              : done()
            : cb(array, key, counter, index + 1, that);
        };
        const innerLoop = function(subQuestions, key, counter, index, that) {
          var innerKey = subQuestions[index].name;
          return that.prompt([subQuestions[index]]).then(props => {
            if (isUndefined(that.answers[key])) {
              that.answers[key] = {};
            }
            if (isUndefined(that.answers[key][counter])) {
              that.answers[key][counter] = {};
            }
            that.answers[key][counter][innerKey] = props[innerKey];
            finishInLoop(subQuestions, index, key, counter, innerLoop, that);
          });
        };
        innerLoop(subQuestions, key, counter, 0, that);
        resolve();
      };
      // --------------------
      const finish = function(array, index, cb) {
        return array.length - 1 === index ? done() : cb(array, index + 1);
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
      var question = questions[index];
      var key = questions[index].name;

      // simple Question
      if (isUndefined(this.answers[key])) {
        console.log(util.promisify);
        if (_.isEqual(question.type, "array")) {
          new Promise(() => {
            loopQuestion(question.subQuestions, key, 0, this);
          }).then(res => {
            finish(questions, index, loop);
          });
        } else {
          return this.prompt([question]).then(props => {
            this.answers[key] = props[key];
            handleFollowUp(question, this.answers, props[key]);
            finish(questions, index, loop);
          });
        }
      }
      handleFollowUp(question, this.answers, this.answers[key]);

      finish(questions, index, loop);
    };

    return loop([questionApplicationType, questionLoopSPA, questionLast]);
  }

  writing() {
    console.log(this.answers);
    // if (this.answers.sub) {
    //   this.composeWith(
    //     "reraco:component",
    //     {
    //       answers: { preference: "template", template: "contact" },
    //       fromCompose: true
    //     },
    //     { local: require.resolve("./../component") }
    //   );
    // }
  }
};
