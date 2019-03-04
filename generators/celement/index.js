var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var changeCase = require("change-case");
var _ = require("lodash");

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
    var title = chalk.red("Celement Generator: ");
    var introduction = "Design your ducks or use a fully working template.";

    this.options.fromCompose
      ? this.log(title)
      : this.log(yosay(title + introduction));

    const questionPreference = {
      type: "list",
      name: "preference",
      message: "Do want a template or design your own celement?",
      choices: ["custom", "template"],
      nextAnswers: [
        { condition: "custom", name: "template", value: "n/a" },
        { condition: "template", name: "redux", value: "n/a" },
        { condition: "template", name: "service", value: "n/a" },
        { condition: "template", name: "css", value: "n/a" },
        { condition: "template", name: "test", value: "n/a" }
      ]
    };

    const questionTemplate = {
      type: "list",
      name: "template",
      message: "Choose your template?",
      choices: ["contact", "navigation"],
      nextAnswers: [
        { condition: "contact", name: "name", value: "contact" },
        { condition: "navigation", name: "name", value: "navigation" }
      ]
    };

    const questionName = {
      type: "input",
      name: "name",
      message: "What's the celement's name (camelCase)?"
    };

    const questionRedux = {
      type: "confirm",
      name: "redux",
      message: "Is Redux included?",
      nextAnswers: [
        { condition: true, name: "service", value: "n/a" },
        { condition: false, name: "ducks", value: "n/a" }
      ]
    };

    const questionAuth = {
      type: "checkbox",
      name: "auth",
      message: "Do want to add authentication (auth0js)?",
      // State and component: you want to use the login information
      // dispatch: you want to controll the login process
      choices: ["container - state", "container - dispatch", "component"]
    };

    const questionDucks = {
      type: "confirm",
      name: "ducks",
      message: "Do want to include duck files?"
    };

    const questionService = {
      type: "confirm",
      name: "service",
      message: "Do want to add a service file?"
    };

    const questionAxios = {
      type: "confirm",
      name: "axios",
      message: "Do you want to add AJAX with axios?"
    };

    const questionCss = {
      type: "confirm",
      name: "css",
      message: "Do you want to add a css file?"
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
      questionPreference,
      questionTemplate,
      questionName,
      questionRedux,
      questionAuth,
      questionDucks,
      questionService,
      questionAxios,
      questionCss,
      questionTest
    ]);
  }

  writing() {
    if (this.answers.redux) {
      this.composeWith(
        "reraco:container",
        {
          answers: {
            auth: {
              dispatch:
                _.indexOf(this.answers.auth, "container - dispatch") > -1
                  ? true
                  : false,
              state:
                _.indexOf(this.answers.auth, "container - state") > -1
                  ? true
                  : false
            },
            axios: this.answers.axios,
            dispatch:
              _.indexOf(this.answers.auth, "container -dispatch") > -1
                ? true
                : undefined,
            name: this.answers.name,
            preference: this.answers.preference,
            state:
              _.indexOf(this.answers.auth, "container -state") > -1
                ? true
                : undefined
          },
          fromCompose: true
        },
        { local: require.resolve("./../container") }
      );
      this.composeWith(
        "reraco:component",
        {
          answers: {
            auth: _.indexOf(this.answers.auth, "component") > -1 ? true : false,
            axios: false,
            hasContainer: true,
            hasService: false,
            name: this.answers.name,
            preference: this.answers.preference,
            type: "presentational"
          },
          fromCompose: true
        },
        { local: require.resolve("./../component") }
      );
      if (this.answers.ducks) {
        this.composeWith(
          "reraco:ducks",
          {
            answers: {
              auth:
                _.indexOf(this.answers.auth, "container - dispatch") > -1
                  ? true
                  : false,
              axios: this.answers.axios,
              name: this.answers.name
            },
            fromCompose: true
          },
          { local: require.resolve("./../ducks") }
        );
      }
    } else if (!this.answers.redux) {
      this.composeWith(
        "reraco:component",
        {
          answers: {
            // if axios, then it will be handled in service!
            axios: this.answers.axios,
            hasContainer: false,
            hasService: this.answers.service,
            name: this.answers.name,
            preference: this.answers.preference,
            type: this.answers.service ? "presentational" : undefined
          },
          fromCompose: true
        },
        { local: require.resolve("./../component") }
      );
      if (this.answers.service) {
        this.composeWith(
          "reraco:service",
          {
            answers: {
              axios: this.answers.axios,
              name: this.answers.name
            },
            fromCompose: true
          },
          { local: require.resolve("./../service") }
        );
      }
    }
  }
};

