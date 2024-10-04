let Submission = maze.model('submission');

async function judge(submission) {
    submission.status = 'Judging';

    // just for test
    submission.time = Math.floor((Math.random() * 1000) + 1);
    submission.memory = Math.floor((Math.random() * 524288) + 1);
    submission.step = Math.floor((Math.random() * 998244353) + 1);
    submission.status = 'Accepted';

}

async function runjudger() {
    console.log('runjudger');
    while (true) {
        if (maze.judgequeue.length === 0) continue;
        await judge(maze.judgequeue[0]);
        maze.judgequeue.shift();
    }
}

module.exports = {
    runjudger
}