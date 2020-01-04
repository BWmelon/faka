const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose =require('mongoose')
const Login = mongoose.model('admin')
const keys = require('./keys')


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.serectOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        Login.findById(jwt_payload.id)
            .then(data => {
                if(data) {
                    return done(null, data);
                }

                return done(null, false)
            })
            .catch(err => console.log(err))
    }));
}