import Window from '../../../../src/window/Window';
import CustomElement from '../../../CustomElement';

describe('Node', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get isConnected()', () => {
		test('Returns "true" if the node is connected to the document.', () => {
			// Add test
		});
	});

	describe('get firstChild()', () => {
		test('Returns the first child node.', () => {
			const parent = document.createElement('div');
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');

			parent.appendChild(textNode1);
			parent.appendChild(div);

			expect(parent.firstChild).toBe(textNode1);
		});
	});

	describe('get lastChild()', () => {
		test('Returns the last child node.', () => {
			const parent = document.createElement('div');
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');

			parent.appendChild(div);
			parent.appendChild(textNode1);

			expect(parent.lastChild).toBe(textNode1);
		});
	});
});
