var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var _ = require("lodash");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    var that = this;
    that.options.answers === undefined
      ? (this.answers = {})
      : (this.answers = that.options.answers);
  }

  prompting() {
    var done = this.async();
    var title = chalk.red("Ducks Generator: ");
    var introduction = "Design your ducks or use a fully working template.";

    this.options.fromCompose
      ? this.log(title)
      : this.log(yosay(title + introduction));

    const questionName = {
      type: "input",
      name: "name",
      message:
        "What's the name of the container directly connected to these ducks (camelCase)?"
    };

    const questionDucks = {
      type: "checkbox",
      name: "ducks",
      message: "Which ducks do you want to add?",
      choices: ["action", "operation", "reducer", "types"]
    };

    const questionAuth = {
      type: "confirm",
      name: "auth",
      message: "Do want to add authentication (auth0js)?"
    };

    const questionAxios = {
      type: "confirm",
      name: "axios",
      message: "Do you want to add AJAX with axios?"
    };

    const questionTest = {
      type: "confirm",
      name: "test",
      message: "Do you want to add Jest test files?"
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
      questionName,
      questionDucks,
      questionAuth,
      questionAxios,
      questionTest
    ]);
  }

  writing() {
    if (_.includes(this.answers.ducks, "action")) {
      this.composeWith(
        "reraco:action",
        {
          answers: {
            auth: this.answers.auth,
            axios: this.answers.axios,
            folder: this.answers.folder,
            name: this.answers.name
          },
          clientPath: this.options.clientPath,
          fromCompose: true
        },
        { local: require.resolve("./../action") }
      );
    }
    if (_.includes(this.answers.ducks, "operation")) {
      this.composeWith(
        "reraco:operation",
        {
          answers: {
            auth: this.answers.auth,
            axios: this.answers.axios,
            folder: this.answers.folder,
            name: this.answers.name
          },
          clientPath: this.options.clientPath,
          fromCompose: true
        },
        { local: require.resolve("./../operation") }
      );
    }
    if (_.includes(this.answers.ducks, "reducer")) {
      this.composeWith(
        "reraco:reducer",
        {
          answers: {
            auth: this.answers.auth,
            axios: this.answers.axios,
            folder: this.answers.folder,
            name: this.answers.name
          },
          clientPath: this.options.clientPath,
          fromCompose: true
        },
        { local: require.resolve("./../reducer") }
      );
    }
    if (_.includes(this.answers.ducks, "types")) {
      this.composeWith(
        "reraco:types",
        {
          answers: {
            auth: this.answers.auth,
            axios: this.answers.axios,
            folder: this.answers.folder,
            name: this.answers.name
          },
          clientPath: this.options.clientPath,
          fromCompose: true
        },
        { local: require.resolve("./../types") }
      );
    }
  }
};
