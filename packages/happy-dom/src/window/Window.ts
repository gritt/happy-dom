import CustomElementRegistry from '../custom-element/CustomElementRegistry';
import Document from '../nodes/basic/document/Document';
import Node from '../nodes/basic/node/Node';
import NodeFilter from '../tree-walker/NodeFilter';
import TextNode from '../nodes/basic/text-node/TextNode';
import CommentNode from '../nodes/basic/comment-node/CommentNode';
import ShadowRoot from '../nodes/basic/shadow-root/ShadowRoot';
import Element from '../nodes/basic/element/Element';
import HTMLElement from '../nodes/basic/html-element/HTMLElement';
import HTMLTemplateElement from '../nodes/elements/template/HTMLTemplateElement';
import HTMLFormElement from '../nodes/elements/form/HTMLFormElement';
import HTMLInputElement from '../nodes/elements/input/HTMLInputElement';
import HTMLTextAreaElement from '../nodes/elements/text-area/HTMLTextAreaElement';
import DocumentFragment from '../nodes/basic/document-fragment/DocumentFragment';
import TreeWalker from '../tree-walker/TreeWalker';
import Event from '../event/Event';
import CustomEvent from '../event/CustomEvent';
import EventTarget from '../event/EventTarget';
import URL from '../location/URL';
import Location from '../location/Location';
import EventTypes from '../event/EventTypes.json';
import MutationObserver from '../mutation-observer/MutationObserver';

/**
 * Handles the Window.
 */
export default class Window extends EventTarget {
	// Global classes
	public Node = Node;
	public TextNode = TextNode;
	public CommentNode = CommentNode;
	public ShadowRoot = ShadowRoot;
	public HTMLElement = HTMLElement;
	public HTMLInputElement = HTMLInputElement;
	public HTMLFormElement = HTMLFormElement;
	public HTMLTextAreaElement = HTMLTextAreaElement;
	public HTMLTemplateElement = HTMLTemplateElement;
	public Element = Element;
	public DocumentFragment = DocumentFragment;
	public NodeFilter = NodeFilter;
	public TreeWalker = TreeWalker;
	public MutationObserver = MutationObserver;
	public Document = Document;
	public Event = Event;
	public CustomEvent = CustomEvent;
	public URL = URL;
	public Location = Location;
	public CustomElementRegistry = CustomElementRegistry;
	public Window = Window;

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public console = typeof global !== undefined ? global.console : null;
	public self: Window = this;
	public top: Window = this;
	public window: Window = this;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		this.document = new Document(this);

		HTMLElement.ownerDocument = this.document;
		Node.ownerDocument = this.document;
		TextNode.ownerDocument = this.document;

		for (const eventType of EventTypes) {
			this[eventType] = Event;
		}

		// Copies functionality from global (like eval, String, Array, Object etc.)
		if (global !== undefined) {
			const descriptors = Object.getOwnPropertyDescriptors(global);
			Object.defineProperties(this, descriptors);
		}
	}

	/**
	 * Returns an object containing the values of all CSS properties of an element.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 * @returns Empty object.
	 */
	public getComputedStyle(): {} {
		return {};
	}

	/**
	 * Scrolls to a particular set of coordinates in the document.
	 *
	 * @note This method has not been implemented. It is just here for compatibility.
	 */
	public scrollTo(): void {}

	/**
	 * Disposes the window.
	 */
	public dispose(): void {}

	/**
	 * Sets a timer which executes a function once the timer expires.
	 *
	 * @param callback Function to be executed.
	 * @param [delay] Delay in ms.
	 * @return Timeout ID.
	 */
	public setTimeout(callback: () => void, delay?: number): NodeJS.Timeout {
		return global.setTimeout(callback, delay);
	}

	/**
	 * Cancels a timeout previously established by calling setTimeout().
	 *
	 * @param id ID of the timeout.
	 */
	public clearTimeout(id: NodeJS.Timeout): void {
		global.clearTimeout(id);
	}

	/**
	 * Calls a function with a fixed time delay between each call.
	 *
	 * @param callback Function to be executed.
	 * @param [delay] Delay in ms.
	 * @return Interval ID.
	 */
	public setInterval(callback: () => void, delay?: number): NodeJS.Timeout {
		return global.setInterval(callback, delay);
	}

	/**
	 * Cancels a timed repeating action which was previously established by a call to setInterval().
	 *
	 * @param id ID of the interval.
	 */
	public clearInterval(id: NodeJS.Timeout): void {
		global.clearInterval(id);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {function} callback Callback.
	 * @returns {NodeJS.Timeout} Timeout ID.
	 */
	public requestAnimationFrame(callback: (timestamp: number) => void): NodeJS.Timeout {
		return this.setTimeout(() => {
			callback(2);
		}, 0);
	}

	/**
	 * Mock animation frames with timeouts.
	 *
	 * @param {NodeJS.Timeout} id Timeout ID.
	 */
	public cancelAnimationFrame(id): void {
		this.clearTimeout(id);
	}
}
