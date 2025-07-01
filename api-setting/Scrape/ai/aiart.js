const ws = require('ws');

async function aiart(prompt, style = 'Anime') {
  return new Promise((resolve, reject) => {
    const styles = ['Anime', 'Realistic'];
    if (!prompt) return reject(new Error('Parameter prompt wajib diisi'));
    if (!styles.includes(style)) return reject(new Error(`Style tersedia: ${styles.join(', ')}`));

    const session_hash = Math.random().toString(36).substring(2);
    const socket = new ws('wss://app.yimeta.ai/ai-art-generator/queue/join');

    socket.on('message', (data) => {
      const d = JSON.parse(data.toString('utf8'));

      switch (d.msg) {
        case 'send_hash':
          socket.send(JSON.stringify({ fn_index: 31, session_hash }));
          break;

        case 'send_data':
          socket.send(JSON.stringify({
            fn_index: 31,
            session_hash,
            data: [
              style,
              prompt,
              `(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres , username, blurry, trademark, watermark, title, multiple view, Reference sheet, curvy, plump, fat, strabismus, clothing cutout, side slit,worst hand, (ugly face:1.2), extra leg, extra arm, bad foot, text, name`,
              7,
              ''
            ]
          }));
          break;

        case 'process_completed':
          socket.close();
          resolve(d.output.data[0][0].name);
          break;

        default:
          break;
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = aiart;
