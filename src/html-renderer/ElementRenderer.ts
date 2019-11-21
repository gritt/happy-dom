import Element from '../nodes/basic-types/element/Element';
import HTMLTemplateElement from '../nodes/elements/template/HTMLTemplateElement';
import DocumentFragment from '../nodes/basic-types/document-fragment/DocumentFragment';
import ShadowRootScoper from './ShadowRootScoper';
import IElementRenderOptions from './IElementRenderOptions';
import ElementRenderResult from './ElementRenderResult';
import ScopedCSSCache from './ScopedCSSCache';
import ShadowRoot from '../nodes/basic-types/shadow-root/ShadowRoot';

const SELF_CLOSED_REGEXP = /^(img|br|hr|area|base|input|doctype|link)$/i;
const META_REGEXP = /^meta$/i;

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class ElementRenderer {
	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to convert.
	 * @param {IElementRenderOptions} [options] Render options.
	 * @param {ScopedCSSCache} [scopedCSSCache] Scoped CSS cache.
	 * @return {ElementRenderResult} Result.
	 */
	public static renderOuterHTML(
		element: Element,
		options: IElementRenderOptions = {},
		scopedCSSCache: ScopedCSSCache = null
	): ElementRenderResult {
		const tagName = element.tagName.toLowerCase();
		const isUnClosed = META_REGEXP.test(tagName);
		const isSelfClosed = SELF_CLOSED_REGEXP.test(tagName);
		const result = new ElementRenderResult();

		if (isUnClosed) {
			result.html = `<${tagName}${this.getAttributes(element)}>`;
		} else if (isSelfClosed) {
			result.html = `<${tagName}${this.getAttributes(element)}/>`;
		} else {
			let innerElement: Element | ShadowRoot = element;
			let outerElement: Element | ShadowRoot = element;

			if (options.openShadowRoots && element instanceof Element && element.shadowRoot) {
				scopedCSSCache = scopedCSSCache || new ScopedCSSCache();
				outerElement = ShadowRootScoper.scopeElement(element, scopedCSSCache, options);
				innerElement = ShadowRootScoper.scopeElement(element, scopedCSSCache, options).shadowRoot;
			}
			
			const innerHTML = this.renderInnerHTML(innerElement, options, scopedCSSCache).html;
			result.html = `<${tagName}${this.getAttributes(outerElement)}>${innerHTML}</${tagName}>`;
		}

		if (scopedCSSCache) {
			result.extractedCSS = scopedCSSCache.getAllExtractedCSS();
			result.scopedCSS = scopedCSSCache.getAllScopedCSS();
		}

		return result;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element|DocumentFragment|ShadowRoot} element Element to convert.
	 * @param {IElementRenderOptions} [options] Render options.
	 * @param {ScopedCSSCache} [scopedCSSCache] Scoped CSS cache.
	 * @return {ElementRenderResult} Result.
	 */
	public static renderInnerHTML(
		element: Element | DocumentFragment | ShadowRoot,
		options: IElementRenderOptions = {},
		scopedCSSCache: ScopedCSSCache = null
	): ElementRenderResult {
		const result = new ElementRenderResult();
		let renderElement = (<HTMLTemplateElement>element).content || element;

		if (options.openShadowRoots && !scopedCSSCache) {
			scopedCSSCache = new ScopedCSSCache();
		}

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				result.html += this.renderOuterHTML(child, options, scopedCSSCache).html;
			} else {
				result.html += child.toString();
			}
		}

		if (scopedCSSCache) {
			result.extractedCSS = scopedCSSCache.getAllExtractedCSS();
			result.scopedCSS = scopedCSSCache.getAllScopedCSS();
		}

		return result;
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
