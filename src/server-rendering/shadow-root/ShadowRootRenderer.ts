import Element from '../../nodes/basic/element/Element';
import HTMLTemplateElement from '../../nodes/elements/template/HTMLTemplateElement';
import DocumentFragment from '../../nodes/basic/document-fragment/DocumentFragment';
import ShadowRootScoper from './ShadowRootScoper';
import IShadowRootRenderOptions from './IShadowRootRenderOptions';
import ShadowrootRenderResult from './ShadowRootRenderResult';
import ShadowRoot from '../../nodes/basic/shadow-root/ShadowRoot';
import SelfClosingElements from '../../html-config/SelfClosingElements';
import UnclosedElements from '../../html-config/UnclosedElements';

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class ShadowRootRenderer {
	private renderOptions: IShadowRootRenderOptions;
	private shadowRootScoper: ShadowRootScoper;

	/**
	 * Renders an element as HTML.
	 *
	 * @param [renderOptions] Render this.renderOptions.
	 */
	constructor(renderOptions: IShadowRootRenderOptions = {}) {
		this.renderOptions = renderOptions;
		this.shadowRootScoper = new ShadowRootScoper(renderOptions);
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @return Result.
	 */
	public getOuterHTML(element: Element): ShadowrootRenderResult {
		const tagName = element.tagName.toLowerCase();
		const result = new ShadowrootRenderResult();

		if (UnclosedElements.includes(tagName)) {
			result.html = `<${tagName}${this.getAttributes(element)}>`;
		} else if (SelfClosingElements.includes(tagName)) {
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
	 * @param element Element to render.
	 * @return Result.
	 */
	public getInnerHTML(element: Element | DocumentFragment | ShadowRoot): ShadowrootRenderResult {
		const result = new ShadowrootRenderResult();
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
	 * @param element Element.
	 * @return Attributes.
	 */
	private getAttributes(element: Element): string {
		const rawAttributes = element._getRawAttributes();
		return rawAttributes ? ' ' + rawAttributes : '';
	}
}
