const { notion, checkAuth, getDatabaseId, getTime } = require('../../utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Not supported method');
  }

  if (!checkAuth(req.headers)) {
    res.status(401).send('NO AUTH');
  }

  const parsedResponse = JSON.parse(req.body);

  const response = await notion.pages.create({
    parent: {
      database_id: getDatabaseId(),
    },
    properties: {
      ID: {
        title: [
          {
            type: 'text',
            text: {
              content: parsedResponse.nextId.toString(),
            },
          },
        ],
      },
      Date: {
        date: { start: parsedResponse.date },
      },
      Time: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: getTime(parsedResponse.time),
            },
          },
        ],
      },
      SPM: {
        number: parseFloat(parsedResponse.spm),
      },
      Distance: {
        number: parseFloat(parsedResponse.distance),
      },
      'Total Strokes': {
        number: parseFloat(parsedResponse.totalStrokes),
      },
      Calories: {
        number: parseFloat(parsedResponse.calories),
      },
      Recovery: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: parsedResponse.recovery,
            },
          },
        ],
      },
    },
  });

  res.json(response);
};
