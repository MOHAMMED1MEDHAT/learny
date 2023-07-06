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

exports.updateCoursePassedState = async ({
    UserCourse,
    userId,
    courseId,
    isPassed,
}) => {
    const userCourse = await UserCourse.findOne({ userId }).exec();

    const { courses } = userCourse;

    for (const course of courses) {
        if (course.courseId == courseId) {
            course.passed = isPassed;
            // console.log("course.passed", course.passed);
        }
    }

    await UserCourse.findOneAndUpdate({ userId }, { courses }).exec();
};

exports.isSubscriped = async ({ UserCourse, userId, courseId }) => {
    //NOTE: if user never subscriped
    const userSubscripedCourseBefore = await UserCourse.findOne({
        userId,
    }).exec();

    if (!userSubscripedCourseBefore) {
        return false;
    } else {
        let isSubscriped = false;
        userSubscripedCourseBefore.courses.forEach((course) => {
            if (course.courseId.toString() == courseId.toString()) {
                isSubscriped = true;
            }
        });
        return isSubscriped;
    }
};

exports.isPassed = async ({ UserCourse, userId, courseId }) => {
    const { courses } = await UserCourse.findOne({ userId }).exec();
    let isPassed = false;

    courses.forEach((course) => {
        if (course.courseId.toString() == courseId.toString()) {
            // console.log("course.passed", course.passed);
            isPassed = course.passed;
        }
    });

    return isPassed;
};
