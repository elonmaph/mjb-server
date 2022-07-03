var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var mongoose = require('mongoose');
import { faker } from '@faker-js/faker';
const jwt = require('jsonwebtoken');

const User = require('../../schema/userModel');
const { response, responseWithMsg, loginErr, bindErr, bindFailErr, accountExitsErr, neverbindErr, invaPasswordErr } = require('../../src/response');

function md5(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}


router.post('/signup', async function (req, res, next) {
    const {username, password} = req.body;
    var user = await User.findOne({ username }, { __v: 0 });
    if (user) {
        //用户已存在
        res.send(responseWithMsg(false, accountExitsErr));
    }
    else
    {
        //创建新用户
        const user = new User({
            username: username,
            password: md5(password),
            avatar: faker.image.avatar(),
            user_id: nanoid(8),
            create_time: Math.floor(Date.now() / 1000)
        });
        try {
            await user.save();

        } catch (error) {
            
        }
    }
});

/*
账号登录
*/
router.post('/signin', async function (req, res, next) {
    const { username, password } = req.body;
  
    var user = await User.findOne({ username }, { __v: 0 });
    if (user) {
      const validPassword = user.validPassword(password);
      if (validPassword) {
        try {
            await User.findByIdAndDelete(req.user.user_id);
            const token = jwt.sign({ user_id: user._id }, process.env.jwt_secret);
            user._doc.token = token;
            res.send(response(true, user));
          } catch (error) {
            res.send(responseWithMsg(false, loginErr));
          }
      }
      else {
        res.send(responseWithMsg(false, loginErr));
      }
    }
    else {
      res.send(responseWithMsg(false, loginErr));
    }
  });

  module.exports = router;