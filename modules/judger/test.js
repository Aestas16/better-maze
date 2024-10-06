const exec = require('child_process').exec;

async function work(submission) {
    
    await new Promise(async (resolve, reject) => {
        // submission.status = 'Judging';
        // await submission.save();

        // fs.writeFile('player.cpp', submission.code, err => {
        //     if (err) console.error(err);
        //     resolve();
        // });
        resolve();
    }).then(() => {
        return new Promise(function (resolve, reject) {
            exec('docker run -itd --name judge-sandbox sandbox /bin/bash', (err, stdout, stderr) => {
                if (err) console.log(err);
                resolve();
            });
        });
    }).then(() => {
        return new Promise(function (resolve, reject) {
            exec('docker cp player.cpp judge-sandbox:/sandbox', (err, stdout, stderr) => {
                if (err) console.log(err);
                resolve();
            });
        });
    }).then(() => {
        return new Promise(async (resolve, reject) => {
            exec('docker exec judge-sandbox ./compiler', (err, stdout, stderr) => {
                if (err) console.log(err);
                if (stdout) {
                    console.log("Compile Error");
                    // exec('docker rm -f judge-sandbox', (err, stdout, stderr) => {
                    //     if (err) console.log(err);
                    // });
                    return ;
                }
                resolve();
            });
        });
    }).then(() => {
        return new Promise(async (resolve, reject) => {
            exec('docker exec judge-sandbox ./judger', (err, stdout, stderr) => {
                if (err) console.log(err);
                if (stdout) {
                    const result = JSON.parse(stdout);
                    console.log(result);
                    return ;
                }
            });
        });
    });
    // .finally(() => {
    //     return new Promise(function (resolve, reject) {
    //         exec('docker rm -f judge-sandbox', (err, stdout, stderr) => {
    //             if (err) console.log(err);
    //         });
    //     });
    // });
    // console.log(x);
    // console.log(y);
}

work();