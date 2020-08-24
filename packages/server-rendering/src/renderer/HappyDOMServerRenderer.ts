import {
	Element,
	HTMLTemplateElement,
	DocumentFragment,
	ShadowRoot,
	SelfClosingHTMLElements,
	UnclosedHTMLElements
} from 'happy-dom';
import ShadowRootRenderer from './shadow-root/ShadowRootRenderer';
import IHappyDOMServerRenderOptions from './IHappyDOMServerRenderOptions';
import HappyDOMServerRenderResult from './HappyDOMServerRenderResult';

/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default class HappyDOMServerRenderer {
	private renderOptions: IHappyDOMServerRenderOptions;
	private shadowRootRenderer: ShadowRootRenderer;

	/**
	 * Renders an element as HTML.
	 *
	 * @param [renderOptions] Render this.renderOptions.
	 */
	constructor(renderOptions: IHappyDOMServerRenderOptions = {}) {
		this.renderOptions = renderOptions;
		this.shadowRootRenderer = new ShadowRootRenderer(renderOptions);
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @return Result.
	 */
	public getOuterHTML(element: Element): HappyDOMServerRenderResult {
		const tagName = element.tagName.toLowerCase();
		const result = new HappyDOMServerRenderResult();

		if (UnclosedHTMLElements.includes(tagName)) {
			result.html = `<${tagName}${this.getAttributes(element)}>`;
		} else if (SelfClosingHTMLElements.includes(tagName)) {
			result.html = `<${tagName}${this.getAttributes(element)}/>`;
		} else {
			let innerElement: Element | ShadowRoot = element;
			let outerElement: Element | ShadowRoot = element;

			if (this.renderOptions.openShadowRoots && element instanceof Element && element.shadowRoot) {
				outerElement = this.shadowRootRenderer.getScopedClone(element);
				innerElement = outerElement.shadowRoot;
			}

			const innerHTML = this.getInnerHTML(innerElement).html;
			result.html = `<${tagName}${this.getAttributes(outerElement)}>${innerHTML}</${tagName}>`;
		}

		if (this.renderOptions.openShadowRoots) {
			result.css = this.shadowRootRenderer.getScopedCSS();
		}

		return result;
	}

	/**
	 * Renders an element as HTML.
	 *
	 * @param element Element to render.
	 * @return Result.
	 */
	public getInnerHTML(
		element: Element | DocumentFragment | ShadowRoot
	): HappyDOMServerRenderResult {
		const result = new HappyDOMServerRenderResult();
		const renderElement = (<HTMLTemplateElement>element).content || element;

		for (const child of renderElement.childNodes.slice()) {
			if (child instanceof Element) {
				result.html += this.getOuterHTML(child).html;
			} else {
				result.html += child.toString();
			}
		}

		if (this.renderOptions.openShadowRoots) {
			result.css = this.shadowRootRenderer.getScopedCSS();
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
