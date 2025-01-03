import { JSDOM } from 'jsdom';

const TAGS = {
	// P: (node) => `${node.textContent}\n\n`, // Paragraph
	P: (node) => [
		...Array.from(node.childNodes).map(processNode).filter(Boolean)
	],
	H1: (node) => `# ${node.textContent}\n`, // Heading 1
	H2: (node) => `## ${node.textContent}\n`, // Heading 2
	H3: (node) => `### ${node.textContent}\n\n`, // Heading 3
	H4: (node) => `#### ${node.textContent}\n`, // Heading 4
	EM: (node) =>
		`*${[...Array.from(node.childNodes).map(processNode).filter(Boolean)]}*`, // Emphasized (italic)
	STRONG: (node) =>
		`**${[...Array.from(node.childNodes).map(processNode).filter(Boolean)]}**`, // Strong (bold)
	I: (node) => `*${node.textContent}*`, // Italic (same as EM)
	A: (node) => `[${node.textContent}](${node.href})`, // Anchor (link)
	UL: (node) => node.childNodes.map((child) => TAGS.LI(child)).join('\n'), // Unordered list
	LI: (node) => `- ${node.textContent}`, // List item
	HR: () => `\n\n---\n`, // Horizontal rule
	BR: () => `\n`, // Line break (single newline)
	DIV: (node) => node.textContent, // Div (no special formatting)
};
const seoButtons = {
	list: [],
	title: '',
};

function ensureParagraphTags(htmlString) {
	// console.log('htmlString', htmlString);
	// replace &amp with &
	htmlString = htmlString.replace(/&amp;/g, '&');
	return `${htmlString}`;
}

const parseHTMLToParentBlocks = (htmlString) => {
	const dom = new JSDOM(htmlString);
	const doc = dom.window.document;

	return Array.from(doc.body.childNodes);
};

export const convertHTMLToMarkdown = (htmlString) => {
    seoButtons.list = []
    seoButtons.title = ''

	const newHtmlString = ensureParagraphTags(htmlString);

	const parentBlocks = parseHTMLToParentBlocks(newHtmlString);
	const textBlocks = [];

	parentBlocks.forEach((block) => {
		const processedBlock = processNode(block);
		// console.log({parentBlocks})
		if (processedBlock) {
			textBlocks.push(processedBlock);
		}
	});
	console.log({ textBlocks, seoButtons });
	return { textBlocks, seoButtons };
};

let skipNextP = false;

const processNode = (node) => {
	if (node.nodeType === 3) {
		// console.log('node.nodeType', node.nodeValue)
		return node.nodeValue.trim();
	} else if (node.nodeType === 1) {
		// ELEMENT_NODE
		const tagName = node.tagName.toUpperCase();
		const tagHandler = TAGS[tagName];

		if (
			tagName === 'H3' &&
			node.nextElementSibling &&
			node.nextElementSibling.tagName === 'P' &&
			node.nextElementSibling.textContent.includes('|')
		) {
			skipNextP = true;
			seoButtons.title = node.textContent.replace(/�/g, "'");
			// Parse the links in the next <P> element's innerHTML
			const anchorsArray = parseLinks(node.nextElementSibling.innerHTML);
			if (anchorsArray && anchorsArray.length) {
				seoButtons.list = anchorsArray;
			}
			return '';
		}

		if (skipNextP && tagName === 'P') {
			skipNextP = false;
			return '';
		}

		if (tagHandler) return tagHandler(node);
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
	//   console.log({ anchorTags });

	// Map over anchor tags and return the desired array of objects
	const anchorsArr = Array.from(anchorTags).map((anchor) => ({
		label: anchor.textContent.trim().replace(/�/g, "'"),
		url: anchor.href,
	}));
	return anchorsArr;
}
