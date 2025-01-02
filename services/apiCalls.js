import axios from 'axios';
import { getAccessToken } from './auth.js';
import { writeLog } from '../utils/helpers.js';
import { DC_REPO_ID } from '../data/constants.js'

const accessToken = await getAccessToken();

const contentManagementUrl = "https://api.amplience.net/v2/content/content-repositories/6724d0603736886cda0324f2/content-items"

// const contentManagementUrl = `https://api.amplience.net/v2/content/content-repositories/${DC_REPO_ID}/content-items`;

export const createSEOCopyBlockAPI = async (data) => {
	try {
		const response = await axios.post(contentManagementUrl, data, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		writeLog(`createBlogAPI: created \n${data.label}`);
		return response.data;
	} catch (error) {
		const errorData = JSON.stringify(
			error.response?.data || error.message,
			null,
			2
		);
		writeLog(
			`createBlogAPI: An error occurred:\nError: ${errorData}\ndata: ${data.label}`
		);

		console.error(
			'Error Creating Content Item:',
			error.response?.data || error.message
		);
	}
};