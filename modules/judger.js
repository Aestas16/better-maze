const exec = require('child_process').exec;
const fs = require('fs');
// const TypeORM = require('typeorm');
// require('reflect-metadata')

async function judge(submission, user) {
    console.log("judge start");
    return await new Promise(async (resolve, reject) => {
        console.log("write code");
        submission.status = 'Judging';
        await submission.save();

        fs.writeFile('player.cpp', submission.code, err => {
            if (err) console.error(err);
            resolve();
        });
        // resolve();
    }).then(() => {
        console.log("run docker");
        return new Promise((resolve, reject) => {
            exec('docker run -itd --name judge-sandbox sandbox /bin/bash', async (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    submission.status = 'System Error';
                    await submission.save();
                    reject();
                } else resolve();
            });
        });
    }).then(() => {
        console.log("copy code");
        return new Promise((resolve, reject) => {
            exec('docker cp player.cpp judge-sandbox:/sandbox', async (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    submission.status = 'System Error';
                    await submission.save();
                    exec('docker rm -f judge-sandbox', (err, stdout, stderr) => {
                        if (err) console.log(err);
                        reject();
                    });
                } else resolve();
            });
        });
    }).then(() => {
        console.log("compile code");
        return new Promise((resolve, reject) => {
            exec('docker exec judge-sandbox ./compiler', async (err, stdout, stderr) => {
                if (err) console.log(err);
                if (stdout) {
                    console.log(stdout);
                    submission.status = 'Compile Error';
                    await submission.save();
                    exec('docker rm -f judge-sandbox', (err, stdout, stderr) => {
                        if (err) console.log(err);
                        reject();
                    });
                } else resolve();
            });
        });
    }).then(() => {
        console.log("run code");
        return new Promise((resolve, reject) => {
            exec('docker exec judge-sandbox ./judger', async (err, stdout, stderr) => {
                console.log(stdout);
                if (err) {
                    console.log(err);
                    submission.status = 'System Error';
                    await submission.save();
                    exec('docker rm -f judge-sandbox', (err, stdout, stderr) => {
                        if (err) console.log(err);
                        reject();
                    });
                } else if (stdout) {
                    const result = JSON.parse(stdout);
                    // console.log(result);
                    submission.status = result.status;
                    submission.time = result.time;
                    submission.memory = result.memory;
                    if (result.step) {
                        submission.step = result.step;
                        if (result.step < user.mazestep) {
                            user.mazestep = result.step;
                            await user.save();
                        }
                    }
                    await submission.save();
                    resolve();
                } else resolve();
            });
        });
    }).then(() => {
        console.log("remove docker");
        return new Promise((resolve, reject) => {
            exec('docker rm -f judge-sandbox', (err, stdout, stderr) => {
                if (err) console.log(err);
                resolve();
            });
        });
    }).catch(() => {});

    // just for test
    // submission.time = Math.floor((Math.random() * 1000) + 1);
    // submission.memory = Math.floor((Math.random() * 524288) + 1);
    // submission.step = Math.floor((Math.random() * 998244353) + 1);
    // submission.status = 'Accepted';
    // await submission.save();
}

module.exports = {
    judge
}