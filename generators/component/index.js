var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var changeCase = require("change-case");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    var that = this;
    //this.option('babel');
    that.options.answers === undefined
      ? (this.answers = { auth: false, hasContainer: false, hasService: false })
      : (this.answers = that.options.answers);
  }

  prompting() {
    var done = this.async();
    var title = chalk.red("Component Generator: ");
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
        { condition: "template", name: "type", value: "n/a" },
        { condition: "template", name: "auth", value: false },
        { condition: "template", name: "proptypes", value: false }
      ]
    };

    const questionTemplate = {
      type: "list",
      name: "template",
      message: "Choose your template?",
      choices: ["home", "cards", "bullets", "contact", "to-do list"],
      nextAnswers: [
        { condition: "home", name: "type", value: "presentational" },
        { condition: "home", name: "name", value: "home" },
        { condition: "cards", name: "type", value: "presentational" },
        { condition: "cards", name: "name", value: "cards" },
        { condition: "bullets", name: "type", value: "presentational" },
        { condition: "bullets", name: "name", value: "bullets" },
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
      nextAnswers: [{ condition: "functional", name: "axios", value: false }]
    };

    const questionAxios = {
      type: "confirm",
      name: "axios",
      message: "Do you want to add AJAX with axios?"
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
      questionName,
      questionType,
      questionAxios,
      questionProptypes
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
      dPath(clientPath + folder + props.name + ".component.js"),
      props
    );
  }
};
