import VM from 'vm';
import AsyncWindow from '../AsyncWindow';
import ElementRenderer from '../html-renderer/ElementRenderer';
import ElementRenderResult from 'src/html-renderer/ElementRenderResult';

/**
 * This class is used for rendering a script server side.
 */
export default class VMContext {
	private context: VM.Context = this.createContext();

	/**
	 * Returns route HTML.
	 *
	 * @param {object} options Options.
	 * @param {string} options.html HTML.
	 * @param {VM.Script} [options.script] Script.
	 * @param {string} [options.url] Page URL.
	 * @param {boolean} [options.openShadowRoots=false] Set to "true" to open up shadow roots.
	 * @param {boolean} [options.extractCSS=true] Set to "true" to extract CSS when opening shadow roots.
	 * @param {boolean} [options.scopeCSS=true] Set to "true" to enable scoping of CSS when opening shadow roots.
	 * @return {Promise<ElementRenderResult>} HTML.
	 */
	public async render(options: {
		html: string;
		script: VM.Script;
		url?: string;
		openShadowRoots: boolean;
		extractCSS: boolean;
		scopeCSS: boolean;
	}): Promise<ElementRenderResult> {
		return new Promise((resolve, reject) => {
			const window = this.context.window;
			const document = this.context.document;

			window
				.whenAsyncComplete()
				.then(() => {
					const result = ElementRenderer.renderOuterHTML(document.documentElement, {
						openShadowRoots: options.openShadowRoots,
						extractCSS: options.extractCSS,
						scopeCSS: options.scopeCSS
					});
					resolve(result);
				})
				.catch(reject);

			if (options.url) {
				window.location.href = options.url;
			}

			options.script.runInContext(this.context);

			document.write(options.html);
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
	 * @return {VM.Context} Context.
	 */
	private createContext(): VM.Context {
		return VM.createContext(new AsyncWindow());
	}
}
