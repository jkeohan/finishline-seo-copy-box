import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'logs.log');
const csvFilePath = path.join(__dirname, '../data/jd_copy_extraction.csv');

export const writeLog = (message) => {
	const timestamp = new Date().toISOString();
	const logMessage = `[${timestamp}] ${message}\n`;

	fs.appendFile(logFilePath, logMessage, (err) => {
		if (err) {
			console.error('Error writing to log file:', err);
		} else {
			console.log('Log written successfully.');
		}
	});
};

export const processCSV = async (filePath) => {
	return new Promise((resolve, reject) => {
		const result = [];
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (row) => {
				if (row['Extractor 1 1']) {
					const name = extractName(row['Address']);
					result.push({
						address: name,
						extractor1: row['Extractor 1 1'],
						extractor2: row['Extractor 2 1'],
					});
				}
			})
			.on('end', () => {
				return resolve(result);
			})
			.on('error', (error) => {
				return reject(error);
			});
	});
};

export const getSeoCopyBoxArr = async () => {
	try {
		const data = await processCSV('../data/jd_copy_extraction.csv');
		console.log('seoCopyBoxArr:', data);
		return data;
	} catch (error) {
		console.error('Error processing CSV:', error);
		return [];
	}
};


function extractName(url) {
  const regexWithN = /store\/(.*?)\/_(?=.*_N)/; // Matches everything after store/ up to /_ if _N exists
  const regexWithoutN = /store\/(.*)/;         // Matches everything after store/ if _N does not exist
  const regexGeneric = /https?:\/\/[^\/]+\/(.*)/; // Matches everything after the domain for generic cases

  // Check if _N exists in the URL
  if (/_N/.test(url)) {
    const match = url.match(regexWithN);
    return match ? match[1] : null; // Extract everything before /_ if _N exists
  } else if (/store\//.test(url)) {
    const match = url.match(regexWithoutN);
    return match ? match[1].split('/_/')[0] : null;
  } else {
    const match = url.match(regexGeneric);
    return match ? match[1] : null;
  }
}

// Example usage
// const url1 = "https://www.jdsports.com/store/men/shoes/_/N-puo7x9";
// const url2 = "https://www.jdsports.com/store/men/shoes";
// const url3 = "https://www.jdsports.com/store/accessories/men-s/_/N-168om1w";
// const url4 = "https://www.jdsports.com/kids-clothing";

// console.log(extractName(url1)); // Output: "men/shoes"
// console.log(extractName(url2)); // Output: "men/shoes"
// console.log(extractName(url3)); // Output: "accessories/men-s"
// console.log(extractName(url4)); // Output: "kids-clothing"
