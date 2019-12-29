import Element from '../../nodes/basic-types/element/Element';
import HTMLTemplateElement from '../../nodes/elements/template/HTMLTemplateElement';
import HTMLRenderResult from '../HTMLRenderResult';
import IHTMLRenderer from '../IHTMLRenderer';
const SELF_CLOSED_REGEXP = /^(img|br|hr|area|base|input|doctype|link)$/i;
const META_REGEXP = /^meta$/i;

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class ElementRenderer implements IHTMLRenderer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to render.
	 * @return {HTMLRenderResult} Result.
	 */
	public getOuterHTML(element: Element): HTMLRenderResult {
		const tagName = element.tagName.toLowerCase();
		const isUnClosed = META_REGEXP.test(tagName);
		const isSelfClosed = SELF_CLOSED_REGEXP.test(tagName);
		const result = new HTMLRenderResult();

		if (isUnClosed) {
			result.html = `<${tagName}${this.getAttributes(element)}>`;
		} else if (isSelfClosed) {
			result.html = `<${tagName}${this.getAttributes(element)}/>`;
		} else {
			result.html = `<${tagName}${this.getAttributes(element)}>${element.innerHTML}</${tagName}>`;
		}

		return result;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to render.
	 * @return {HTMLRenderResult} Result.
	 */
	public getInnerHTML(element): HTMLRenderResult {
		const result = new HTMLRenderResult();
		const renderElement = (<HTMLTemplateElement>element).content || element;

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				result.html += child.outerHTML;
			} else {
				result.html += child.toString();
			}
		}

		return result;
	}

	/**
	 * Returns attributes as a string.
	 *
	 * @param {Element} element Element.
	 * @return {string} Attributes.
	 */
	private getAttributes(element: Element): string {
		const rawAttributes = element._getRawAttributes();
		return rawAttributes ? ' ' + rawAttributes : '';
	}
}
