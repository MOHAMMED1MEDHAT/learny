exports.subscripe = async ({ Course, userId, courseId }) => {
    console.log(courseId);
    const { subscripers } = await Course.findById(courseId).exec();
    for (const subscriper of subscripers) {
        if (subscriper.subscriperId == userId) {
            return "subscriped".toUpperCase();
        }
    }

    const subscriper = {
        subscriperId: userId,
    };
    subscripers.push(subscriper);

    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            subscripers,
        },
        { returnOriginal: false }
    ).exec();

    return course;
};

exports.unsubscripe = async ({ Course, userId, courseId }) => {
    const { subscripers } = await Course.findById(courseId).exec();
    let subscriper = {};
    for (const elm of subscripers) {
        if (elm.subscriperId == userId) {
            subscriper = elm;
        }
    }
    const idxOfSubscriper = subscripers.indexOf(subscriper);
    subscripers.splice(idxOfSubscriper, 1);

    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            subscripers,
        },
        { returnOriginal: false }
    ).exec();

    return course;
};
