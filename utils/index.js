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

const getDatabaseId = () => {
  return process.env.NODE_ENV === 'production' ? process.env.NOTION_DB_ID : process.env.NOTION_DB_ID_TEST;
};

const getTime = (time) => {
  const timeParts = time.split(':');

  if (timeParts.length === 2) {
    return `${timeParts[1]}:00`;
  }

  if (timeParts.length === 3) {
    return `${timeParts[1]}:${timeParts[2]}`;
  }

  return '00:00';
};

module.exports = {
  notion,
  checkAuth,
  getDatabaseId,
  getTime,
};
