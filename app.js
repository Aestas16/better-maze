const express = require('express');
const fs = require('fs')
const bodyParser = require('body-parser');
const TypeORM = require('typeorm');
const Session = require('express-session');

require('reflect-metadata')

global.maze = {
    models: [],
    modules: [],
    judgequeue: [],
    model(name) {
        return require(`./models-built/${name}`).default;
    },
    async run() {
        global.app = express();

        app.set('view engine', 'ejs');

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use(require('cookie-parser')());

        app.use((req, res, next) => {
            res.locals.active = req.path.split('/')[1];
            res.locals.req = req;
            res.locals.res = res;
            next();
        });

        app.use(Session({
            secret: 'GirlsBandCry',
            cookie: { httpOnly: false },
            rolling: true,
            saveUninitialized: true,
            resave: true
        }));

        app.use((req, res, next) => {
            let User = maze.model('user');
            if (req.session.user_id) {
                User.findById(req.session.user_id).then((user) => {
                    res.locals.user = user;
                    next();
                }).catch((err) => {
                    console.log(err);
                    res.locals.user = null;
                    req.session.user_id = null;
                    next();
                });
            } else {
                if (req.cookies.login) {
                    try {
                        let obj = JSON.parse(req.cookies.login);
                        User.findOne({
                            where: {
                                username: String(obj[0]),
                                password: String(obj[1])
                            }
                        }).then(user => {
                            if (!user) throw "查询用户时发生错误。";
                            res.locals.user = user;
                            req.session.user_id = user.id;
                            next();
                        }).catch(err => {
                            console.log(err);
                            res.locals.user = null;
                            req.session.user_id = null;
                            next();
                        });
                    } catch (e) {
                        res.locals.user = null;
                        req.session.user_id = null;
                        next();
                    }
                } else {
                    res.locals.user = null;
                    req.session.user_id = null;
                    next();
                }
            }
        });

        fs.readdir('./modules/', (err, files) => {
            if (err) {
                console.log(err);
                return;
            }
            files.filter((file) => file.endsWith('.js'))
                .forEach((file) => this.modules.push(require(`./modules/${file}`)));
        });

        await this.connect();

        var server = app.listen(8081, () => {
            console.log('Server is listening on port 8081.');
        });
    },
    async connect() {
        global.TypeORM = TypeORM;

        const models = fs.readdirSync('./models/')
                         .filter(filename => filename.endsWith('.ts') && filename !== 'common.ts')
                         .map(filename => require('./models-built/' + filename.replace('.ts', '.js')).default);
        
        await TypeORM.createConnection({
            type: 'mariadb',
            host: '127.0.0.1',
            port: 3306,
            username: 'aestas16',
            password: '',
            database: 'maze',
            entities: models,
            synchronize: true,
            extra: { connectionLimit: 50 }
        });
    }
};

maze.run();