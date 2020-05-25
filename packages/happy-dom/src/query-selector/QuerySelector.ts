import Element from '../nodes/basic/element/Element';
import Node from '../nodes/basic/node/Node';
import SelectorItem from './SelectorItem';

/**
 * Utility for query selection in a Node.
 *
 * @class QuerySelector
 */
export default class QuerySelector {
	/**
	 * Finds elements based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML elements.
	 */
	public static querySelectorAll(node: Node, selector: string): Element[] {
		let matched = [];

		for (const part of selector.split(',')) {
			const foundElements = this.querySelectorAllForPart(node, part.trim());
			if (foundElements) {
				matched = matched.concat(foundElements);
			}
		}

		return matched;
	}

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @return HTML element.
	 */
	public static querySelector(node: Node, selector: string): Element {
		for (const part of selector.split(',')) {
			const foundElement = this.querySelectorForPart(node, part.trim());
			if (foundElement) {
				return foundElement;
			}
		}
		return null;
	}

	/**
	 * Finds elements based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML elements.
	 */
	private static querySelectorAllForPart(node: Node, selector: string): Element[] {
		const parts = selector.split(' ');
		const selectorItem = new SelectorItem(parts[0]);
		let matched = [];

		for (const child of node.childNodes) {
			if (child instanceof Element) {
				if (selectorItem.match(child)) {
					if (parts.length === 1) {
						matched.push(child);
					} else {
						matched = matched.concat(this.querySelectorAllForPart(child, parts.slice(1).join(' ')));
					}
				}

				matched = matched.concat(this.querySelectorAllForPart(child, selector));
			}
		}

		return matched;
	}

	/**
	 * Finds an element based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @return HTML element.
	 */
	private static querySelectorForPart(node: Node, selector: string): Element {
		const parts = selector.split(' ');
		const selectorItem = new SelectorItem(parts.shift());

		for (const child of node.childNodes) {
			if (child instanceof Element) {
				if (selectorItem.match(child)) {
					if (parts.length === 0) {
						return child;
					} else {
						return this.querySelectorForPart(child, parts.join(' '));
					}
				}

				const childSelector = this.querySelectorForPart(child, selector);
				if (childSelector) {
					return childSelector;
				}
			}
		}

		return null;
	}
}
