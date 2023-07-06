exports.subscripe = async ({ UserCourse, userId, courseId }) => {
    //NOTE: if user never subscriped
    const userSubscripedCoursesBefore = await UserCourse.findOne({
        userId,
    }).exec();

    const coursesOfUser = {
        courseId,
        watched: "0.0",
        passed: false,
    };

    if (!userSubscripedCoursesBefore) {
        UserCourse.create({
            userId,
            courses: [coursesOfUser],
        });
    } else {
        const { courses } = await UserCourse.findOne({ userId }).exec();

        courses.push(coursesOfUser);

        const userCourse = await UserCourse.findOneAndUpdate(
            { userId },
            {
                courses,
            },
            { returnOriginal: false }
        ).exec();
    }
};

exports.unsubscripe = async ({ UserCourse, userId, courseId }) => {
    const { courses } = await UserCourse.findOne({ userId }).exec();
    let userCourseDocument = {};
    for (const elm of courses) {
        if (elm.courseId == courseId) {
            userCourseDocument = elm;
        }
    }
    const idxOfUserCourse = courses.indexOf(userCourseDocument);
    courses.splice(idxOfUserCourse, 1);

    const userCourse = await UserCourse.findOneAndUpdate(
        { userId },
        {
            courses,
        },
        { returnOriginal: false }
    ).exec();

    return userCourse;
};
