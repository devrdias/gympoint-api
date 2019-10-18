// generate secret md5 from https://www.md5hashgenerator.com/
export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
