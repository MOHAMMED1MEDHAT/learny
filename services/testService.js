exports.deleteTestFromTracks = async (Track, testId) => {
    try {
        const tracksWithThisTest = await Track.find({ testId });

        tracksWithThisTest.map(async (track) => {
            await Track.updateOneById(track._id, {
                testId: "",
            });
        });
    } catch (err) {
        throw new Error("error while deleting test from tracks");
    }
};
