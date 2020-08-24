import Element from '../element/Element';
import HTMLElement from '../html-element/HTMLElement';
import TextNode from '../text-node/TextNode';
import CommentNode from '../comment-node/CommentNode';
import Window from '../../../window/Window';
import Node from '../node/Node';
import TreeWalker from '../../../tree-walker/TreeWalker';
import DocumentFragment from '../document-fragment/DocumentFragment';
import HTMLParser from '../../../html-parser/HTMLParser';
import Event from '../../../event/Event';
import DOMImplementation from '../../../dom-implementation/DOMImplementation';
import HTMLElementTag from '../../../html-config/HTMLElementTag';
import INodeFilter from '../../../tree-walker/INodeFilter';

/**
 * Document.
 */
export default class Document extends DocumentFragment {
	public documentElement: Element;
	public body: Element;
	public head: Element;
	public defaultView: Window;
	public nodeType = Node.DOCUMENT_NODE;
	protected _isConnected = true;
	protected _isFirstWrite = true;
	protected _isFirstWriteAfterOpen = false;
	public implementation: DOMImplementation;

	/**
	 * Creates an instance of Document.
	 *
	 * @param window Window instance.
	 */
	constructor(window: Window) {
		super();

		this.defaultView = window;
		this.implementation = new DOMImplementation(window);
		this.documentElement = this.createElement('html');
		this.head = this.createElement('head');
		this.body = this.createElement('body');
		this.documentElement.appendChild(this.head);
		this.documentElement.appendChild(this.body);
		this.documentElement.isConnected = true;
		this.appendChild(this.documentElement);
	}

	/**
	 * Node name.
	 *
	 * @return Node name.
	 */
	public get nodeName(): string {
		return '#document';
	}

	/**
	 * Replaces the document HTML with new HTML.
	 *
	 * @param html HTML.
	 */
	public write(html: string): void {
		const root = HTMLParser.parse(this, html);

		if (this._isFirstWrite || this._isFirstWriteAfterOpen) {
			const rootNode = root.querySelector('html');

			if (this._isFirstWrite) {
				if (!this._isFirstWriteAfterOpen) {
					this.open();
				}

				this._isFirstWrite = false;
			}

			this._isFirstWriteAfterOpen = false;

			this.documentElement = rootNode || this.createElement('html');
			this.head = this.documentElement.querySelector('head') || this.createElement('head');
			this.body = this.documentElement.querySelector('body') || this.createElement('body');
			this.documentElement.appendChild(this.head);
			this.documentElement.appendChild(this.body);
			this.appendChild(this.documentElement);

			if (!rootNode) {
				for (const child of root.childNodes.slice()) {
					this.body.appendChild(child);
				}
			}
		} else {
			const bodyNode = root.querySelector('body');
			for (const child of (bodyNode || root).childNodes.slice()) {
				this.body.appendChild(child);
			}
		}
	}

	/**
	 * Opens the document.
	 *
	 * @returns Document.
	 */
	public open(): Document {
		this._isFirstWriteAfterOpen = true;

		for (const eventType of Object.keys(this._listeners)) {
			const callbacks = this._listeners[eventType];
			if (callbacks) {
				for (const callback of callbacks) {
					this.removeEventListener(eventType, callback);
				}
			}
		}

		for (const child of this.childNodes.slice()) {
			this.removeChild(child);
		}

		return this;
	}

	/**
	 * Closes the document.
	 */
	public close(): void {}

	/**
	 * Creates an element.
	 *
	 * @param  tagName Tag name.
	 * @return Element.
	 */
	public createElement(tagName: string): Element {
		const customElementClass = this.defaultView.customElements.get(tagName);
		const elementClass = customElementClass ? customElementClass : this.getElementClass(tagName);

		elementClass.ownerDocument = this;

		const element = new elementClass();
		element.tagName = tagName.toUpperCase();
		element.ownerDocument = this;

		return element;
	}

	/**
	 * Creates a text node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	public createTextNode(data: string): TextNode {
		TextNode.ownerDocument = this;
		const textNode = new TextNode();
		textNode.textContent = data;
		return textNode;
	}

	/**
	 * Creates a comment node.
	 *
	 * @param  data Text data.
	 * @returns Text node.
	 */
	public createComment(data: string): CommentNode {
		CommentNode.ownerDocument = this;
		const commentNode = new CommentNode();
		commentNode.textContent = data;
		return commentNode;
	}

	/**
	 * Creates a document fragment.
	 *
	 * @returns Document fragment.
	 */
	public createDocumentFragment(): DocumentFragment {
		DocumentFragment.ownerDocument = this;
		const documentFragment = new DocumentFragment();
		return documentFragment;
	}

	/**
	 * Creates a Tree Walker.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	public createTreeWalker(root: Node, whatToShow = -1, filter: INodeFilter = null): TreeWalker {
		return new TreeWalker(root, whatToShow, filter);
	}

	/**
	 * Creates an event.
	 *
	 * @legacy
	 * @param _type Type.
	 * @returns Event.
	 */
	public createEvent(_type: string): Event {
		return new Event('init');
	}

	/**
	 * Imports a node.
	 *
	 * @param node Node to import.
	 * @param Imported node.
	 */
	public importNode(node: Node): Node {
		if (!(node instanceof Node)) {
			throw new Error('Parameter 1 was not of type Node.');
		}
		const clone = node.cloneNode(true);
		clone.ownerDocument = this;
		return clone;
	}

	/**
	 * Returns the element class for a tag name.
	 *
	 * @param tagName Tag name.
	 * @returns Element class.
	 */
	private getElementClass(tagName: string): typeof Element {
		return HTMLElementTag[tagName] || HTMLElement;
	}
}
