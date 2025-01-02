import { convertHTMLToMarkdown } from './parseHTML.js'

export const extractSEOCopyBoxData = ({ address, extractor1}) => {
	let {textBlocks, seoButtons} = convertHTMLToMarkdown(extractor1)
	const body = textBlocks.join('').replace(/�/g, "'");
	return {
		name: address,
		label: address,
		body,
		seoButtons
	};
};
