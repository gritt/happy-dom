import VM from 'vm';
import { AsyncWindow } from 'happy-dom';
import HappyDOMServerRenderer from '../renderer/HappyDOMServerRenderer';
import HappyDOMServerRenderResult from '../renderer/HappyDOMServerRenderResult';

/**
 * This class is used for rendering a script server side.
 */
export default class HappyDOMContext {
	private context: VM.Context = this.createContext();

	/**
	 * Returns route HTML.
	 *
	 * @param options Options.
	 * @param options.html HTML.
	 * @param [options.scripts] Scripts.
	 * @param [options.pageURL] Page URL.
	 * @param [options.customElements] Custom elements (web component) specific options.
	 * @param [options.customElements.openShadowRoots] Set to "true" to open up shadow roots.
	 * @param [options.customElements.extractCSS] Set to "true" to extract CSS when opening shadow roots.
	 * @param [options.customElements.scopeCSS] Set to "true" to enable scoping of CSS when opening shadow roots.
	 * @param [options.customElements.applyCSSToHead] Set to "true" to extract the CSS and add it to the document head.
	 * @return Render result.
	 */
	public async render({
		html = null,
		scripts = null,
		pageURL = null,
		customElements = {
			openShadowRoots: false,
			extractCSS: false,
			scopeCSS: false,
			addCSSToHead: false
		}
	}: {
		html: string;
		scripts: VM.Script[];
		pageURL?: string;
		customElements?: {
			openShadowRoots: boolean;
			extractCSS: boolean;
			scopeCSS: boolean;
			addCSSToHead: boolean;
		};
	}): Promise<HappyDOMServerRenderResult> {
		return new Promise((resolve, reject) => {
			const window = this.context.window;
			const document = this.context.document;
			const renderer = new HappyDOMServerRenderer({
				openShadowRoots: customElements.openShadowRoots,
				extractCSS: customElements.extractCSS || customElements.addCSSToHead,
				scopeCSS: customElements.scopeCSS
			});

			window
				.whenAsyncComplete()
				.then(() => {
					if (customElements.addCSSToHead) {
						resolve(
							this.getResultWithCssAddedToHead(renderer.getOuterHTML(document.documentElement))
						);
					} else {
						resolve(renderer.getOuterHTML(document.documentElement));
					}
				})
				.catch(reject);

			if (pageURL) {
				window.location.href = pageURL;
			}

			if (scripts) {
				for (const script of scripts) {
					script.runInContext(this.context);
				}
			}

			document.open();
			document.write(html);
			document.close();
		});
	}

	/**
	 * Disposes the render.
	 */
	public dispose(): void {
		this.context.window.dispose();
		this.context.dispose();
	}

	/**
	 * Creates a context.
	 *
	 * @return Context.
	 */
	private createContext(): VM.Context {
		return VM.createContext(new AsyncWindow());
	}

	/**
	 * Returns a new result with CSS added as a style tag to the document head.
	 *
	 * @param result Result.
	 * @return New result.
	 */
	private getResultWithCssAddedToHead(
		result: HappyDOMServerRenderResult
	): HappyDOMServerRenderResult {
		const styleTag = `
			<style>
				${result.css.join('\n')}
			</style>
		`.trim();
		return {
			html: result.html.replace('</head>', `${styleTag}</head>`),
			css: result.css
		};
	}
}
