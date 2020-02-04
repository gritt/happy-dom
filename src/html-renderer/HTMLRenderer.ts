import Element from '../nodes/basic/element/Element';
import HTMLTemplateElement from '../nodes/elements/template/HTMLTemplateElement';
import SelfClosingElements from '../html-config/SelfClosingElements';
import UnclosedElements from '../html-config/UnclosedElements';

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class HTMLRenderer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @return Result.
	 */
	public static getOuterHTML(element: Element): string {
		const tagName = element.tagName.toLowerCase();

		if (UnclosedElements.includes(tagName)) {
			return `<${tagName}${this.getAttributes(element)}>`;
		} else if (SelfClosingElements.includes(tagName)) {
			return `<${tagName}${this.getAttributes(element)}/>`;
		}

		return `<${tagName}${this.getAttributes(element)}>${element.innerHTML}</${tagName}>`;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @returns Result.
	 */
	public static getInnerHTML(element): string {
		const renderElement = (<HTMLTemplateElement>element).content || element;
		let html = '';

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				html += child.outerHTML;
			} else {
				html += child.toString();
			}
		}

		return html;
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param element Element.
	 * @return Attributes.
	 */
	private static getAttributes(element: Element): string {
		const rawAttributes = element._getRawAttributes();
		return rawAttributes ? ' ' + rawAttributes : '';
	}
}
