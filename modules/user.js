let User = maze.model('user');

app.get('/ranklist', async (req, res) => {
    try {
        let ranklist = await User.queryByOrder({ ['mazestep']: 'ASC' });
    
        res.render('ranklist', {
            ranklist: ranklist
        });
    } catch (e) {
        console.log(e);
        res.render('error', {
            err: e
        });
    }
});

app.get('/login', async (req, res) => {
    if (res.locals.user) {
        res.render('error', { err: '您已经登录了，请先注销。' });
    } else {
        res.render('login');
    }
});

app.get('/signup', async (req, res) => {
    if (res.locals.user) {
        res.render('error', { err: '您已经登录了，请先注销。' });
    } else {
        res.render('signup');
    }
});

app.post('/logout', async (req, res) => {
    req.session.user_id = null;
    res.clearCookie('login');
    res.redirect(req.query.url || '/');
});

function setLoginCookie(username, password, res) {
    res.cookie('login', JSON.stringify([username, password]), { maxAge: 10 * 365 * 24 * 60 * 60 * 1000 });
}

app.post('/api/login', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        let user = await User.findByName(req.body.username);
        if (!user) throw "用户不存在。";
        else if (user.password == null || user.password === '') throw "密码不允许为空。";
        else if (user.password !== req.body.password) throw "密码错误。";
        else {
            req.session.user_id = user.id;
            setLoginCookie(user.username, user.password, res);
            res.send({ err: null });
        }
    } catch (e) {
        console.log(e);
        res.send({ err: e });
    }
});

app.post('/api/sign_up', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        if (req.body.username.length === 0) throw "用户名不允许为空。";

        let user = await User.findByName(req.body.username);
        if (user) throw "用户名已存在。";

        let summersalt_md5 = 'fd04099cef078eb1e973b9ca0ccf1ba3';
        if (req.body.password === summersalt_md5) throw "密码不允许为空。";

        for (let ch of req.body.username) {
            if ((ch >= '0' && ch <= '9') || (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) continue;
            throw "用户名仅能由数字和大小写字母组成。"
        }

        user = await User.create({
            username: req.body.username,
            password: req.body.password,
            mazestep: 998244353
        });
        await user.save();

        req.session.user_id = user.id;
        setLoginCookie(user.username, user.password, res);

        res.send({ err: null });
    } catch (e) {
      console.log(e);
      res.send({ err: e });
    }
  });