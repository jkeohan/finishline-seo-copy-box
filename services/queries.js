import { DC_FOLDER_ID } from '../data/constants.js';

export const buildSEOCopyBoxQuery = ({
	name,
	body,
	seoButtons: { title, list },
}) => {
	return {
		body: {
			_meta: {
				name,
				schema: 'https://finishline.com/contentType/seo-copy-box',
			},
			seoCopy: {
				hide: false,
				body,
			},
			seoBrands: {
				hide: false,
				brandDetails: {
					list,
				},
				title,
			},
		},
		label: name,
		folderId: DC_FOLDER_ID,
		locale: 'en-US',
	};
};
