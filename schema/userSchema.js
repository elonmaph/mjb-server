var mongoose = require('mongoose');
const crypto = require('crypto');
const { nanoid } = require('nanoid')

var userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            default:''
        },
        password: {
            type: String,
        },
        avatar: {
            type: String
        },
        user_id: {
            type: String,
            default: nanoid(8)
        },
        create_time: {
            type: Number,
        }
    }
);

userSchema.methods.pswMd5 = function (password) {
    return md5(password);
};

userSchema.methods.validPassword = function (password) {
    return md5(password) == this.password;
};

function md5(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

module.exports = userSchema;
