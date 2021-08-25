const { notion, checkAuth, getDatabaseId } = require('../../utils');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send('Not supported method');
  }

  if (!checkAuth(req.headers)) {
    res.status(401).send('NO AUTH');
  }

  const { results: pages } = await notion.databases.query({
    database_id: getDatabaseId(),
    sorts: [
      {
        property: 'Date',
        direction: 'ascending',
      },
    ],
  });

  const results = pages.map((page) => {
    const result = {
      pid: page.id,
      rid: page.properties['ID']?.title[0]?.plain_text ?? -1,
      date: page.properties['Date']?.date?.start ?? -1,
      time: page.properties['Time']?.rich_text[0]?.plain_text ?? -1,
      spm: page.properties['SPM']?.number ?? -1,
      distance: page.properties['Distance']?.number ?? -1,
      totalStrokes: page.properties['Total Strokes']?.number ?? -1,
      calories: page.properties['Calories']?.number ?? -1,
      recovery: page.properties['Recovery']?.rich_text[0]?.plain_text ?? -1,
    };
    return result;
  });

  res.json(results);
};
