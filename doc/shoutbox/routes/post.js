const Entry = require('../lib/entry');

exports.get = (req, res) => {
    res.render('post', {
        title: 'Post'
    });
};

exports.post = (req, res, next) => {
    let data = req.body.entry;
    let entry = new Entry({
        'username': res.locals.username,
        'title': data.title,
        'body': data.body
    });
    entry.save(err => {
        if (err) throw next(err);
        res.redirect('/');
    });
};