exports.subscripe = async ({ UserTrack, userId, trackId }) => {
    //NOTE: if user never subscriped
    const userSubscripedCoursesBefore = await UserTrack.findOne({
        userId,
    }).exec();

    const tracksOfUser = {
        trackId,
        passed: false,
    };

    if (!userSubscripedCoursesBefore) {
        UserTrack.create({
            userId,
            tracks: [tracksOfUser],
        });
    } else {
        const { tracks } = await UserTrack.findOne({ userId }).exec();

        tracks.push(tracksOfUser);

        const userTrack = await UserTrack.findOneAndUpdate(
            { userId },
            {
                tracks,
            },
            { returnOriginal: false }
        ).exec();
    }
};

exports.unsubscripe = async ({ UserTrack, userId, trackId }) => {
    const { tracks } = await UserTrack.findOne({ userId }).exec();
    let userTrackDocument = {};
    for (const elm of tracks) {
        if (elm.trackId == trackId) {
            userTrackDocument = elm;
        }
    }
    const idxOfUserTrack = tracks.indexOf(userTrackDocument);
    tracks.splice(idxOfUserTrack, 1);

    const userTrack = await UserTrack.findOneAndUpdate(
        { userId },
        {
            tracks,
        },
        { returnOriginal: false }
    ).exec();

    return userTrack;
};

exports.updateTrackPassedState = async ({
    UserTrack,
    userId,
    trackId,
    isPassed,
}) => {
    const userTrack = await UserTrack.findOne({ userId }).exec();

    const { tracks } = userTrack;

    for (const track of tracks) {
        if (track.trackId == trackId) {
            track.passed = isPassed;
            // console.log("track.passed", track.passed);
        }
    }
    await UserTrack.findOneAndUpdate({ userId }, { tracks }).exec();
};
