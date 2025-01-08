import { JSDOM } from 'jsdom';

const TAGS = {
	// P: (node) => `${node.textContent}\n\n`, // Paragraph
	P: (node) =>
		[...Array.from(node.childNodes).map(processNode).filter(Boolean)].join('') + '\n\n',
	H1: (node) => `# ${node.textContent}\n`, // Heading 1
	H2: (node) => `## ${node.textContent}\n`, // Heading 2
	H3: (node) => `### ${node.textContent}\n\n`, // Heading 3
	H4: (node) => `#### ${node.textContent}\n`, // Heading 4
	EM: (node) =>
		` *${[...Array.from(node.childNodes).map(processNode).filter(Boolean)]}* `, // Emphasized (italic)
	STRONG: (node) =>
		` **${[
			...Array.from(node.childNodes).map(processNode).filter(Boolean),
		].join('')}** `, // Strong (bold)
	I: (node) => `*${node.textContent}*`, // Italic (same as EM)
	A: (node) => `[${node.textContent}](${node.href})`, // Anchor (link)
	UL: (node) => node.childNodes.map((child) => TAGS.LI(child)).join('\n'), // Unordered list
	LI: (node) => `- ${node.textContent}`, // List item
	HR: () => ``, // Horizontal rule
	BR: () => `\n`, // Line break (single newline)
	DIV: (node) =>
		[...Array.from(node.childNodes).map(processNode).filter(Boolean)].join(''), // Div (no special formatting)
};
const seoButtons = {
	list: [],
	title: '',
};
let headerCount = 0;
let header = '';

function cleanHTML(htmlString) {
	// replace &amp with &
	htmlString = htmlString.replace(/&amp;/g, '&');
	htmlString = htmlString.replace(/�/g, "'");
	return `${htmlString}`;
}

const parseHTMLToParentBlocks = (htmlString) => {
	const dom = new JSDOM(htmlString);
	const doc = dom.window.document;

	return Array.from(doc.body.childNodes);
};

export const convertHTMLToMarkdown = (htmlString) => {
	seoButtons.list = [];
	seoButtons.title = '';
	headerCount = 0;
	header = '';

	const cleanHTMLString = cleanHTML(htmlString);

	const parentBlocks = parseHTMLToParentBlocks(cleanHTMLString);
	const textBlocks = [];

	parentBlocks.forEach((block) => {
		const processedBlock = processNode(block);
		if (processedBlock) {
			console.log({ processedBlock });
			textBlocks.push(processedBlock);
		}
	});
	console.log('textBlocks', textBlocks);
	return { textBlocks, seoButtons, header };
};

let skipNextP = false;

const processNode = (node) => {
	if (node.nodeType === 3) {
		return node.nodeValue.trim();
	} else if (node.nodeType === 1) {
		// ELEMENT_NODE
		const tagName = node.tagName.toUpperCase();
		const tagHandler = TAGS[tagName];
		// looking for an H3 with a P which includes | as this indicates the links are seo buttons
		// the H3 will be assigned to seoButtons.title and buttons added to seoButtons list array
		if (
			tagName === 'H3' &&
			node.nextElementSibling &&
			node.nextElementSibling.tagName === 'P' &&
			node.nextElementSibling.textContent.includes('|')
		) {
			// skipNextP set so that the P isn't processed as we only need the links
			skipNextP = true;
			seoButtons.title = node.textContent;
			// Parse the links in the next <P> element's innerHTML
			const anchorsArray = parseLinks(node.nextElementSibling.innerHTML);
			if (anchorsArray && anchorsArray.length) {
				seoButtons.list = anchorsArray;
			}
			return '';
		}
		// break out of processNode since the links have already been processed from this P
		if (skipNextP && tagName === 'P') {
			skipNextP = false;
			return '';
		}
		// set the first header as the seo header copy header
		if (tagHandler) {
			let handler = tagHandler(node);
			if (['H1', 'H2', 'H3', 'H4'].includes(tagName)) {
				if (headerCount === 0) {
					headerCount += 1;
					console.log('header textcontent', node.textContent);
					header = node.textContent;
					return '';
				}
			}
			return handler;
		}

		// Handle children recursively if no specific TAGS handler is found
		const children = Array.from(node.childNodes)
			.map(processNode)
			.filter(Boolean);

		if (children.length > 0) return children;
	}
	return null;
};

// Function to parse the links in the paragraph (with '|' separator)
function parseLinks(html) {
	// Create a DOM parser
	const dom = new JSDOM(html);
	const doc = dom.window.document;

	// Select all anchor tags in the paragraph
	const anchorTags = doc.querySelectorAll('a');

	// Map over anchor tags and return the desired array of objects
	const anchorsArr = Array.from(anchorTags).map((anchor) => ({
		label: anchor.textContent.trim().replace(/�/g, "'"),
		url: anchor.href,
	}));
	return anchorsArr;
}
