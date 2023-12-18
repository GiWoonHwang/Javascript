const { authenticator, totp, hotp  } = require('otplib')
const qrcode = require('qrcode')

class Otp {

    constructor () {
    this.user              = ''
    this.service           = 'Cy Wallet'
    this.qrcodeGenerateUrl = 'https://ko.qr-code-generator.com/'
  }

  generateSeceret () { // 시크릿 키 만듬
    const s = authenticator.generateSecret();
    return s
  }

  otpauth (email,service,secret) {
    const o = authenticator.keyuri(email, this.service, secret);
    return o
  }

  convertQrcode (otpauth) {
    const qr = qrcode.toDataURL(otpauth);
    return qr
  }

  verify (token,secret) {
    const isValid = authenticator.verify({ token, secret });
    return isValid
  }

};

module.exports =  Otp;
