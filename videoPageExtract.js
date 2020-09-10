const puppeteer = require('puppeteer');
require('dotenv').config();

const config = {
	headless: process.env.HEADLESS === 'true' ? true : false,
	slowMo: +process.env.SLOWMO,
	args: process.env.ARGS.split(','),
};
//console.log('Now the process.env values are:', config);

const videoLinkFinder = async (videoURL) => {
	console.log('[in videoLinkFinder]');
	const topic = videoURL.split('/').reverse()[1];
	const browser = await puppeteer.launch(config);
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)Chrome/60.0.3112.113 Safari/537.36');

	//await page.on('response', (r) => console.log(r.remoteAddress()));
	await page.setViewport({ width: 1366, height: 720 });
	await page.goto(process.env.RESOURCE_LOGIN_URL, {
		waitUntil: 'load',
		timeout: 5000000,
	});
	await page.waitFor(2000);
	console.log('PASSWORD && USER_EMAIL', process.env.USER_PASSWORD, process.env.USER_EMAIL);
	await page.type('input[name="email"]', process.env.USER_EMAIL);
	await page.type('input[name="password"]', process.env.USER_PASSWORD);
	const signInBtn = await page.$x("//form[@data-newrelic-id='authForm']//button[contains(text(), 'Sign In')]");
	console.log('sign in Btn button found on page', signInBtn.length);
	if (signInBtn.length > 0) {
		await signInBtn[0].click();
	}
	await page.waitFor(2000);
	await page.goto(videoURL, {
		waitUntil: 'load',
		timeout: 6000000,
	});
	await page.waitFor(2000);

	const selector = 'a';
	await page.waitForSelector(selector);
	const links = await page.$$eval(selector, (am) => am.filter((e) => e.href).map((e) => e.href));
	let filteredLinks = links.filter((e) => {
		if (e.includes(topic)) {
			return e;
		}
	});
	await browser.close();
	console.log('[videoLinkFinder] Link found====', filteredLinks.length);
	return {
		linkArr: filteredLinks.slice(1, filteredLinks.length),
		topic: topic,
	};
	//return filteredLinks.slice(filteredLinks.length - 2, filteredLinks.length);
};
module.exports = { videoLinkFinder };
