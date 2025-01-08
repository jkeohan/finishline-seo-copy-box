// createRequire used to import meat.url
import { createSEOCopyBlockAPI } from './services/apiCalls.js';
import { buildSEOCopyBoxQuery } from './services/queries.js';
import { extractSEOCopyBoxData } from './utils/dataExtractors.js';
import { processCSV } from './utils/helpers.js';
import dotenv from 'dotenv'
dotenv.config()

const filePath =
	'/Users/jkeohan/Documents/github/finish-line/seo-copy-block/data/jd_copy_extraction.csv';

let seoCopyBoxArr = []
try {
	seoCopyBoxArr = (await processCSV(filePath)).slice(0,1)

} catch (error) {
	console.error('Error processing CSV:', error);
}

const delay = 750;
const createSEOCopyBox = async (data) => {
	// extract name, label, body, seoButtons
	let blogSEOCopyBoxData = extractSEOCopyBoxData(data);
	const seoCopyBoxQuery = buildSEOCopyBoxQuery(blogSEOCopyBoxData);

	await createSEOCopyBlockAPI(seoCopyBoxQuery);
};

const runQueue = async () => {
	if (seoCopyBoxArr.length) {
		const seoCopyBox = seoCopyBoxArr.pop();
		await createSEOCopyBox(seoCopyBox);

		setTimeout(() => {
			runQueue();
		}, delay);
	} else {
		console.timeEnd('Create Blogs');
	}
};

console.time('Create Blogs');
runQueue();
