judgequeue = [1, 2, 3, 4, 5, 6]

async function runjudger() {
    while (true) {
        if (judgequeue.length === 0) continue;
        await dosomething(judgequeue[0]);
        judgequeue.shift();
    }
}

runjudger();