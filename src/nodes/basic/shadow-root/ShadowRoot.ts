import DocumentFragment from '../document-fragment/DocumentFragment';
import HTMLParser from '../../../html-parser/HTMLParser';
import HTMLRenderer from '../../../html-renderer/HTMLRenderer';

/**
 * ShadowRoot.
 */
export default class ShadowRoot extends DocumentFragment {
	public mode = 'open';
	public _renderer: HTMLRenderer = null;

	/**
	 * Returns inner HTML.
	 *
	 * @return {string} HTML.
	 */
	public get innerHTML(): string {
		return HTMLRenderer.getInnerHTML(this);
	}

	/**
	 * Sets inner HTML.
	 *
	 * @param {string} html HTML.
	 * @return {string} HTML.
	 */
	public set innerHTML(html: string) {
		const root = HTMLParser.parse(this.ownerDocument, html);
		const childNodes = root.childNodes.length ? root.childNodes : [this.ownerDocument.createTextNode(html)];

		for (const child of childNodes.slice()) {
			this.appendChild(child);
		}
	}

	/**
	 * Converts to string.
	 *
	 * @return {string} String.
	 */
	public toString(): string {
		return this.innerHTML;
	}
}
