import VM from 'vm';
import AsyncWindow from '../AsyncWindow';
import ShadowRootRenderer from '../html-renderer/shadow-root/ShadowRootRenderer';
import HTMLRenderResult from 'src/html-renderer/HTMLRenderResult';

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
	 * @return {Promise<HTMLRenderResult>} HTML.
	 */
	public async render(options: {
		html: string;
		script: VM.Script;
		url?: string;
		openShadowRoots: boolean;
		extractCSS: boolean;
		scopeCSS: boolean;
	}): Promise<HTMLRenderResult> {
		return new Promise((resolve, reject) => {
			const window = this.context.window;
			const document = this.context.document;
			const renderer = new ShadowRootRenderer({
				openShadowRoots: options.openShadowRoots,
				extractCSS: options.extractCSS,
				scopeCSS: options.scopeCSS
			});

			window
				.whenAsyncComplete()
				.then(() => resolve(renderer.getOuterHTML(document.documentElement)))
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
