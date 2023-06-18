exports.calcGrade = async ({ UserTest, Test, userId, testId, answers }) => {
    const test = await Test.findById(testId);

    const answerRatio = 100 / test.questions.length;
    let msg = "";
    let grade = 0;
    //to return the idx of the correctAnswer inside questions
    let correctAndNotObj = [];

    answers
        .map((ans) => {
            if (test.questions[ans.questionIdx].correctAnswer === ans.answer) {
                grade += answerRatio;
                return true;
            } else {
                return false;
            }
        })
        .map((flag, idx) => {
            if (!flag) {
                // to convert index of the answer to a,b,c,d
                const char = String.fromCharCode(
                    test.questions[idx].answers.indexOf(
                        test.questions[idx].correctAnswer
                    ) + 97
                );
                correctAndNotObj.push(
                    `${char}:${test.questions[idx].correctAnswer}`
                );
            } else {
                correctAndNotObj.push(flag);
            }
        });

    const userTest = await UserTest.create({
        userId,
        testId,
        grade,
    });

    if (grade < test.successGrade) {
        msg = "Faild";
    } else {
        msg = "Passed";
    }

    return { message: msg, grade, correctAndNotObj };
};
