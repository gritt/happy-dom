import Window from '../../src/window/Window';
import QuerySelectorHTML from './data/QuerySelectorHTML';

describe('TextNode', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('querySelectorAll', () => {
		test('Returns all span elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all b (bold) elements.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('b');
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[0]);
			expect(elements[1]).toBe(container.children[1].children[0]);
		});

		test('Returns all elements with class name "class1".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1');
			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with class name "class1 class2".', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('.class1.class2');
			expect(elements.length).toBe(4);
			expect(elements[0]).toBe(container.children[0]);
			expect(elements[1]).toBe(container.children[0].children[1]);
			expect(elements[2]).toBe(container.children[0].children[1].children[0]);
			expect(elements[3]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with matching attributes.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with multiple matching attributes.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('[attr1="value1"][attr2="value2"]');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});

		test('Returns all elements with tag name and matching attributes.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"]');

			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
			expect(elements[1]).toBe(container.children[0].children[1].children[1]);
		});

		test('Returns all elements with tag name and multiple matching attributes.', () => {
			const container = document.createElement('div');
			container.innerHTML = QuerySelectorHTML;
			const elements = container.querySelectorAll('span[attr1="value1"][attr2="value2"]');

			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(container.children[0].children[1].children[0]);
		});
	});

	describe('querySelector', () => {
		test('Returns a span.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span')).toBe(span);
		});

		test('Returns span when class name is matched.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('.spanClass')).toBe(span);
		});

		test('Returns span when class name and tag name is matched.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.className = 'spanClass';
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span.spanClass')).toBe(span);
		});

		test('Returns span when tag name and attribute is matched.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			span.setAttribute('attr1', 'value1');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('span[attr1="value1"]')).toBe(span);
			expect(div1.querySelector('[attr1="value1"]')).toBe(span);
			expect(div1.querySelector('span[attr1]')).toBe(span);
			expect(div1.querySelector('[attr1]')).toBe(span);
		});

		test('Returns the first element when "*" is used.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');
			div1.appendChild(div2);
			div2.appendChild(span);
			expect(div1.querySelector('*')).toBe(div2);
		});

		test('Returns "null" if no element is found.', () => {
			const div = document.createElement('div');
			expect(div.querySelector('span')).toBe(null);
		});
	});
});
