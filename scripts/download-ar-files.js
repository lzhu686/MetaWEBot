const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const FILES_TO_DOWNLOAD = [
  {
    url: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/three.js/build/ar.js',
    path: 'public/libs/ar-js/build/ar.js'
  },
  {
    url: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
    path: 'public/libs/ar-js/data/camera_para.dat'
  },
  {
    url: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro',
    path: 'public/libs/ar-js/data/patterns/hiro.patt'
  },
  {
    url: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/HIRO.jpg',
    path: 'public/libs/ar-js/data/images/hiro.png'
  }
];

async function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        if (response.headers.location) {
          downloadFile(response.headers.location, filePath)
            .then(resolve)
            .catch(reject);
          return;
        }
      }

      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    const directories = [
      'public/libs/ar-js/build',
      'public/libs/ar-js/data',
      'public/libs/ar-js/data/patterns',
      'public/libs/ar-js/data/images'
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    }

    console.log('Starting downloads...');
    await Promise.all(FILES_TO_DOWNLOAD.map(file => 
      downloadFile(file.url, file.path)
        .catch(error => console.error(`Error downloading ${file.url}:`, error))
    ));

    console.log('All files downloaded successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 