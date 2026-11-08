import https from 'https';

async function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (e) => resolve({ status: 0, error: e.message }));
  });
}

async function run() {
  const prod = await fetchPage('https://gift-store-rl7i-three.vercel.app/product/cmtgz4spc0008k1qj63fp7w5o');
  console.log('Product page status:', prod.status);
  
  // Find title and price
  const titleMatch = prod.data.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log('Product title:', titleMatch ? titleMatch[1] : 'Not found');
  
  // Find broken images
  const imgSrcs = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(prod.data)) !== null) {
    imgSrcs.push(match[1]);
  }
  console.log('Product images count:', imgSrcs.length);
  console.log('Images:', imgSrcs);
}

run();

