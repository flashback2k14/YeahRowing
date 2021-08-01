const { Client } = require('@notionhq/client');

require('dotenv').config();
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

const checkAuth = (headers) => {
  if ('authorization' in headers) {
    const authHeader = headers['authorization'];
    const base64UserCred = authHeader.split(' ')[1];
    const userCred = Buffer.from(base64UserCred, 'base64').toString();
    const username = userCred.split(':')[0];
    const pw = userCred.split(':')[1];
    return username === process.env.CRED_USERNAME && pw === process.env.CRED_PW;
  }

  return false;
};

module.exports.notion = notion;
module.exports.checkAuth = checkAuth;
