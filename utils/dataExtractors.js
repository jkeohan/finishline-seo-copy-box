import { convertHTMLToMarkdown } from './parseHTML.js'

export const extractSEOCopyBoxData = ({ address, extractor1}) => {
	let body = convertHTMLToMarkdown(extractor1).join('')
	body = body.replace(/�/g, "'");
	return {
		name: address,
		label: address,
		body,
	};
};
