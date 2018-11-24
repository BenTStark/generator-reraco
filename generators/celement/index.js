var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var changeCase = require("change-case");
var _ = require("lodash");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag
  }

  async prompting() {
    const choices = {
      template: {
        answers: [
          "Design my own Celement",
          "app",
          "blog",
          "contact",
          "ducks only!"
        ],
        // TODO: Trennung von Component Type und ducks. Einfach nach componentType fragen ob ducks dazu sollen oder nicht.
        componentType: [],
        sass: [null, true, true, true, false],
        duckFunctions: [],
        // TODO: Sind andere reducer notwendig. z.B. authReducer einbinden
        //reducer: [],
        feature: [null, "app", "blog", null, null],
        // For ducks featurePart and featureEqual not necessary
        featureEqual: [null, true, true, false, "(n/a)"],
        featurePart: [null, "app", "blog", "contact", "(n/a)"]
      },
      componentType: {
        answers: ["full", "container", "component", "component with ducks"]
      },
      duckFunctions: ["auth", "axios"]
    };
    choices.template.componentType.push(null); // "Design my own Celement": componentType unknown yet
    choices.template.componentType.push(choices.componentType.answers[3]); // "app": componentType - component with ducks
    choices.template.componentType.push(choices.componentType.answers[0]); // "blog": componentType - full
    choices.template.componentType.push(choices.componentType.answers[1]); // "contact": componentType - container
    choices.template.componentType.push("(n/a)"); // "ducks only!": componentType not necessary

    choices.template.duckFunctions.push(null); // "Design my own Celement": duckFunctions unknown yet
    choices.template.duckFunctions.push([choices.duckFunctions[0]]); // "app": duckFunctions - auth
    choices.template.duckFunctions.push([choices.duckFunctions[1]]); // "blog": duckFunctions - axios
    choices.template.duckFunctions.push("(n/a)"); // "contact": no duckFunctions necessary
    choices.template.duckFunctions.push(null); // "ducks only!": duckFunctions unknown yet

    this.log(
      yosay(
        "Welcome to " +
          chalk.red("reraco") +
          ". Create your react-redux celement. Be sure you`re in the desired directory!"
      )
    );

    /*------------------------------
    Template(y/n)
    ------------------------------*/
    this.answers = await this.prompt([
      {
        type: "list",
        name: "template",
        message: "Do you want to install a template?",
        choices: choices.template.answers
      }
    ])
      .then(response => {
        //if (!_.isEqual(response.template, choices.template.answers[0])) {
        // If Template (opposite of "none of this")
        // Then all other properties are already defined in choices
        const index = choices.template.answers.indexOf(response.template);

        _.merge(response, {
          sass: choices.template.sass[index],
          componentType: choices.template.componentType[index],
          feature: choices.template.feature[index],
          featurePart: choices.template.featurePart[index],
          featureEqual: choices.template.featureEqual[index]
        });
        //}
        return response;
      })
      .then(prevAnswer => {
        const index = choices.template.answers.indexOf(prevAnswer.template);
        if (_.isEqual(choices.template.componentType[index], null)) {
          /*------------------------------
          Celement and/or Ducks
          ------------------------------*/
          return this.prompt([
            {
              type: "list",
              name: "componentType",
              message:
                "Do you want a complete container component with ducks [full], only container component [container] or presentational component[component]?",
              choices: choices.componentType.answers
            }
          ]).then(response => {
            let isContainer = false;
            if (
              _.isEqual(
                response.componentType,
                choices.componentType.answers[0]
              ) ||
              _.isEqual(
                response.componentType,
                choices.componentType.answers[1]
              )
            ) {
              isContainer = true;
            }
            _.merge(prevAnswer, {
              componentType: response.componentType,
              container: isContainer
            });
            return prevAnswer;
          });
        } else {
          const nextAnswer = prevAnswer;
          return nextAnswer;
        }
      })
      .then(prevAnswer => {
        const index = choices.template.answers.indexOf(prevAnswer.template);
        if (_.isEqual(choices.template.sass[index], null)) {
          /*------------------------------
          Celement Design/ Template design
            Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
          ------------------------------*/
          return this.prompt([
            {
              type: "confirm",
              name: "sass",
              message: "Do you want to include SASS Styling?"
            }
          ]).then(response => {
            _.merge(prevAnswer, {
              sass: response.sass
            });
            return prevAnswer;
          });
        } else {
          const nextAnswer = prevAnswer;
          return nextAnswer;
        }
      })
      .then(prevAnswer => {
        const index = choices.template.answers.indexOf(prevAnswer.template);
        if (_.isEqual(choices.template.duckFunctions[index], null)) {
          /*------------------------------
          Duck Selection
          ------------------------------*/
          return this.prompt([
            {
              type: "checkbox",
              name: "duckFunctions",
              message: "Which duck Functions do you want to include",
              choices: choices.duckFunctions
            }
          ]).then(response => {
            choices.duckFunctions.forEach(func => {
              prevAnswer[func] = false;
              if (_.indexOf(response.duckFunctions, func) >= 0) {
                const obj = {};
                obj[func] = true;
                _.merge(prevAnswer, obj);
              }
            });

            return prevAnswer;
          });
        } else {
          choices.duckFunctions.forEach(func => {
            prevAnswer[func] = false;
            if (_.indexOf(choices.template.duckFunctions[index], func) >= 0) {
              const obj = {};
              obj[func] = true;
              _.merge(prevAnswer, obj);
            }
          });

          const nextAnswer = prevAnswer;
          return nextAnswer;
        }
      })
      .then(prevAnswer => {
        const index = choices.template.answers.indexOf(prevAnswer.template);
        if (_.isEqual(choices.template.feature[index], null)) {
          /*------------------------------
          Celement Design/ Template design
            Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
          ------------------------------*/
          return this.prompt([
            {
              type: "input",
              name: "feature",
              message:
                "What`s the name of the Feature (camelCase - e.g. home, about, etc.)? Can be the same as container/component.",
              default: "feature"
            }
          ]).then(response => {
            _.merge(prevAnswer, {
              feature: response.feature
            });
            return prevAnswer;
          });
        } else {
          const nextAnswer = prevAnswer;
          return nextAnswer;
        }
      })
      .then(prevAnswer => {
        const index = choices.template.answers.indexOf(prevAnswer.template);
        if (_.isEqual(choices.template.featureEqual[index], null)) {
          /*------------------------------
          Celement Design/ Template design
            Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
          ------------------------------*/
          return this.prompt([
            {
              type: "confirm",
              name: "featureEqual",
              message:
                "Is the feature name equal to the container/component name?"
            }
          ]).then(response => {
            if (response.featureEqual) {
              _.merge(prevAnswer, {
                featureEqual: response.featureEqual,
                featurePart: prevAnswer.feature
              });
            } else {
              _.merge(prevAnswer, {
                featureEqual: response.featureEqual
              });
            }
            return prevAnswer;
          });
        } else {
          const nextAnswer = prevAnswer;
          return nextAnswer;
        }
      })
      .then(prevAnswer => {
        const index = choices.template.answers.indexOf(prevAnswer.template);
        if (
          _.isEqual(choices.template.featurePart[index], null) &&
          !prevAnswer.featureEqual
        ) {
          /*------------------------------
          Celement Design/ Template design
            Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
          ------------------------------*/
          return this.prompt([
            {
              type: "input",
              name: "featurePart",
              message:
                "What´s the name of your container/component (camelCase)?",
              default: "newFeature"
            }
          ]).then(response => {
            _.merge(prevAnswer, {
              featurePart: response.featurePart
            });
            return prevAnswer;
          });
        } else {
          const nextAnswer = prevAnswer;
          return nextAnswer;
        }
      });
  }

  writing() {
    var props = this.answers;
    props.capFeaturePart = changeCase.pascalCase(props.featurePart);
    props.capFeature = changeCase.pascalCase(props.feature);
    console.log(props);
    var copy = this.fs.copy.bind(this.fs);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);

    if (
      _.isEqual(props.componentType, "full") ||
      _.isEqual(props.template, "ducks only!") ||
      _.isEqual(props.template, "component with ducks")
    ) {
      // ducks are only required when full feature is installed or when only duck is selected
      copyTpl(tPath("duck/actions.js"), dPath("duck/actions.js"), props);
      copyTpl(
        tPath("duck/actions.test.js"),
        dPath("duck/actions.test.js"),
        props
      );
      if (props.auth) {
        copy(tPath("duck/auth.constant.js"), dPath("duck/auth.constant.js"));
        copy(tPath("duck/auth.service.js"), dPath("duck/auth.service.js"));
      }
      copyTpl(tPath("duck/operations.js"), dPath("duck/operations.js"), props);
      copyTpl(
        tPath("duck/operations.test.js"),
        dPath("duck/operations.test.js"),
        props
      );
      copyTpl(tPath("duck/reducer.js"), dPath("duck/reducer.js"), props);
      copyTpl(
        tPath("duck/reducer.test.js"),
        dPath("duck/reducer.test.js"),
        props
      );
      copyTpl(tPath("duck/types.js"), dPath("duck/types.js"), props);
    }

    if (
      _.isEqual(props.componentType, "container") ||
      _.isEqual(props.componentType, "full")
    ) {
      // for container of full feater; container is installed
      copyTpl(
        tPath("featurePart.container.js"),
        dPath(props.featurePart + ".container.jsx"),
        props
      );
    }
    // default files
    if (!_.isEqual(props.componentType, "(n/a)")) {
      copyTpl(
        tPath("featurePart.component.js"),
        dPath(props.featurePart + ".component.js"),
        props
      );
      copyTpl(
        tPath("featurePart.test.js"),
        dPath(props.featurePart + ".test.js"),
        props
      );
      copyTpl(
        tPath("featurePart.check.html"),
        dPath(props.featurePart + ".check.html"),
        props
      );
      if (props.sass) {
        copy(tPath("featurePart.scss"), dPath(props.featurePart + ".scss"));
      }
    }
  }
};
