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
