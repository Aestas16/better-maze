let Submission = maze.model('submission');

async function judge(submission) {
    submission.status = 'Judging';
    await submission.save();

    // just for test
    submission.time = Math.floor((Math.random() * 1000) + 1);
    submission.memory = Math.floor((Math.random() * 524288) + 1);
    submission.step = Math.floor((Math.random() * 998244353) + 1);
    submission.status = 'Accepted';
    await submission.save();
    
}

module.exports = {
    judge
}