var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var changeCase = require("change-case");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    var that = this;
    that.options.answers === undefined
      ? (this.answers = { auth: { state: false, dispatch: false } })
      : (this.answers = that.options.answers);
  }

  prompting() {
    var done = this.async();
    var title = chalk.red("Container Generator: ");
    var introduction = "Design your ducks or use a fully working template.";

    this.options.fromCompose
      ? this.log(title)
      : this.log(yosay(title + introduction));

    const questionPreference = {
      type: "list",
      name: "preference",
      message: "Do want a template or design your own component?",
      choices: ["custom", "template"],
      nextAnswers: [
        { condition: "custom", name: "template", value: "n/a" },
        { condition: "template", name: "name", value: "n/a" },
        { condition: "template", name: "axios", value: "n/a" },
        { condition: "template", name: "state", value: "n/a" },
        { condition: "template", name: "dispatch", value: "n/a" }
      ]
    };

    const questionTemplate = {
      type: "list",
      name: "template",
      message: "Choose your template?",
      choices: ["contact", "to-do list"]
    };

    const questionName = {
      type: "input",
      name: "name",
      message: "What's the container's name (camelCase)?"
    };

    const questionAxios = {
      type: "confirm",
      name: "axios",
      message: "Do you want to add AJAX with axios?",
      nextAnswers: [
        { condition: true, name: "state", value: true },
        { condition: true, name: "dispatch", value: true }
      ]
    };

    const questionState = {
      type: "confirm",
      name: "state",
      message: "Do you want a map state to props function?",
      nextAnswers: [{ condition: false, name: "dispatch", value: true }]
    };

    const questionDispatch = {
      type: "confirm",
      name: "dispatch",
      message: "Do you want a map state to dispatch function?"
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
      questionName,
      questionAxios,
      questionState,
      questionDispatch
    ]);
  }

  writing() {
    const isUndefined = function(obj) {
      return obj === undefined ? true : false;
    };

    var props = this.answers;
    props.capName = changeCase.pascalCase(props.name);
    //var copy = this.fs.copy.bind(this.fs);
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
      dPath(clientPath + folder + props.name + ".container.js"),
      props
    );
  }
};
