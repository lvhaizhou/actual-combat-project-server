/*
 * @Author: Lvhz
 * @Date: 2021-08-12 14:36:26
 * @Description: 用户类
 */
'use strict';
const md5 = require('md5');
const BaseController = require('./base');

const HashSalt = ':DylanLV@sAult~';
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  password: { type: 'string' },
  captcha: { type: 'string' },
};

class UserController extends BaseController {
  async login() {

  }
  async register() {
    const { ctx } = this;
    try {
      // 校验传递的参数：这里只做了简单的类型校验
      ctx.validate(createRule);
    } catch (e) {
      return this.error('参数校验失败', 500, e.errors);
    }

    const { email, password, captcha, nickname } = ctx.request.body;

    // 校验验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) return this.error('验证码错误');
    // 邮箱是否重复
    if (await this.checkEmail(email)) return this.error('邮箱重复啦');

    const res = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password + HashSalt), // 加盐加密
    });
    if (res._id) return this.message('注册成功');
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  async verify() {
    // 校验用户名是否存在
  }
  async info() {

  }
}
module.exports = UserController;
