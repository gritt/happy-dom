import CustomElementRegistry from '../custom-element/CustomElementRegistry';
import Document from '../nodes/basic/document/Document';
import Node from '../nodes/basic/node/Node';
import NodeFilter from '../tree-walker/NodeFilter';
import TextNode from '../nodes/basic/text-node/TextNode';
import CommentNode from '../nodes/basic/comment-node/CommentNode';
import ShadowRoot from '../nodes/basic/shadow-root/ShadowRoot';
import Element from '../nodes/basic/element/Element';
import HTMLElement from '../nodes/basic/html-element/HTMLElement';
import DocumentFragment from '../nodes/basic/document-fragment/DocumentFragment';
import TreeWalker from '../tree-walker/TreeWalker';
import Event from '../event/Event';
import CustomEvent from '../event/CustomEvent';
import EventTarget from '../event/EventTarget';
import URL from '../location/URL';
import Location from '../location/Location';
import EventTypes from '../event/EventTypes.json';
import MutationObserver from '../mutation-observer/MutationObserver';
import HTMLElementClass from '../html-config/HTMLElementClass';

/**
 * Handles the Window.
 */
export default class Window extends EventTarget implements NodeJS.Global {
	// Global classes
	public Node = Node;
	public TextNode = TextNode;
	public CommentNode = CommentNode;
	public ShadowRoot = ShadowRoot;
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
	public Headers = Map;

	// Public Properties
	public document: Document;
	public customElements: CustomElementRegistry = new CustomElementRegistry();
	public location = new Location();
	public navigator = { userAgent: 'happy-dom' };
	public console = typeof global !== undefined ? global.console : null;
	public self: Window = this;
	public top: Window = this;
	public window: Window = this;

	// Node.js Globals
	public Array = typeof global !== undefined ? global.Array : null;
	public ArrayBuffer = typeof global !== undefined ? global.ArrayBuffer : null;
	public Boolean = typeof global !== undefined ? global.Boolean : null;
	public Buffer = typeof global !== undefined ? global.Buffer : null;
	public DataView = typeof global !== undefined ? global.DataView : null;
	public Date = typeof global !== undefined ? global.Date : null;
	public Error = typeof global !== undefined ? global.Error : null;
	public EvalError = typeof global !== undefined ? global.EvalError : null;
	public Float32Array = typeof global !== undefined ? global.Float32Array : null;
	public Float64Array = typeof global !== undefined ? global.Float64Array : null;
	public Function = typeof global !== undefined ? global.Function : null;
	public GLOBAL = typeof global !== undefined ? global.GLOBAL : null;
	public Infinity = typeof global !== undefined ? global.Infinity : null;
	public Int16Array = typeof global !== undefined ? global.Int16Array : null;
	public Int32Array = typeof global !== undefined ? global.Int32Array : null;
	public Int8Array = typeof global !== undefined ? global.Int8Array : null;
	public Intl = typeof global !== undefined ? global.Intl : null;
	public JSON = typeof global !== undefined ? global.JSON : null;
	public Map = typeof global !== undefined ? global.Map : null;
	public Math = typeof global !== undefined ? global.Math : null;
	public NaN = typeof global !== undefined ? global.NaN : null;
	public Object = typeof global !== undefined ? global.Object : null;
	public Number = typeof global !== undefined ? global.Number : null;
	public Promise = typeof global !== undefined ? global.Promise : null;
	public RangeError = typeof global !== undefined ? global.RangeError : null;
	public ReferenceError = typeof global !== undefined ? global.ReferenceError : null;
	public RegExp = typeof global !== undefined ? global.RegExp : null;
	public Set = typeof global !== undefined ? global.Set : null;
	public Symbol = typeof global !== undefined ? global.Symbol : null;
	public SyntaxError = typeof global !== undefined ? global.SyntaxError : null;
	public String = typeof global !== undefined ? global.String : null;
	public TypeError = typeof global !== undefined ? global.TypeError : null;
	public URIError = typeof global !== undefined ? global.URIError : null;
	public Uint16Array = typeof global !== undefined ? global.Uint16Array : null;
	public Uint32Array = typeof global !== undefined ? global.Uint32Array : null;
	public Uint8Array = typeof global !== undefined ? global.Uint8Array : null;
	public Uint8ClampedArray = typeof global !== undefined ? global.Uint8ClampedArray : null;
	public WeakMap = typeof global !== undefined ? global.WeakMap : null;
	public WeakSet = typeof global !== undefined ? global.WeakSet : null;
	public clearImmediate = typeof global !== undefined ? global.clearImmediate : null;
	public decodeURI = typeof global !== undefined ? global.decodeURI : null;
	public decodeURIComponent = typeof global !== undefined ? global.decodeURIComponent : null;
	public encodeURI = typeof global !== undefined ? global.encodeURI : null;
	public encodeURIComponent = typeof global !== undefined ? global.encodeURIComponent : null;
	public escape = typeof global !== undefined ? global.escape : null;
	public eval = typeof global !== undefined ? global.eval : null;
	public global = typeof global !== undefined ? global.global : null;
	public isFinite = typeof global !== undefined ? global.isFinite : null;
	public isNaN = typeof global !== undefined ? global.isNaN : null;
	public parseFloat = typeof global !== undefined ? global.parseFloat : null;
	public parseInt = typeof global !== undefined ? global.parseInt : null;
	public process = typeof global !== undefined ? global.process : null;
	public root = typeof global !== undefined ? global.root : null;
	public setImmediate = typeof global !== undefined ? global.setImmediate : null;
	public queueMicrotask = typeof global !== undefined ? global.queueMicrotask : null;
	public undefined = typeof global !== undefined ? global.undefined : null;
	public unescape = typeof global !== undefined ? global.unescape : null;
	public gc = typeof global !== undefined ? global.gc : null;
	public v8debug = typeof global !== undefined ? global.v8debug : null;

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

		for (const className of Object.keys(HTMLElementClass)) {
			this[className] = HTMLElementClass[className];
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

	/**
	 * Fetch is not supported by the synchronous "Window". Use "AsyncWindow" instead to get support for fetch.
	 *
	 * @throws Error.
	 * @param _url URL to resource.
	 * @param [_options] Options.
	 * @returns Promise.
	 */
	public async fetch(_url: string, _options: object): Promise<void> {
		throw new Error(
			'Fetch is not supported by the synchronous "Window" from Happy DOM. Use "AsyncWindow" instead to get support for fetch.'
		);
	}
}
