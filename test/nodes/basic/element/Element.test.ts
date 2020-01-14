import Window from '../../../../src/Window';

describe('Element', () => {
	let window, document, element;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	describe('get id()', () => {
		test('Returns the element "id" attribute.', () => {
			element.setAttribute('id', 'id');
			expect(element.id).toBe('id');
		});
	});

	describe('set id()', () => {
		test('Sets the element "id" as an attribute.', () => {
			element.id = 'id';
			expect(element.getAttribute('id')).toBe('id');
		});
	});

	describe('get className()', () => {
		test('Returns the element "class" attribute.', () => {
			element.setAttribute('class', 'class');
			expect(element.className).toBe('class');
		});
	});

	describe('set id()', () => {
		test('Sets the element "class" as an attribute.', () => {
			element.className = 'class';
			expect(element.getAttribute('class')).toBe('class');
		});
	});

	describe('get children()', () => {
		test('Returns nodes of type Element.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const textNode = document.createTextNode('text');
			element.appendChild(div1);
			element.appendChild(textNode);
			element.appendChild(div2);
			expect(element.children).toEqual([div1, div2]);
		});
	});

	describe('get nodeName()', () => {
		test('Returns the "tagName" property of the element.', () => {
			expect(element.nodeName).toEqual('DIV');
		});
	});

	describe('get textContent()', () => {
		test('Returns text node data of children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');
			element.appendChild(div);
			element.appendChild(textNode2);
			div.appendChild(textNode1);
			expect(element.textContent).toBe('text1text2');
		});
	});
});
