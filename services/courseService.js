const Course = require("../models/coursesModel");
const Track = require("../models/trackModel");

exports.subscripe = async (userId, courseId) => {
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

exports.unsubscripe = async (userId, courseId) => {
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

//FIXME:REFACTOR THIS
// exports.deleteCourseFromAllTracks = async ({ courseId }) => {
//     let tracks = await Track.find();
    
//     //which track has this course
//     tracks = tracks.map((elm) => {
//         const res = elm.courses.map((course) => {
//             return course.courseId == courseId;
//         });
//         for (const flag of res) {
//             if (flag) {
//                 return elm._id;
//             }
//         }
//     });

//     tracks.map(async (track) => {
//         if (track) {
//             const { courses } = await Track.findById(track);
//             let CourseDocument = {};
//             for (const elm of courses) {
//                 if (elm.courseId == courseId) {
//                     CourseDocument = elm;
//                 }
//             }
//             const idxOfUserCourse = courses.indexOf(CourseDocument);
//             courses.splice(idxOfUserCourse, 1);

//             await Track.findOneAndUpdate(
//                 track,
//                 {
//                     courses,
//                 },
//                 { returnOriginal: false }
//             ).exec();
//         }
//     });
// };
