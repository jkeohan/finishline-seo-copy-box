import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'logs.log');
const csvFilePath = path.join(__dirname, '../data/jd_copy_extraction.csv');
console.log('csvFilePath in helpers', csvFilePath)

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
	console.log('filePath', filePath);
	return new Promise((resolve, reject) => {
		const result = [];
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (row) => {
				if (row['Extractor 1 1'])
					result.push({
						address: row['Address'],
						extractor1: row['Extractor 1 1'],
						extractor2: row['Extractor 2 1'],
					});
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
