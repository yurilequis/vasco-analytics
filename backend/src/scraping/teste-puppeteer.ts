import puppeteer from 'puppeteer';

async function teste() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled', // esconde que é bot
    ],
  });

  const page = await browser.newPage();

  // Remove a flag que identifica o Puppeteer como bot
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  );

  console.log('Tentando acessar Flashscore...');

  await page.goto(
    'https://www.flashscore.com.br/equipe/vasco/2RABlYFn/resultados/',
    { waitUntil: 'domcontentloaded', timeout: 30000 },
  );

  console.log('Título:', await page.title());

  // Aguarda 3 segundos para o JS carregar
  await new Promise((r) => setTimeout(r, 3000));

  const total = await page
    .$$eval('.event__match', (els) => els.length)
    .catch(() => 0);

  console.log(`Partidas encontradas: ${total}`);

  await browser.close();
}

teste();
