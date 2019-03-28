var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var changeCase = require("change-case");

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
    var title = chalk.red("Reducer Generator: ");
    var introduction = "Design your reducer.";

    this.options.fromCompose
      ? this.log(title + " adding answers from previous generators")
      : this.log(yosay(title + introduction));

    const questionName = {
      type: "input",
      name: "name",
      message:
        "What's the name of the container directly connected to this duck (camelCase)?"
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

    return loop([questionName, questionAuth, questionAxios]);
  }

  writing() {
    const isUndefined = function(obj) {
      return obj === undefined ? true : false;
    };

    var props = this.answers;
    props.capName = changeCase.pascalCase(props.name);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);
    var clientPath = "";
    if (!isUndefined(this.options.clientPath)) {
      clientPath = this.options.clientPath;
    }
    var folder = "";
    if (!isUndefined(this.answers.folder)) {
      folder = this.answers.folder;
    }

    copyTpl(
      tPath("custom.js"),
      dPath(clientPath + folder + "duck/" + props.name + ".reducer.js"),
      props
    );
  }
};
