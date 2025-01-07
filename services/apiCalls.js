import axios from 'axios';
import { getAccessToken } from './auth.js';
import { writeLog } from '../utils/helpers.js';
import { DC_REPO_ID } from '../data/constants.js'

const accessToken = await getAccessToken();

const contentManagementUrl = `https://api.amplience.net/v2/content/content-repositories/${DC_REPO_ID}/content-items`;

export const createSEOCopyBlockAPI = async (data, index) => {
	const label = data.label
	try {
		const response = await axios.post(contentManagementUrl, data, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		writeLog(`created content item: ${label} \n`);
		return response.data;
	} catch (error) {
		const errorData = JSON.stringify(
			error.response?.data || error.message,
			null,
			2
		);
		writeLog(
			`An error occurred:\n: ${errorData}\ndata: ${index} ${label} \n`
		);

		console.error(
			'Error Creating Content Item:',
			error.response?.data || error.message
		);
	}
};