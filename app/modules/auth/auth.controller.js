export default {
  login: (req, res, next) => {
    User.findOne({username: new RegExp('^' + req.body.username + '$', "i")}, function (err, user) {
      if (err) return res.status(500).send({message: 'Server error'});
      if (!user) return res.status(404).send({message: 'User not found.'});
      if (!user.password) return res.status(401).send({auth: false, message: 'Invalid password or username'});

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({auth: false, message: 'Invalid password or username'});

      const {accessToken, refreshToken, expiresIn} = createTokens(user);

      user.refreshToken = refreshToken;
      user.logins.push({
        date: Date.now()
      });
      user.save(function () {
        User.findOne({_id: user._id}, {password: 0})
          .populate({
            path: 'company',
            populate: {
              path: 'modules'
            }
          })
          .exec(function (err, userUpdated) {
            res.status(200).send({auth: true, user: userUpdated, accessToken, refreshToken, expiresIn});
          })
      });
    });
  },

  refreshToken: (req, res, next) => {
    const token = req.headers['x-token-jwt'];
    if (!token) return res.status(403).send({auth: false, error: 'Unauthorized'});
    const refreshToken = req.body.refreshToken;

    jwt.verify(refreshToken, config.secretRefresh, function (err, decoded) {
      if (err && err.name === 'TokenExpiredError')
        return res.status(401).send({auth: false, error: 'Expired refresh token'});
      if (err)
        return res.status(500).send({auth: false, error: 'Failed to authenticate refresh token.'});

      const userId = decoded.userId;
      User.findOne({_id: userId}, {password: 0}).exec(function (err, user) {
        if (err) return res.status(404).send({message: 'User not found.'});
        //todo Need to handle different devices
        // if (user.refreshToken === refreshToken) {
        const {accessToken, refreshToken, expiresIn} = createTokens(user);
        user.refreshToken = refreshToken;
        user.save();
        res.status(200).send({accessToken, refreshToken, expiresIn});
        next();
        // } else res.status(403).send({ auth: false, error: 'Failed to authenticate refresh token.' });
      })
    });
  },

  logout: (req, res) => {
    res.json({logout: true});
  }
}
