let Submission = maze.model('submission');
const bodyParser = require('body-parser');
let Judger = require('./judger/judger.js')
let asyncLock = require('async-lock');
let locks = new asyncLock();

function formatDate(time) {
    let cur = new Date(time * 1000);
    let DD = String(cur.getDate()).padStart(2, '0');
    let MM = String(cur.getMonth() + 1).padStart(2, '0');
    let yyyy = cur.getFullYear();
    let hh =  String(cur.getHours()).padStart(2, '0');
    let mm = String(cur.getMinutes()).padStart(2, '0');
    let ss = String(cur.getSeconds()).padStart(2, '0');
    return yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
}

function formatStatus(status) {
    if (status === 'Accepted') return '<span class="status accepted"><i class="checkmark icon"></i> <b>Accepted</b></span>';
    if (status === 'Invalid Interaction') return '<span class="status wrong_answer"><i class="remove icon"></i> <b>Invalid Interaction</b></span>';
    if (status === 'Compile Error') return '<span class="status compile_error"><i class="code icon"></i> <b>Compile Error</b></span>';
    if (status === 'Runtime Error') return '<span class="status runtime_error"><i class="bomb icon"></i> <b>Runtime Error</b></span>';
    if (status === 'Waiting') return '<span class="status waiting"><i class="icon hourglass half"></i> <b>Waiting</b></span>';
    if (status === 'Judging') return '<span class="status judging"><i class="icon spinner"></i> <b>Judging</b></span>';
    if (status === 'Memory Limit Exceeded') return '<span class="status memory_limit_exceeded"><i class="microchip icon"></i> <b>Memory Limit Exceeded</b></span>';
    if (status === 'Time Limit Exceeded') return '<span class="status time_limit_exceeded"><i class="clock icon"></i> <b>Time Limit Exceeded</b></span>';
}

app.get('/submissions', async (req, res) => {
    try {
        if (!res.locals.user) throw '请登录后继续。';

        let submissions = await Submission.queryWhere({ user_id: res.locals.user.id }, { id: 'DESC' });

        for (let submission of submissions) {
            submission.format_time = formatDate(submission.submit_time);
            submission.format_status = formatStatus(submission.status);
        }

        res.render('submissions', {
            submissions: submissions
        });
    } catch (e) {
        console.log(e);
        res.render('error', {
          err: e
        });
    }
});

app.post('/submit', bodyParser.json(), async (req, res) => {
    try {
        if (!res.locals.user) throw '请登录后继续。';
    
        let code;
      
        if (Buffer.from(req.body.code).length > 102400) throw '代码太长。';
        code = req.body.code;
  
        let submission = await Submission.create({
            submit_time: parseInt((new Date()).getTime() / 1000),
            status: 'Waiting',
            code: code,
            code_length: Buffer.from(code).length,
            user_id: res.locals.user.id
        });
        await submission.save();

        await locks.acquire('submit', async () => { await Judger.judge(submission); });
  
        res.redirect('/submissions');
    } catch (e) {
        console.log(e);
        res.render('error', {
            err: e
        });
    }
});