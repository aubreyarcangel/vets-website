const getDrupalClient = require('./api');
const cheerio = require('cheerio');
const { PUBLIC_URLS } = require('../../../constants/drupals');

function replacePathInData(data, replacer) {
  let current = data;
  if (Array.isArray(data)) {
    // This means we're always creating a shallow copy of arrays, but
    // that seems worth the complexity trade-off
    current = data.map(item => replacePathInData(item, replacer));
  } else if (!!current && typeof current === 'object') {
    Object.keys(current).forEach(key => {
      let newValue = current;

      if (typeof current[key] === 'string') {
        newValue = replacer(current[key], key);
      } else {
        newValue = replacePathInData(current[key], replacer);
      }

      if (newValue !== current[key]) {
        current = Object.assign({}, current, {
          [key]: newValue,
        });
      }
    });
  }

  return current;
}

function convertAssetPath(url) {
  // After this path are other folders in the image paths,
  // but it's hard to tell if we can strip them, so I'm leaving them alone
  const withoutHost = url.replace(/^.*\/sites\/.*\/files\//, '');
  const path = withoutHost.split('?', 2)[0];

  // This is sort of naive, but we'd like to have images in the img folder
  if (
    ['png', 'jpg', 'jpeg', 'gif', 'svg'].some(ext =>
      path.toLowerCase().endsWith(ext),
    )
  ) {
    return `/img/${path}`;
  }

  return `/files/${path}`;
}

// @todo Explain _why_ this function is needed.
function updateAttr(attr, doc, client) {
  const assetsToDownload = [];
  const usingAWS = !!PUBLIC_URLS[client.getSiteUri()];

  doc(`[${attr}*="cms.va.gov/sites"]`).each((i, el) => {
    const item = doc(el);
    const srcAttr = item.attr(attr);

    const siteURI = srcAttr.match(
      /https?:\/\/([a-zA-Z0-9]+[.])*cms[.]va[.]gov/,
    )[0];
    // *.ci.cms.va.gov ENVs don't have AWS URLs.
    const newAssetPath = convertAssetPath(srcAttr);
    const awsURI = usingAWS
      ? Object.entries(PUBLIC_URLS).find(entry => entry[1] === siteURI)[0]
      : null;

    assetsToDownload.push({
      // URLs in WYSIWYG content won't be the AWS URLs, they'll be CMS URLs.
      // This means we need to replace them with the AWS URLs if we're on Jenkins.
      src: usingAWS ? srcAttr.replace(siteURI, awsURI) : srcAttr,
      dest: newAssetPath,
    });

    item.attr(attr, newAssetPath);
  });

  return assetsToDownload;
}

function convertDrupalFilesToLocal(drupalData, files, options) {
  const client = getDrupalClient(options);

  return replacePathInData(drupalData, (data, key) => {
    if (data.match(/^.*\/sites\/.*\/files\//)) {
      const newPath = convertAssetPath(data);
      const decodedFileName = decodeURIComponent(newPath).substring(1);
      // eslint-disable-next-line no-param-reassign
      files[decodedFileName] = {
        path: decodedFileName,
        source: data,
        isDrupalAsset: true,
        contents: '',
      };

      return newPath;
    }

    if (key === 'processed') {
      const doc = cheerio.load(data);
      const assetsToDownload = [
        ...updateAttr('href', doc, client),
        ...updateAttr('src', doc, client),
      ];

      if (assetsToDownload.length) {
        assetsToDownload.forEach(({ src, dest }) => {
          const decodedFileName = decodeURIComponent(dest).substring(1);
          // eslint-disable-next-line no-param-reassign
          files[decodedFileName] = {
            path: decodedFileName,
            source: src,
            isDrupalAsset: true,
            contents: '',
          };
        });
      }

      return doc.html();
    }

    return data;
  });
}

module.exports = convertDrupalFilesToLocal;
