import Node from '../node/Node';
import TextNode from '../text-node/TextNode';
import NodeType from '../node/NodeType';
import ShadowRoot from '../shadow-root/ShadowRoot';
import Attribute from './Attribute';
import DOMRect from './DOMRect';
import Range from './Range';
import HTMLParser from '../../../html-parser/HTMLParser';
import { decode, encode } from 'he';
import ClassList from './ClassList';
import QuerySelector from '../../../query-selector/QuerySelector';
import HTMLRenderer from '../../../html-renderer/HTMLRenderer';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';

const ATTRIBUTE_REGEXP = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))/gi;

/**
 * Element.
 */
export default class Element extends Node {
	public tagName: string = null;
	public nodeType = NodeType.ELEMENT_NODE;
	public shadowRoot: ShadowRoot = null;
	public classList = new ClassList(this);
	public scrollTop = 0;
	public scrollLeft = 0;
	public _attributesMap: { [k: string]: string } = {};
	private _attributePropertyMap = null;
	public _useCaseSensitiveAttributes = false;

	/**
	 * Returns ID.
	 *
	 * @return ID.
	 */
	public get id(): string {
		return this.getAttribute('id');
	}

	/**
	 * Sets ID.
	 *
	 * @param id ID.
	 * @return HTML.
	 */
	public set id(id: string) {
		this.setAttribute('id', id);
	}

	/**
	 * Returns class name.
	 *
	 * @return Class name.
	 */
	public get className(): string {
		return this.getAttribute('class');
	}

	/**
	 * Sets class name.
	 *
	 * @param className Class name.
	 * @return Class name.
	 */
	public set className(className: string) {
		this.setAttribute('class', className);
	}

	/**
	 * Returns children.
	 *
	 * @returns Children.
	 */
	public get children(): Element[] {
		return <Element[]>this.childNodes.filter(childNode => childNode instanceof Element);
	}

	/**
	 * Node name.
	 *
	 * @return Node name.
	 */
	public get nodeName(): string {
		return this.tagName;
	}

	/**
	 * Get text value of children.
	 *
	 * @return Text content.
	 */
	public get textContent(): string {
		let result = '';
		for (const childNode of this.childNodes) {
			if (childNode instanceof Element || childNode instanceof TextNode) {
				result += childNode.textContent;
			}
		}
		return result;
	}

