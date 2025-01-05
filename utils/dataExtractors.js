import { convertHTMLToMarkdown } from './parseHTML.js'

export const extractSEOCopyBoxData = ({ address, extractor1 }) => {
	let { textBlocks, seoButtons } = convertHTMLToMarkdown(extractor1);
	let body = textBlocks.join('');
	// removes any spaces that occur immediately before a comma
	body = body.replace(/\s+(?=,)/g, '');
	// add space before anchor if one doesn't already exist
	body = body.replace(/(?<![\s\*]{1,2})\[/g, ' [');
	// add space after anchor if one doesn't already exist but not if next char is a comma
	body = body.replace(/(?<=\))(?=\S)(?!,)/g, ' ');
	return {
		name: address,
		label: address,
		body,
		seoButtons,
	};
};
