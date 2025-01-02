import {
	DC_FOLDER_ID,
} from '../data/constants.js';

export const buildSEOCopyBoxQuery = ({name, body}) => {
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
					list: [
						{
							label: 'Men’s Basketball Shoes ',
							url: 'https://www.jdsports.com/store/men/shoes/basketball/_/N-1a8wx2c"',
						},
						{
							label: 'Men’s Running Shoes',
							url: 'https://www.jdsports.com/store/men/shoes/running/_/N-1m2y8s2',
						},
					],
				},
				title: 'FEATURED MEN’S FOOTWEAR',
			},
		},
		label: name,
		folderId: DC_FOLDER_ID,
		locale: 'en-US',
	};
};
