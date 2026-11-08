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
  const shop = await fetchPage('https://gift-store-rl7i-three.vercel.app/shop');
  console.log('Shop status:', shop.status);

  // Extract category buttons/filters in shop
  const catRegex = /<button[^>]*>([^<]+)<\/button>/gi;
  let match;
  const buttons = [];
  while ((match = catRegex.exec(shop.data)) !== null) {
    buttons.push(match[1].trim());
  }
  console.log('Shop buttons:', [...new Set(buttons)]);

  // Check categories routes
  const cats = ['men', 'women', 'occasions', 'custom', 'offers', 'kids', 'perfumes', 'watches'];
  for (const c of cats) {
    const res = await fetchPage(`https://gift-store-rl7i-three.vercel.app/category/${c}`);
    console.log(`/category/${c}:`, res.status);
  }
}

run();

