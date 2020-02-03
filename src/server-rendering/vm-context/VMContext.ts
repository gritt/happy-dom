import VM from 'vm';
import AsyncWindow from '../../window/AsyncWindow';
import ShadowRootRenderer from '../shadow-root/ShadowRootRenderer';
import ShadowRootRenderResult from '../shadow-root/ShadowRootRenderResult';

/**
 * This class is used for rendering a script server side.
 */
export default class VMContext {
	private context: VM.Context = this.createContext();

	/**
	 * Returns route HTML.
	 *
	 * @param options Options.
	 * @param options.html HTML.
	 * @param [options.script] Script.
	 * @param [options.url] Page URL.
	 * @param [options.openShadowRoots=false] Set to "true" to open up shadow roots.
	 * @param [options.extractCSS=true] Set to "true" to extract CSS when opening shadow roots.
	 * @param [options.scopeCSS=true] Set to "true" to enable scoping of CSS when opening shadow roots.
	 * @return HTML.
	 */
	public async render(options: {
		html: string;
		script: VM.Script;
		url?: string;
		openShadowRoots: boolean;
		extractCSS: boolean;
		scopeCSS: boolean;
	}): Promise<ShadowRootRenderResult> {
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
	 * @return Context.
	 */
	private createContext(): VM.Context {
		return VM.createContext(new AsyncWindow());
	}
}
