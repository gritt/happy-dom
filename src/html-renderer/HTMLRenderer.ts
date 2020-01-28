import Element from '../nodes/basic/element/Element';
import HTMLTemplateElement from '../nodes/elements/template/HTMLTemplateElement';
const SELF_CLOSED_REGEXP = /^(img|br|hr|area|base|input|doctype|link)$/i;
const META_REGEXP = /^meta$/i;

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class HTMLRenderer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to render.
	 * @return {string} Result.
	 */
	public static getOuterHTML(element: Element): string {
		const tagName = element.tagName.toLowerCase();
		const isUnClosed = META_REGEXP.test(tagName);
		const isSelfClosed = SELF_CLOSED_REGEXP.test(tagName);

		if (isUnClosed) {
			return `<${tagName}${this.getAttributes(element)}>`;
		} else if (isSelfClosed) {
			return `<${tagName}${this.getAttributes(element)}/>`;
		}

		return `<${tagName}${this.getAttributes(element)}>${element.innerHTML}</${tagName}>`;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to render.
	 * @return {HTMLRenderResult} Result.
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
	 * @param {Element} element Element.
	 * @return {string} Attributes.
	 */
	private static getAttributes(element: Element): string {
		const rawAttributes = element._getRawAttributes();
		return rawAttributes ? ' ' + rawAttributes : '';
	}
}
