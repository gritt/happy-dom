import Node from '../nodes/basic/node/Node';
import NodeFilter from './NodeFilter';

/**
 * The TreeWalker object represents the nodes of a document subtree and a position within them.
 */
export default class TreeWalker {
	public root: Node = null;
	public whatToShow = -1;
	public filter: (node: Node) => number = null;
	public currentNode: Node = null;

	/**
	 * Constructor.
	 *
	 * @param root Root.
	 * @param [whatToShow] What to show.
	 * @param [filter] Filter.
	 */
	constructor(root: Node, whatToShow = -1, filter: (node: Node) => number = null) {
		if (!(root instanceof Node)) {
			throw new Error('Parameter 1 was not of type Node.');
		}

		this.root = root;
		this.whatToShow = whatToShow;
		this.filter = filter;
		this.currentNode = root;
	}

	/**
	 * Moves the current Node to the first visible ancestor node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @return Current node.
	 */
	public parentNode(): Node {
		if (this.currentNode !== this.root && this.currentNode && this.currentNode.parentNode) {
			this.currentNode = this.currentNode.parentNode;
			return this.currentNode;
		}
		return null;
	}

	/**
	 * Moves the current Node to the first visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, returns null and the current node is not changed.
	 *
	 * @return Current node.
	 */
	public firstChild(): Node {
		const childNodes = this.currentNode ? this.currentNode.childNodes : [];

		if (childNodes.length > 0) {
			this.currentNode = childNodes[0];
			return this.filterNode(this.currentNode) ? this.currentNode : this.firstChild();
		}

		return null;
	}

	/**
	 * Moves the current Node to the last visible child of the current node, and returns the found child. It also moves the current node to this child. If no such child exists, null is returned and the current node is not changed.
	 *
	 * @return Current node.
	 */
	public lastChild(): Node {
		const childNodes = this.currentNode ? this.currentNode.childNodes : [];

		if (childNodes.length > 0) {
			this.currentNode = childNodes[childNodes.length - 1];
			return this.filterNode(this.currentNode) ? this.currentNode : this.lastChild();
		}

		return null;
	}

	/**
	 * Moves the current Node to its previous sibling, if any, and returns the found sibling. If there is no such node, return null and the current node is not changed.
	 *
	 * @return Current node.
	 */
	public previousSibling(): Node {
		if (this.currentNode !== this.root && this.currentNode) {
			const siblings = this.currentNode.parentNode.childNodes;
			const index = siblings.indexOf(this.currentNode);

			if (index > 0) {
				this.currentNode = siblings[index - 1];
				return this.filterNode(this.currentNode) ? this.currentNode : this.previousSibling();
			}
		}

		return null;
	}

	/**
	 * Moves the current Node to its next sibling, if any, and returns the found sibling. If there is no such node, null is returned and the current node is not changed.
	 *
	 * @return Current node.
	 */
	public nextSibling(): Node {
		if (this.currentNode !== this.root && this.currentNode) {
			const siblings = this.currentNode.parentNode.childNodes;
			const index = siblings.indexOf(this.currentNode);

			if (index + 1 < siblings.length) {
				this.currentNode = siblings[index + 1];
				return this.filterNode(this.currentNode) ? this.currentNode : this.nextSibling();
			}
		}

		return null;
	}

	/**
	 * Moves the current Node to the next visible node in the document order.
	 *
	 * @return Current node.
	 */
	public nextNode(): Node {
		if (!this.firstChild()) {
			while (!this.nextSibling() && this.parentNode()) {}
			this.currentNode = this.currentNode === this.root ? null : this.currentNode || null;
		}
		return this.currentNode;
	}

	/**
	 * Moves the current Node to the previous visible node in the document order, and returns the found node. It also moves the current node to this one. If no such node exists, or if it is before that the root node defined at the object construction, returns null and the current node is not changed.
	 *
	 * @return Current node.
	 */
	public previousNode(): Node {
		while (!this.previousSibling() && this.parentNode()) {}
		this.currentNode = this.currentNode === this.root ? null : this.currentNode || null;
		return this.currentNode;
	}

	/**
	 * Filters a node.
	 *
	 * @param node Node.
	 * @return Child nodes.
	 */
	private filterNode(node: Node): boolean {
		return this.filterWhatToShow(node) && (!this.filter || this.filter(node) === NodeFilter.FILTER_ACCEPT);
	}

	/**
	 * Filters what to show.
	 *
	 * @param node Node.
	 * @return TRUE if the element should be shown.
	 */
	private filterWhatToShow(node: Node): boolean {
		return this.whatToShow === NodeFilter.SHOW_ALL || !((1 << node.nodeType) & this.whatToShow);
	}
}
