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

exports.deleteCourse = async (Track, courseId) => {
    let tracks = await Track.find();
    //which track has this course
    tracks = tracks.map((elm) => {
        const res = elm.courses.map((course) => {
            return course.courseId == courseId;
        });
        for (flag of res) {
            if (flag) {
                return elm._id;
            }
        }
    });

    tracks.map(async (track) => {
        if (track) {
            const { courses } = await Track.findById(track);
            let CourseDocument = {};
            for (elm of courses) {
                if (elm.courseId == courseId) {
                    CourseDocument = elm;
                }
            }
            const idxOfUserCourse = courses.indexOf(CourseDocument);
            courses.splice(idxOfUserCourse, 1);

            await Track.findOneAndUpdate(
                track,
                {
                    courses,
                },
                { returnOriginal: false }
            ).exec();
        }
    });
};

class CourseService {
    constructor(Course) {
        this.Course = Course;
    }

    async subscripe(userId, courseId) {
        console.log(courseId);
        const { subscripers } = await this.Course.findById(courseId).exec();
        for (const subscriper of subscripers) {
            if (subscriper.subscriperId == userId) {
                return "subscriped".toUpperCase();
            }
        }

        const subscriper = {
            subscriperId: userId,
        };
        subscripers.push(subscriper);

        const course = await this.Course.findByIdAndUpdate(
            courseId,
            {
                subscripers,
            },
            { returnOriginal: false }
        ).exec();

        return course;
    }

    async unsubscripe(userId, courseId) {
        const { subscripers } = await this.Course.findById(courseId).exec();
        let subscriper = {};
        for (const elm of subscripers) {
            if (elm.subscriperId == userId) {
                subscriper = elm;
            }
        }
        const idxOfSubscriper = subscripers.indexOf(subscriper);
        subscripers.splice(idxOfSubscriper, 1);

        const course = await this.Course.findByIdAndUpdate(
            courseId,
            {
                subscripers,
            },
            { returnOriginal: false }
        ).exec();

        return course;
    }

    async deleteCourseFromAllTracks(Track, courseId) {
        let tracks = await Track.find();
        //which track has this course
        tracks = tracks.map((elm) => {
            const res = elm.courses.map((course) => {
                return course.courseId == courseId;
            });
            for (const flag of res) {
                if (flag) {
                    return elm._id;
                }
            }
        });

        tracks.map(async (track) => {
            if (track) {
                const { courses } = await Track.findById(track);
                let CourseDocument = {};
                for (const elm of courses) {
                    if (elm.courseId == courseId) {
                        CourseDocument = elm;
                    }
                }
                const idxOfUserCourse = courses.indexOf(CourseDocument);
                courses.splice(idxOfUserCourse, 1);

                await Track.findOneAndUpdate(
                    track,
                    {
                        courses,
                    },
                    { returnOriginal: false }
                ).exec();
            }
        });
    }
}

module.exports = CourseService;
