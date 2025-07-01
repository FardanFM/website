const axios = require('axios');

async function ytmp3plus(url, format = 'mp3') {
  const id = (url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/) || [])[1];
  if (!id) throw new Error('❌ URL YouTube tidak valid');

  const headers = {
    referer: 'https://id.ytmp3.plus/'
  };
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  try {
    const init = await axios.get('https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=' + Math.random(), { headers });
    const cu = init.data?.convertURL;
    if (!cu) throw new Error('❌ Gagal ambil convertURL');

    const convert = await axios.get(`${cu}&v=${id}&f=${format}&_=` + Math.random(), { headers });
    const { downloadURL, progressURL } = convert.data;
    if (!downloadURL) throw new Error('❌ Link download tidak ditemukan');

    for (let x = 0; x < 10; x++) {
      try {
        const r = await axios.get(downloadURL, {
          headers,
          responseType: 'stream',
          maxContentLength: 1
        });
        if (r.status === 200) break;
      } catch {}
      await sleep(3000);
    }

    const meta = await axios.get(progressURL, { headers });
    return {
      title: meta.data?.title || 'unknown',
      format,
      downloadURL
    };
  } catch (e) {
    const err = e.response?.data || e.message;
    throw new Error(typeof err === 'string' ? err : JSON.stringify(err));
  }
}

module.exports = ytmp3plus;
