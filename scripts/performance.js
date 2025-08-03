const puppeteer = require('puppeteer');

async function testPagePerformance(url, pageName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Track resource loading
  const resources = [];
  page.on('response', response => {
    resources.push({
      url: response.url(),
      status: response.status(),
      size: response.headers()['content-length'] || 0,
      type: response.headers()['content-type'] || 'unknown'
    });
  });

  const startTime = Date.now();
  
  try {
    // Navigate and wait for network idle
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Get performance metrics
    const metrics = await page.metrics();
    const loadTime = Date.now() - startTime;

    // Get paint metrics
    const paintMetrics = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('paint');
      const result = {};
      perfEntries.forEach(entry => {
        result[entry.name] = entry.startTime;
      });
      return result;
    });

    console.log(`\n=== ${pageName} ===`);
    console.log(`Total Load Time: ${loadTime}ms`);
    console.log(`First Paint: ${paintMetrics['first-paint'] || 'N/A'}ms`);
    console.log(`First Contentful Paint: ${paintMetrics['first-contentful-paint'] || 'N/A'}ms`);
    console.log(`DOM Nodes: ${metrics.Nodes}`);
    console.log(`JS Heap Used: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)}MB`);
    
    // Count resources by type
    const resourceTypes = {};
    resources.forEach(resource => {
      const type = resource.type.split('/')[0] || 'other';
      resourceTypes[type] = (resourceTypes[type] || 0) + 1;
    });
    
    console.log(`Resources loaded: ${resources.length}`);
    console.log(`Resource breakdown:`, resourceTypes);

  } catch (error) {
    console.error(`Error testing ${pageName}:`, error.message);
  }

  await browser.close();
}

async function runTests() {
  console.log('🚀 Testing Performance Improvements...\n');
  
  const pages = [
    { url: 'http://localhost:8080/', name: 'Home Page' },
    { url: 'http://localhost:8080/about/', name: 'About Page' },
    { url: 'http://localhost:8080/blog/', name: 'Blog Index' },
    { url: 'http://localhost:8080/blog/building-agents/', name: 'Building Agents (Heavy)' }
  ];
  

  for (const page of pages) {
    await testPagePerformance(page.url, page.name);
  }
}

runTests().catch(console.error);
