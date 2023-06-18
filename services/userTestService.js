module.exports.calcGrade = async ({
    UserTest,
    Test,
    userId,
    testId,
    answers,
}) => {
    const test = await Test.findById(testId);

    let msg = "";
    const answerRatio = 100 / test.questions.lenght;
    let grade = 0;

    answers.map((ans) => {
        if (test.questions[ans.questionIdx].correctAnswer === ans.answer) {
            grade += answerRatio;
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

    //TODO:
    //return the idx of the correctAnswer inside questions

    return { message: msg, grade };
};
