app.get('/', async (req, res) => {
    try {
        res.render('index');
    } catch (e) {
        console.log(e);
        res.render('error', {
            err: e
        });
    }
});