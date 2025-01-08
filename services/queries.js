import { DC_FOLDER_ID } from '../data/constants.js';

export const buildSEOCopyBoxQuery = ({
	name,
	header,
	body,
	seoButtons: { title, list },
}) => {
	const seoCopy = {
		hide: false,
		body,
	};

	const seoBrands = {
		hide: false,
	};

	if (header) {
		seoCopy.header = header;
	}

	if (list.length) {
		seoBrands.brandDetails = {
			list,
		};
		seoBrands.title = title;
	}

	return {
		body: {
			_meta: {
				name,
				schema: 'https://finishline.com/contentType/seo-copy-box',
			},
			seoCopy,
			seoBrands,
		},
		label: name,
		folderId: DC_FOLDER_ID,
		locale: 'en-US',
	};
};
