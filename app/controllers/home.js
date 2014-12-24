/**
 * Created by wmzy on 14-12-5.
 */
exports.index = function (req, res) {
    res.render('home/index', {user: req.user});
};
