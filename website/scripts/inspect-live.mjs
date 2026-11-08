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
  const home = await fetchPage('https://gift-store-rl7i-three.vercel.app/');
  console.log('Homepage status:', home.status);
  
  // Extract all src from img
  const imgSrcs = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(home.data)) !== null) {
    imgSrcs.push(match[1]);
  }
  console.log('Found images:', imgSrcs.length);
  console.log('Sample images:', imgSrcs.slice(0, 10));

  // Check link anchors
  const linkHrefs = [];
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  while ((match = linkRegex.exec(home.data)) !== null) {
    linkHrefs.push(match[1]);
  }
  console.log('Found links:', linkHrefs.length);
  const uniqueLinks = [...new Set(linkHrefs)];
  console.log('Unique links:', uniqueLinks);
}

run();

