import ScopedCSSCache from './css/ScopedCSSCache';
import Element from '../../nodes/basic/element/Element';
import ShadowRoot from '../../nodes/basic/shadow-root/ShadowRoot';
import StyleScoper from './css/StyleScoper';
import IShadowRootRenderOptions from './IShadowRootRenderOptions';

/**
 * Scopes elements and CSS inside shadow roots.
 */
export default class ShadowRootScoper {
	private renderOptions: IShadowRootRenderOptions;
	private scopedCSSCache: ScopedCSSCache = new ScopedCSSCache();

	/**
	 * Renders an element as HTML.
	 *
	 * @param {IShadowRootRenderOptions} renderOptions Render this.renderOptions.
	 */
	constructor(renderOptions: IShadowRootRenderOptions) {
		this.renderOptions = renderOptions;
	}

	/**
	 * Clones an element and scopes it.
	 *
	 * @param {Element} element Element to render.
	 * @param {ScopedCSSCache} cssCache Options object.
	 * @param {IShadowRootRenderOptions} options Render options.
	 * @returns {Element} Element clone.
	 */
	public getScopedClone(element: Element): Element {
		const clone = <Element>element.cloneNode(true);
		this.extractAndScopeCSS(clone);
		this.moveChildNodesIntoSlots(clone);
		return clone;
	}

	/**
	 * Returns scoped CSS.
	 *
	 * @returns {string[]} CSS strings.
	 */
	public getScopedCSS(): string[] {
		return this.scopedCSSCache.getAllScoped();
	}

	/**
	 * Moves child nodes into shadow root slot elements.
	 *
	 * @param {Element} element Element.
	 */
	private moveChildNodesIntoSlots(element: Element): void {
		const slotChildren = {};
		const slots = Array.from(element.shadowRoot.querySelectorAll('slot'));

		for (let i = 0, max = element.children.length; i < max; i++) {
			const child = element.children[i];
			const name = child.getAttribute('slot') || 'default';
			slotChildren[name] = slotChildren[name] || [];
			slotChildren[name].push(child);
		}

		for (const slot of slots) {
			const name = slot.getAttribute('name') || 'default';
			if (slotChildren[name]) {
				for (const child of slotChildren[name]) {
					slot.parentNode.insertBefore(child, slot);
				}
				slot.parentNode.removeChild(slot);
			}
		}

		if (element.childNodes.length > 0) {
			// eslint-disable-next-line
            console.warn('Warning! Custom element "' + element.tagName +  '" did not have any matching slot for ' + element.childNodes.length + ' child node(s).');
			for (const child of Array.from(element.childNodes)) {
				element.removeChild(child);
			}
		}
	}

	/**
	 * Extracts CSS.
	 *
	 * @param {Element} element Element.
	 */
	private extractAndScopeCSS(element: Element): void {
		const options = this.renderOptions;
		const cache = this.scopedCSSCache;

		if (options.extractCSS && options.scopeCSS) {
			const css = this.extractCSS(element.shadowRoot);

			const scopeID = cache.getScopeID(css);
			let scopedCSS = cache.getScoped(css);

			if (!scopedCSS) {
				scopedCSS = StyleScoper.scope(css, scopeID, element.tagName);
				cache.setScoped(css, scopedCSS);
			}

			element.classList.add(scopeID);

			this.scopeChildElements(element.shadowRoot, scopeID);
		} else if (options.extractCSS) {
			const css = this.extractCSS(element.shadowRoot);
			cache.setScoped(css, css);
		} else if (options.scopeCSS) {
			const styles = Array.from(element.shadowRoot.querySelectorAll('style'));

			for (const style of styles) {
				const css = style.textContent;
				const scopeID = cache.getScopeID(css);

				element.classList.add(scopeID);
				style.textContent = StyleScoper.scope(css, scopeID, element.tagName);
				cache.setScoped(css, style.textContent);

				this.scopeChildElements(element.shadowRoot, scopeID);
			}
		}
	}

	/**
	 * Extracts CSS.
	 *
	 * @param {ShadowRoot} shadowRoot Shadow root.
	 * @return {string} CSS.
	 */
	private extractCSS(shadowRoot: ShadowRoot): string {
		const styles = Array.from(shadowRoot.querySelectorAll('style'));
		let css = '';

		for (const style of styles) {
			style.parentNode.removeChild(style);
			css += style.textContent;
		}

		return css;
	}

	/**
	 * Scopes an element by adding a unique id as a class to it and its children.
	 *
	 * @param {Element|ShadowRoot} element Element to scope.
	 * @param {string} id Unique ID.
	 */
	private scopeChildElements(element: Element | ShadowRoot, id: string): void {
		if (element instanceof Element) {
			element.classList.add(id);
		}

		if (element instanceof ShadowRoot || (element instanceof Element && element.tagName !== 'slot')) {
			for (let i = 0, max = element.children.length; i < max; i++) {
				const child = element.children[i];
				this.scopeChildElements(child, id);
			}
		}
	}
}
