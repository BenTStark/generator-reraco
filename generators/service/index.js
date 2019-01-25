var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
  }

  prompting() {
    var introduction = "Design your service or use a fully working template.";

    this.options.fromCompose
      ? this.log(introduction)
      : this.log(yosay(chalk.red("Service Generator: ") + introduction));
  }

  writing() {}
};
