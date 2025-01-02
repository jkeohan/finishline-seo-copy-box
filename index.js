// createRequire used to import meat.url
import { createRequire } from 'module';
import { createSEOCopyBlockAPI } from './services/apiCalls.js';
import { buildSEOCopyBoxQuery } from './services/queries.js';
import { extractSEOCopyBoxData } from './utils/dataExtractors.js';
import { processCSV} from './utils/helpers.js';

const filePath =
	'/Users/jkeohan/Documents/github/finish-line/seo-copy-block/data/jd_copy_extraction.csv';

let seoCopyBoxArr = []
try {
	seoCopyBoxArr = (await processCSV(filePath)).slice(0,1)
	console.log('seoCopyBoxArr', seoCopyBoxArr.length)

} catch (error) {
	console.error('Error processing CSV:', error);
}

const delay = 750;
const createSEOCopyBox = async (data) => {
	console.log(seoCopyBoxArr);
	// data = {address: '', extractor1: ''}
	let blogSEOCopyBoxData = extractSEOCopyBoxData(data);
	// blogSEOCopyBoxData = { name: '', label: '', body, seoButtons}
	console.log({ blogSEOCopyBoxData });

	const seoCopyBoxQuery = buildSEOCopyBoxQuery(blogSEOCopyBoxData);
	// console.log({ seoCopyBoxQuery });

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
