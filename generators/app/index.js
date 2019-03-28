var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var _ = require("lodash");
var changeCase = require("change-case");

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
    const questionApplicationName = {
      type: "input",
      name: "applicationName",
      message: "What's the name of your application?"
    };

    const questionApplicationType = {
      type: "list",
      name: "applicationType",
      message:
        "Do you want to create a Single Page Application (SPA) or Multi Page Application (MPA)?",
      choices: ["SPA", "MPA"],
      nextAnswers: [{ condition: "MPA", name: "SPAContent", value: "n/a" }]
    };

    const questionLoopSPA = {
      type: "array",
      name: "SPAContent",
      subQuestions: [
        {
          type: "confirm",
          name: "isTemplate",
          message: "Do you want to use a template?",
          nextAnswers: [
            { condition: false, name: "template", value: "n/a" },
            { condition: true, name: "feature", value: "n/a" }
          ]
        },
        {
          type: "list",
          name: "template",
          message: "Which template do you want to use?",
          choices: ["home", "cards", "bullets", "contact"]
        },
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

    const questionLightShades = {
      type: "input",
      name: "lightShades",
      message:
        "According to colormind.io: Choose you HEX Color for Light shades (no hashtag required):"
    };
    const questionLightAccent = {
      type: "input",
      name: "lightAccent",
      message:
        "According to colormind.io: Choose you HEX Color for Light accent (no hashtag required):"
    };
    const questionMainBrandColor = {
      type: "input",
      name: "mainBrandColor",
      message:
        "According to colormind.io: Choose you HEX Color for Main Brand Color (no hashtag required):"
    };
    const questionDarkAccent = {
      type: "input",
      name: "darkAccent",
      message:
        "According to colormind.io: Choose you HEX Color for Dark Accent (no hashtag required):"
    };
    const questionDarkShades = {
      type: "input",
      name: "darkShades",
      message:
        "According to colormind.io: Choose you HEX Color for Dark shades (no hashtag required):"
    };

    // SPA:
    // 1. Das heißt erstmal, dass ich nur mit Komponenten arbeite. Axios einbindung mache ich dann erstmal
    // testweise bei meiner Seite. Login ist noch in weiter ferne!
    // 2. erstmal festlegen welche Blöcke rein sollen. D.h. da brauch ich erstmal
    // z.b. erst will ich eine template header,
    // dann ne freie Seite mit Namen "Foo Bar"
    // zum schluss ein Contact Template
    const loop = async function(questions, that, index = 0) {
      const isUndefined = function(obj) {
        return obj === undefined ? true : false;
      };
      const handleFollowUp = function(question, answers, condition) {
        // if the answer of one question leads automatically to answers in subsequent questions
        if (!isUndefined(question.nextAnswers)) {
          question.nextAnswers.map(answer => {
            if (condition === answer.condition) {
              return (answers[answer.name] = answer.value);
            }
          });
        }
      };
      // --------------------
      //If Questionsgroup should be repeated n times
      const loopQuestion = async function(subQuestions, key, counter, that) {
        const innerLoop = async function(
          subQuestions,
          key,
          counter,
          index = 0
        ) {
          isUndefined(that.answers[key][counter])
            ? (that.answers[key][counter] = {})
            : undefined;
          if (
            isUndefined(that.answers[key][counter][subQuestions[index].name])
          ) {
            const props = await that.prompt([subQuestions[index]]);
            that.answers[key][counter][subQuestions[index].name] =
              props[subQuestions[index].name];
            handleFollowUp(
              subQuestions[index],
              that.answers[key][counter],
              props[subQuestions[index].name]
            );
          }
          return subQuestions.length - 1 === index
            ? that
            : innerLoop(subQuestions, key, counter, index + 1);
        };
        await innerLoop(subQuestions, key, counter, 0);

        return that.answers[key][counter].repeat
          ? await loopQuestion(subQuestions, key, counter + 1, that)
          : (that.answers[key].counter = counter);
      };
      // --------------------
      var question = questions[index];
      var key = questions[index].name;

      if (isUndefined(that.answers[key])) {
        if (_.isEqual(question.type, "array")) {
          that.answers[key] = {};
          await loopQuestion(question.subQuestions, key, 0, that);
        } else {
          const props = await that.prompt([question]);
          that.answers[key] = props[key];
          handleFollowUp(question, that.answers, props[key]);
        }
        return questions.length - 1 === index
          ? that
          : await loop(questions, that, index + 1);
      }
    };

    loop(
      [
        questionApplicationName,
        questionApplicationType,
        questionLoopSPA,
        questionLightShades,
        questionLightAccent,
        questionMainBrandColor,
        questionDarkAccent,
        questionDarkShades
      ],
      this,
      0
    ).then(out => {
      done();
    });
  }

  writing() {
    console.log(this.answers);

    var props = this.answers;
    if (!_.isEqual(this.answers.SPAContent, "n/a")) {
      for (var i = 0; i <= this.answers.SPAContent.counter; i++) {
        if (props.SPAContent[i].isTemplate) {
          props.SPAContent[i].feature = props.SPAContent[i].template;
        }
        props.SPAContent[i].capFeature = changeCase.pascalCase(
          this.answers.SPAContent[i].feature
        );
      }
    }
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var copy = this.fs.copy.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);
    var clientPath = "src/client/";

    if (!_.isEqual(this.answers.SPAContent, "n/a")) {
      for (var i = 0; i <= this.answers.SPAContent.counter; i++) {
        this.composeWith(
          "reraco:celement",
          {
            answers: {
              auth: "component",
              ducks: false,
              folder: true,
              name: this.answers.SPAContent[i].feature,
              preference: this.answers.SPAContent[i].isTemplate
                ? "template"
                : "custom",
              redux: false,
              service: this.answers.SPAContent[i].isTemplate ? true : false,
              template: this.answers.SPAContent[i].isTemplate
                ? this.answers.SPAContent[i].template
                : "n/a"
            },
            fromCompose: true,
            clientPath: clientPath
          },
          { local: require.resolve("./../celement") }
        );
      }
    }

    copy(
      tPath("App/spa.component.js"),
      dPath(clientPath + "App/app.component.js")
    );
    copyTpl(tPath("App/spa.scss"), dPath(clientPath + "App/app.scss"), props);

    copy(
      tPath("Hero/spa.component.js"),
      dPath(clientPath + "Hero/hero.component.js")
    );
    copy(tPath("Hero/spa.scss"), dPath(clientPath + "Hero/hero.scss"));
    copy(tPath("Hero/bg.jpg"), dPath(clientPath + "Hero/bg.jpg"));

    copy(
      tPath("Imprint/spa.component.js"),
      dPath(clientPath + "Imprint/imprint.component.js")
    );
    copy(tPath("Imprint/spa.scss"), dPath(clientPath + "Imprint/imprint.scss"));

    copy(
      tPath("NotFound/spa.component.js"),
      dPath(clientPath + "NotFound/notFound.component.js")
    );

    copyTpl(
      tPath("Main/spa.component.js"),
      dPath(clientPath + "Main/main.component.js"),
      props
    );
    copy(tPath("Main/spa.scss"), dPath(clientPath + "Main/main.scss"));

    copy(tPath("src/spa.index.js"), dPath(clientPath + "index.js"));
    copy(tPath("src/spa.routes.js"), dPath(clientPath + "routes.js"));
    copyTpl(
      tPath("src/spa.index.html"),
      dPath(clientPath + "index.html"),
      props
    );

    copyTpl(tPath("package.json"), dPath("package.json"), props);
    copy(tPath("webpack.config.js"), dPath("webpack.config.js"));
    copy(tPath("babelrc"), dPath(".babelrc"));

    // TODO: install
  }
};