/*--------------------------------------------
OLD
--------------------------------------------*/

// module.exports = class extends Generator {
//   // The name `constructor` is important here
//   constructor(args, opts) {
//     // Calling the super constructor is important so our generator is correctly set up
//     super(args, opts);
//
//     // Next, add your custom code
//     this.option("babel"); // This method adds support for a `--babel` flag
//   }
//
//   async prompting() {
//     const choices = {
//       template: {
//         answers: [
//           "Design my own Celement",
//           "app",
//           "blog",
//           "contact",
//           "ducks only!"
//         ],
//         // TODO: Trennung von Component Type und ducks. Einfach nach componentType fragen ob ducks dazu sollen oder nicht.
//         componentType: [],
//         sass: [null, true, true, true, false],
//         duckFunctions: [],
//         // TODO: Sind andere reducer notwendig. z.B. authReducer einbinden
//         //reducer: [],
//         feature: [null, "app", "blog", null, null],
//         // For ducks featurePart and featureEqual not necessary
//         featureEqual: [null, true, true, false, "(n/a)"],
//         featurePart: [null, "app", "blog", "contact", "(n/a)"]
//       },
//       componentType: {
//         answers: ["full", "container", "component", "component with ducks"]
//       },
//       duckFunctions: ["auth", "axios"]
//     };
//     choices.template.componentType.push(null); // "Design my own Celement": componentType unknown yet
//     choices.template.componentType.push(choices.componentType.answers[3]); // "app": componentType - component with ducks
//     choices.template.componentType.push(choices.componentType.answers[0]); // "blog": componentType - full
//     choices.template.componentType.push(choices.componentType.answers[1]); // "contact": componentType - container
//     choices.template.componentType.push("(n/a)"); // "ducks only!": componentType not necessary
//
//     choices.template.duckFunctions.push(null); // "Design my own Celement": duckFunctions unknown yet
//     choices.template.duckFunctions.push([choices.duckFunctions[0]]); // "app": duckFunctions - auth
//     choices.template.duckFunctions.push([choices.duckFunctions[1]]); // "blog": duckFunctions - axios
//     choices.template.duckFunctions.push("(n/a)"); // "contact": no duckFunctions necessary
//     choices.template.duckFunctions.push(null); // "ducks only!": duckFunctions unknown yet
//
//     this.log(
//       yosay(
//         "Welcome to " +
//           chalk.red("reraco") +
//           ". Create your react-redux celement. Be sure you`re in the desired directory!"
//       )
//     );
//
//     /*------------------------------
//     Template(y/n)
//     ------------------------------*/
//     this.answers = await this.prompt([
//       {
//         type: "list",
//         name: "template",
//         message: "Do you want to install a template?",
//         choices: choices.template.answers
//       }
//     ])
//       .then(response => {
//         //if (!_.isEqual(response.template, choices.template.answers[0])) {
//         // If Template (opposite of "none of this")
//         // Then all other properties are already defined in choices
//         const index = choices.template.answers.indexOf(response.template);
//
//         _.merge(response, {
//           sass: choices.template.sass[index],
//           componentType: choices.template.componentType[index],
//           feature: choices.template.feature[index],
//           featurePart: choices.template.featurePart[index],
//           featureEqual: choices.template.featureEqual[index]
//         });
//         //}
//         return response;
//       })
//       .then(prevAnswer => {
//         const index = choices.template.answers.indexOf(prevAnswer.template);
//         if (_.isEqual(choices.template.componentType[index], null)) {
//           /*------------------------------
//           Celement and/or Ducks
//           ------------------------------*/
//           return this.prompt([
//             {
//               type: "list",
//               name: "componentType",
//               message:
//                 "Do you want a complete container component with ducks [full], only container component [container] or presentational component[component]?",
//               choices: choices.componentType.answers
//             }
//           ]).then(response => {
//             let isContainer = false;
//             if (
//               _.isEqual(
//                 response.componentType,
//                 choices.componentType.answers[0]
//               ) ||
//               _.isEqual(
//                 response.componentType,
//                 choices.componentType.answers[1]
//               )
//             ) {
//               isContainer = true;
//             }
//             _.merge(prevAnswer, {
//               componentType: response.componentType,
//               container: isContainer
//             });
//             return prevAnswer;
//           });
//         } else {
//           const nextAnswer = prevAnswer;
//           return nextAnswer;
//         }
//       })
//       .then(prevAnswer => {
//         const index = choices.template.answers.indexOf(prevAnswer.template);
//         if (_.isEqual(choices.template.sass[index], null)) {
//           /*------------------------------
//           Celement Design/ Template design
//             Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
//           ------------------------------*/
//           return this.prompt([
//             {
//               type: "confirm",
//               name: "sass",
//               message: "Do you want to include SASS Styling?"
//             }
//           ]).then(response => {
//             _.merge(prevAnswer, {
//               sass: response.sass
//             });
//             return prevAnswer;
//           });
//         } else {
//           const nextAnswer = prevAnswer;
//           return nextAnswer;
//         }
//       })
//       .then(prevAnswer => {
//         const index = choices.template.answers.indexOf(prevAnswer.template);
//         if (_.isEqual(choices.template.duckFunctions[index], null)) {
//           /*------------------------------
//           Duck Selection
//           ------------------------------*/
//           return this.prompt([
//             {
//               type: "checkbox",
//               name: "duckFunctions",
//               message: "Which duck Functions do you want to include",
//               choices: choices.duckFunctions
//             }
//           ]).then(response => {
//             choices.duckFunctions.forEach(func => {
//               prevAnswer[func] = false;
//               if (_.indexOf(response.duckFunctions, func) >= 0) {
//                 const obj = {};
//                 obj[func] = true;
//                 _.merge(prevAnswer, obj);
//               }
//             });
//
//             return prevAnswer;
//           });
//         } else {
//           choices.duckFunctions.forEach(func => {
//             prevAnswer[func] = false;
//             if (_.indexOf(choices.template.duckFunctions[index], func) >= 0) {
//               const obj = {};
//               obj[func] = true;
//               _.merge(prevAnswer, obj);
//             }
//           });
//
//           const nextAnswer = prevAnswer;
//           return nextAnswer;
//         }
//       })
//       .then(prevAnswer => {
//         const index = choices.template.answers.indexOf(prevAnswer.template);
//         if (_.isEqual(choices.template.feature[index], null)) {
//           /*------------------------------
//           Celement Design/ Template design
//             Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
//           ------------------------------*/
//           return this.prompt([
//             {
//               type: "input",
//               name: "feature",
//               message:
//                 "What`s the name of the Feature (camelCase - e.g. home, about, etc.)? Can be the same as container/component.",
//               default: "feature"
//             }
//           ]).then(response => {
//             _.merge(prevAnswer, {
//               feature: response.feature
//             });
//             return prevAnswer;
//           });
//         } else {
//           const nextAnswer = prevAnswer;
//           return nextAnswer;
//         }
//       })
//       .then(prevAnswer => {
//         const index = choices.template.answers.indexOf(prevAnswer.template);
//         if (_.isEqual(choices.template.featureEqual[index], null)) {
//           /*------------------------------
//           Celement Design/ Template design
//             Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
//           ------------------------------*/
//           return this.prompt([
//             {
//               type: "confirm",
//               name: "featureEqual",
//               message:
//                 "Is the feature name equal to the container/component name?"
//             }
//           ]).then(response => {
//             if (response.featureEqual) {
//               _.merge(prevAnswer, {
//                 featureEqual: response.featureEqual,
//                 featurePart: prevAnswer.feature
//               });
//             } else {
//               _.merge(prevAnswer, {
//                 featureEqual: response.featureEqual
//               });
//             }
//             return prevAnswer;
//           });
//         } else {
//           const nextAnswer = prevAnswer;
//           return nextAnswer;
//         }
//       })
//       .then(prevAnswer => {
//         const index = choices.template.answers.indexOf(prevAnswer.template);
//         if (
//           _.isEqual(choices.template.featurePart[index], null) &&
//           !prevAnswer.featureEqual
//         ) {
//           /*------------------------------
//           Celement Design/ Template design
//             Ducks, Celements and some Templates need the Info on the feature name which can be choosen by the user!
//           ------------------------------*/
//           return this.prompt([
//             {
//               type: "input",
//               name: "featurePart",
//               message:
//                 "What´s the name of your container/component (camelCase)?",
//               default: "newFeature"
//             }
//           ]).then(response => {
//             _.merge(prevAnswer, {
//               featurePart: response.featurePart
//             });
//             return prevAnswer;
//           });
//         } else {
//           const nextAnswer = prevAnswer;
//           return nextAnswer;
//         }
//       });
//   }
//
//   writing() {
//     var props = this.answers;
//     props.capFeaturePart = changeCase.pascalCase(props.featurePart);
//     props.capFeature = changeCase.pascalCase(props.feature);
//     console.log(props);
//     var copy = this.fs.copy.bind(this.fs);
//     var copyTpl = this.fs.copyTpl.bind(this.fs);
//     var tPath = this.templatePath.bind(this);
//     var dPath = this.destinationPath.bind(this);
//
//     if (
//       _.isEqual(props.componentType, "full") ||
//       _.isEqual(props.template, "ducks only!") ||
//       _.isEqual(props.template, "component with ducks")
//     ) {
//       // ducks are only required when full feature is installed or when only duck is selected
//       copyTpl(tPath("duck/actions.js"), dPath("duck/actions.js"), props);
//       copyTpl(
//         tPath("duck/actions.test.js"),
//         dPath("duck/actions.test.js"),
//         props
//       );
//       if (props.auth) {
//         copy(tPath("duck/auth.constant.js"), dPath("duck/auth.constant.js"));
//         copy(tPath("duck/auth.service.js"), dPath("duck/auth.service.js"));
//       }
//       copyTpl(tPath("duck/operations.js"), dPath("duck/operations.js"), props);
//       copyTpl(
//         tPath("duck/operations.test.js"),
//         dPath("duck/operations.test.js"),
//         props
//       );
//       copyTpl(tPath("duck/reducer.js"), dPath("duck/reducer.js"), props);
//       copyTpl(
//         tPath("duck/reducer.test.js"),
//         dPath("duck/reducer.test.js"),
//         props
//       );
//       copyTpl(tPath("duck/types.js"), dPath("duck/types.js"), props);
//     }
//
//     if (
//       _.isEqual(props.componentType, "container") ||
//       _.isEqual(props.componentType, "full")
//     ) {
//       // for container of full feater; container is installed
//       copyTpl(
//         tPath("featurePart.container.js"),
//         dPath(props.featurePart + ".container.jsx"),
//         props
//       );
//     }
//     // default files
//     if (!_.isEqual(props.componentType, "(n/a)")) {
//       copyTpl(
//         tPath("featurePart.component.js"),
//         dPath(props.featurePart + ".component.js"),
//         props
//       );
//       copyTpl(
//         tPath("featurePart.test.js"),
//         dPath(props.featurePart + ".test.js"),
//         props
//       );
//       copyTpl(
//         tPath("featurePart.check.html"),
//         dPath(props.featurePart + ".check.html"),
//         props
//       );
//       if (props.sass) {
//         copy(tPath("featurePart.scss"), dPath(props.featurePart + ".scss"));
//       }
//     }
//   }
// };
