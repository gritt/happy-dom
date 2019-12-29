import Element from '../../nodes/basic-types/element/Element';
import HTMLTemplateElement from '../../nodes/elements/template/HTMLTemplateElement';
import DocumentFragment from '../../nodes/basic-types/document-fragment/DocumentFragment';
import ShadowRootScoper from './ShadowRootScoper';
import IShadowRootRenderOptions from './IShadowRootRenderOptions';
import HTMLRenderResult from '../HTMLRenderResult';
import ShadowRoot from '../../nodes/basic-types/shadow-root/ShadowRoot';
import IHTMLRenderer from '../IHTMLRenderer';

const SELF_CLOSED_REGEXP = /^(img|br|hr|area|base|input|doctype|link)$/i;
const META_REGEXP = /^meta$/i;

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class ShadowRootRenderer implements IHTMLRenderer {
	private renderOptions: IShadowRootRenderOptions;
	private shadowRootScoper: ShadowRootScoper;

	/**
	 * Renders an element as HTML.
	 *
	 * @param {IShadowRootRenderOptions} [renderOptions] Render this.renderOptions.
	 */
	constructor(renderOptions: IShadowRootRenderOptions = {}) {
		this.renderOptions = renderOptions;
		this.shadowRootScoper = new ShadowRootScoper(renderOptions);
	}

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
			let innerElement: Element | ShadowRoot = element;
			let outerElement: Element | ShadowRoot = element;

			if (this.renderOptions.openShadowRoots && element instanceof Element && element.shadowRoot) {
				outerElement = this.shadowRootScoper.getScopedClone(element);
				innerElement = outerElement.shadowRoot;
			}

			const innerHTML = this.getInnerHTML(innerElement).html;
			result.html = `<${tagName}${this.getAttributes(outerElement)}>${innerHTML}</${tagName}>`;
		}

		if (this.renderOptions.openShadowRoots) {
			result.css = this.shadowRootScoper.getScopedCSS();
		}

		return result;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element|DocumentFragment|ShadowRoot} element Element to render.
	 * @return {HTMLRenderResult} Result.
	 */
	public getInnerHTML(element: Element | DocumentFragment | ShadowRoot): HTMLRenderResult {
		const result = new HTMLRenderResult();
		const renderElement = (<HTMLTemplateElement>element).content || element;

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				result.html += this.getOuterHTML(child).html;
			} else {
				result.html += child.toString();
			}
		}

		if (this.renderOptions.openShadowRoots) {
			result.css = this.shadowRootScoper.getScopedCSS();
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
