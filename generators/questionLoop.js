// module.exports.loop = function(questions, answers, prompt, done, index = 0) {
//   const finish = (index, cb) => {
//     return array.length - 1 === index
//       ? done()
//       : cb(questions, answers, prompt, done, index + 1);
//   };
//   const isUndefined = function(obj) {
//     return obj === undefined ? true : false;
//   };
//   const handleFollowUp = (question, condition) => {
//     if (!isUndefined(question.nextAnswers)) {
//       question.nextAnswers.map(answer => {
//         if (condition === answer.condition) {
//           return (answers[answer.name] = answer.value);
//         }
//       });
//     }
//   };
//   var key = [questions[index].name];
//   var question = questions[index];
// 
//   if (isUndefined(answers[key])) {
//     return prompt([question]).then(props => {
//       answers[key] = props[key];
//       handleFollowUp(question, props[key]);
//       finish(index, loop);
//     });
//   }
//   handleFollowUp(question, answers[key]);
//   finish(index, loop);
// };
