import Window from '../../../../src/window/Window';
import HTMLRenderer from '../../../../src/html-renderer/HTMLRenderer';
import HTMLParser from '../../../../src/html-parser/HTMLParser';
import CustomElement from '../../../CustomElement';
import ShadowRoot from '../../../../src/nodes/basic/shadow-root/ShadowRoot';
import DOMRect from '../../../../src/nodes/basic/element/DOMRect';
import Range from '../../../../src/nodes/basic/element/Range';
import QuerySelector from '../../../../src/query-selector/QuerySelector';

describe('Element', () => {
	let window, document, element;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
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

	describe('set textContent()', () => {
		test('Replaces child nodes with a text node.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			element.appendChild(div);
			element.appendChild(textNode1);
			element.appendChild(textNode2);

			element.textContent = 'new_text';

			expect(element.textContent).toBe('new_text');
			expect(element.childNodes.length).toBe(1);
			expect(element.childNodes[0].textContent).toBe('new_text');
		});
	});

	describe('get innerHTML()', () => {
		test('Returns HTML of children as a concatenated string.', () => {
			jest.spyOn(HTMLRenderer, 'getInnerHTML').mockImplementation(renderElement => {
				expect(renderElement).toBe(element);
				return 'EXPECTED_HTML';
			});

			expect(element.innerHTML).toBe('EXPECTED_HTML');
		});
	});

	describe('set innerHTML()', () => {
		test('Creates child nodes from provided HTML.', () => {
			const root = document.createElement('div');
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			element.appendChild(document.createElement('div'));
			div.appendChild(textNode);
			root.appendChild(div);

			jest.spyOn(HTMLParser, 'parse').mockImplementation((parseDocument, html) => {
				expect(parseDocument).toBe(document);
				expect(html).toBe('SOME_HTML');
				return root;
			});
			element.innerHTML = 'SOME_HTML';

			expect(element.innerHTML).toBe('<div>text1</div>');
		});
	});

	describe('get innerHTML()', () => {
		test('Returns HTML an element and its children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');

			element.appendChild(div);
			element.appendChild(textNode1);

			expect(element.outerHTML).toBe('<div><div></div>text1</div>');
		});
	});

	describe('get attributes()', () => {
		test('Returns all attributes as an object.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');
			element.setAttribute('key3', 'value3');

			expect(element.attributes).toEqual({
				'0': { name: 'key1', value: 'value1' },
				'1': { name: 'key2', value: 'value2' },
				'2': { name: 'key3', value: 'value3' },
				key1: { name: 'key1', value: 'value1' },
				key2: { name: 'key2', value: 'value2' },
				key3: { name: 'key3', value: 'value3' },
				length: 3
			});
		});
	});

	describe('attributeChangedCallback()', () => {
		test('Calls attribute changed callback when it is implemented by a custom element (web component).', () => {
			const customElement = document.createElement('custom-element');

			element.appendChild(customElement);
			document.body.appendChild(element);

			customElement.setAttribute('key1', 'value1');
			customElement.setAttribute('key2', 'value2');
			customElement.setAttribute('key1', 'newValue');

			expect(customElement.changedAttributes).toEqual([
				{
					name: 'key1',
					newValue: 'value1',
					oldValue: null
				},
				{
					name: 'key2',
					newValue: 'value2',
					oldValue: null
				},
				{
					name: 'key1',
					newValue: 'newValue',
					oldValue: 'value1'
				}
			]);
		});
	});

	describe('setAttribute()', () => {
		test('Sets an attribute on an element.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.attributes).toEqual({
				'0': { name: 'key1', value: 'value1' },
				'1': { name: 'key2', value: '' },
				key1: { name: 'key1', value: 'value1' },
				key2: { name: 'key2', value: '' },
				length: 2
			});
		});

		test('Sets the property with the same name as the attribute to the same value if the property is set to an empty string.', () => {
			element.stringProperty = '';
			element.setAttribute('stringproperty', 'test');
			expect(element.stringProperty).toBe('test');
		});

		test('Sets the property with the same name as the attribute to "true" if the property is of type boolean.', () => {
			element.booleanProperty = false;
			element.setAttribute('booleanproperty', 'anyvalue');
			expect(element.booleanProperty).toBe(true);
		});

		test('Sets the property with the same name as the attribute to the same value value parsed as a float if the property is set to -1 (number).', () => {
			element.numberProperty = -1;
			element.setAttribute('numberproperty', '20.50');
			expect(element.numberProperty).toBe(20.5);
		});
	});

	describe('hasAttribute()', () => {
		test('Returns "true" if an element has an attribute.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.hasAttribute('key1')).toBe(true);
			expect(element.hasAttribute('key2')).toBe(true);
			element.removeAttribute('key1');
			element.removeAttribute('key2');
			expect(element.hasAttribute('key1')).toBe(false);
			expect(element.hasAttribute('key2')).toBe(false);
		});
	});

	describe('removeAttribute()', () => {
		test('Returns "true" if an element has an attribute.', () => {
			element.setAttribute('key1', 'value1');
			element.removeAttribute('key1');
			expect(element.attributes).toEqual({
				length: 0
			});
		});
	});

	describe('attachShadow()', () => {
		test('Creates a new ShadowRoot node and sets it to the shadowRoot property.', () => {
			element.attachShadow();
			expect(element.shadowRoot instanceof ShadowRoot).toBe(true);
			expect(element.shadowRoot.ownerDocument).toBe(document);
			expect(element.shadowRoot.isConnected).toBe(false);
			document.appendChild(element);
			expect(element.shadowRoot.isConnected).toBe(true);
		});
	});

	describe('scrollTo()', () => {
		test('Does nothing as there is no support for scrolling yet.', () => {
			element.scrollTo();
			expect(typeof element.scrollTo).toBe('function');
		});
	});

	describe('toString()', () => {
		test('Returns the same as outerHTML.', () => {
			expect(element.toString()).toBe(element.outerHTML);
		});
	});

	describe('getBoundingClientRect()', () => {
		test('Returns an instance of DOMRect.', () => {
			const domRect = element.getBoundingClientRect();
			expect(domRect instanceof DOMRect).toBe(true);
		});
	});

	describe('createTextRange()', () => {
		test('Returns an instance of Range.', () => {
			const range = element.createTextRange();
			expect(range instanceof Range).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		test('Returns elements matching a CSS selector.', () => {
			const selector = '*';
			const result = [];
			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((targetElement, targetSelector) => {
				expect(targetElement).toBe(element);
				expect(targetSelector).toBe(selector);
				return result;
			});
			expect(element.querySelectorAll(selector)).toBe(result);
		});
	});

	describe('querySelector()', () => {
		test('Returns an element matching a CSS selector.', () => {
			const selector = '*';
			const result = document.createElement('div');
			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((targetElement, targetSelector) => {
				expect(targetElement).toBe(element);
				expect(targetSelector).toBe(selector);
				return result;
			});
			expect(element.querySelector(selector)).toBe(result);
		});
	});

	describe('getElementsByTagName()', () => {
		test('Returns elements matching a tag name.', () => {
			const tagName = 'div';
			const result = [];
			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((targetElement, targetSelector) => {
				expect(targetElement).toBe(element);
				expect(targetSelector).toBe(tagName);
				return result;
			});
			expect(element.getElementsByTagName(tagName)).toBe(result);
		});
	});

	describe('getElementsByClassName()', () => {
		test('Returns elements matching a class name.', () => {
			const className = 'class1';
			const result = [];
			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((targetElement, targetSelector) => {
				expect(targetElement).toBe(element);
				expect(targetSelector).toBe('.' + className);
				return result;
			});
			expect(element.getElementsByClassName(className)).toBe(result);
		});
	});
});