	/**
	 * Sets text content.
	 *
	 * @param textContent Text content.
	 */
	public set textContent(textContent: string) {
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}
		this.appendChild(this.ownerDocument.createTextNode(textContent));
	}

	/**
	 * Returns inner HTML.
	 *
	 * @return HTML.
	 */
	public get innerHTML(): string {
		return HTMLRenderer.getInnerHTML(this);
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param html HTML.
	 */
	public set innerHTML(html: string) {
		const root = HTMLParser.parse(this.ownerDocument, html);
		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}
		for (const child of root.childNodes.slice()) {
			this.appendChild(child);
		}
	}

	/**
	 * Returns outer HTML.
	 *
	 * @return HTML.
	 */
	public get outerHTML(): string {
		return HTMLRenderer.getOuterHTML(this);
	}

	/**
	 * Returns attributes.
	 *
	 * @returns Attributes.
	 */
	public get attributes(): { [k: string]: Attribute | number } {
		const names = Object.keys(this._attributesMap);
		const attributes = { length: names.length };
		for (let i = 0, max = names.length; i < max; i++) {
			const name = names[i];
			const attribute = new Attribute();
			attribute.name = name;
			attribute.value = this._attributesMap[name];
			attributes[name] = attribute;
			attributes[i] = attribute;
		}
		return attributes;
	}

	/**
	 * Attribute changed callback.
	 *
	 * @param name Name.
	 * @param oldValue Old value.
	 * @param newValue New value.
	 */
	public attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;

	/**
	 * Sets an attribute.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public setAttribute(name: string, value: string): void {
		const lowerName = this._useCaseSensitiveAttributes ? name : name.toLowerCase();
		const oldValue = this._attributesMap[lowerName] !== undefined ? this._attributesMap[lowerName] : null;
		this._attributesMap[lowerName] = String(value);

		this._setAttributeProperty(lowerName, this._attributesMap[lowerName]);

		if (this.attributeChangedCallback) {
			this.attributeChangedCallback(name, oldValue, value);
		}

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter || observer.options.attributeFilter.includes(lowerName))
				) {
					const record = new MutationRecord();
					record.type = MutationTypeConstant.attributes;
					record.attributeName = lowerName;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Returns attribute value.
	 *
	 * @param name Name.
	 */
	public getAttribute(name: string): string {
		const lowerName = this._useCaseSensitiveAttributes ? name : name.toLowerCase();
		return this.hasAttribute(name) ? this._attributesMap[lowerName] : null;
	}

	/**
	 * Returns a boolean value indicating whether the specified element has the attribute or not.
	 *
	 * @param name Attribute name.
	 * @returns True if attribute exists, false otherwise.
	 */
	public hasAttribute(name: string): boolean {
		const lowerName = this._useCaseSensitiveAttributes ? name : name.toLowerCase();
		return this._attributesMap[lowerName] !== undefined;
	}

	/**
	 * @override
	 */
	public hasAttributes(): boolean {
		return Object.keys(this._attributesMap).length > 0;
	}

	/**
	 * Removes an attribute.
	 *
	 * @param name Name.
	 */
	public removeAttribute(name: string): void {
		const lowerName = this._useCaseSensitiveAttributes ? name : name.toLowerCase();
		const oldValue = this._attributesMap[lowerName] !== undefined ? this._attributesMap[lowerName] : null;
		delete this._attributesMap[lowerName];

		this._removeAttributeProperty(name);

		if (this.attributeChangedCallback) {
			this.attributeChangedCallback(name, oldValue, null);
		}

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (
					observer.options.attributes &&
					(!observer.options.attributeFilter || observer.options.attributeFilter.includes(lowerName))
				) {
					const record = new MutationRecord();
					record.type = MutationTypeConstant.attributes;
					record.attributeName = lowerName;
					record.oldValue = observer.options.attributeOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Sets raw attributes.
	 *
	 * @param rawAttributes Raw attributes.
	 */
	public _setRawAttributes(rawAttributes: string): void {
		rawAttributes = rawAttributes.trim();
		if (rawAttributes) {
			const regExp = new RegExp(ATTRIBUTE_REGEXP, 'gi');
			let match: RegExpExecArray;

			// Attributes with value
			while ((match = regExp.exec(rawAttributes))) {
				const name = this._useCaseSensitiveAttributes ? match[1] : match[1].toLowerCase();
				this._attributesMap[name] = decode(match[2] || match[3] || match[4] || '');
				this._setAttributeProperty(name, this._attributesMap[name]);
			}

			// Attributes with no value
			for (const name of rawAttributes
				.replace(ATTRIBUTE_REGEXP, '')
				.trim()
				.split(' ')) {
				const lowerName = this._useCaseSensitiveAttributes ? name.trim() : name.trim().toLowerCase();
				this._attributesMap[lowerName] = '';
				this._setAttributeProperty(lowerName, this._attributesMap[lowerName]);
			}
		}
	}

	/**
	 * Returns raw attributes.
	 *
	 * @returns {string} Raw attributes.
	 */
	public _getRawAttributes(): string {
		const attributes = [];
		for (const name of Object.keys(this._attributesMap)) {
			if (this._attributesMap[name]) {
				attributes.push(name + '="' + encode(this._attributesMap[name]) + '"');
			} else if (this._attributesMap[name] !== undefined) {
				attributes.push(name);
			}
		}
		return attributes.join(' ');
	}

	/**
	 * Attaches a shadow root.
	 *
	 * @param _shadowRootInit Shadow root init.
	 * @returns Shadow root.
	 */
	public attachShadow(_shadowRootInit: { mode: string }): ShadowRoot {
		if (this.shadowRoot) {
			throw new Error('Shadow root has already been attached.');
		}
		this.shadowRoot = new ShadowRoot();
		this.shadowRoot.ownerDocument = this.ownerDocument;
		this.shadowRoot.isConnected = this.isConnected;
		return this.shadowRoot;
	}

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 */
	public scrollTo(): void {}

	/**
	 * Converts to string.
	 *
	 * @return String.
	 */
	public toString(): string {
		return this.outerHTML;
	}

	/**
	 * Returns the size of an element and its position relative to the viewport.
	 *
	 * @returns DOM rect.
	 */
	public getBoundingClientRect(): DOMRect {
		return new DOMRect();
	}

	/**
	 * Returns a range.
	 *
	 * @returns Range.
	 */
	public createTextRange(): Range {
		return new Range();
	}

	/**
	 * Query CSS selector to find matching nodes.
	 *
	 * @param selector CSS selector.
	 * @returns Matching elements.
	 */
	public querySelectorAll(selector: string): Element[] {
		return QuerySelector.querySelectorAll(this, selector);
	}

	/**
	 * Query CSS Selector to find matching node.
	 *
	 * @param selector CSS selector.
	 * @return Matching node.
	 */
	public querySelector(selector: string): Element {
		return QuerySelector.querySelector(this, selector);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByTagName(tagName: string): Element[] {
		return this.querySelectorAll(tagName);
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param className Tag name.
	 * @returns Matching nodes.
	 */
	public getElementsByClassName(className: string): Element[] {
		return this.querySelectorAll('.' + className.split(' ').join('.'));
	}

	/**
	 * Sets a property when setting an attribute.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	protected _setAttributeProperty(name, value): void {
		if (name === 'style' && this['style']) {
			for (const part of value.split(';')) {
				const [key, value] = part.split(':');
				this['style'][key.trim()] = value.trim();
			}
		} else {
			const property = this._getPropertyNameFromAttribute(name);

			if (property) {
				if (this[property] === '') {
					this[property] = value;
				} else if (typeof this[property] === 'boolean') {
					this[property] = true;
				} else if (typeof this[property] === 'number') {
					this[property] = parseFloat(value);
				}
			}
		}
	}

	/**
	 * Sets boolean properties to false if a matching attribute is removed.
	 *
	 * @param name Name.
	 */
	protected _removeAttributeProperty(name): void {
		const property = this._getPropertyNameFromAttribute(name);

		if (property && typeof this[property] === 'boolean') {
			this[property] = false;
		}
	}

	/**
	 * Returns the property name based on an attribute name.
	 * This will be used for setting attribute values as properties on the element.
	 *
	 * @param name Attribute name.
	 * @returns Property name.
	 */
	protected _getPropertyNameFromAttribute(name: string): string {
		if (!this._attributePropertyMap) {
			this._attributePropertyMap = {};

			for (const key of Object.keys(this)) {
				this._attributePropertyMap[key.toLowerCase()] = key;
			}
		}

		return this._attributePropertyMap[name] || null;
	}
}
