import VM from 'vm';
import {AsyncWindow} from 'happy-dom';
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
	 * @param [options.openShadowRoots] Set to "true" to open up shadow roots.
	 * @param [options.extractCSS] Set to "true" to extract CSS when opening shadow roots.
	 * @param [options.scopeCSS] Set to "true" to enable scoping of CSS when opening shadow roots.
	 * @return Render result.
	 */
	public async render(options: {
		html: string;
		scripts: VM.Script[];
		pageURL?: string;
		openShadowRoots: boolean;
		extractCSS: boolean;
		scopeCSS: boolean;
	}): Promise<HappyDOMServerRenderResult> {
		return new Promise((resolve, reject) => {
			const window = this.context.window;
			const document = this.context.document;
			const renderer = new HappyDOMServerRenderer({
				openShadowRoots: options.openShadowRoots,
				extractCSS: options.extractCSS,
				scopeCSS: options.scopeCSS
			});

			window
				.whenAsyncComplete()
				.then(() => resolve(renderer.getOuterHTML(document.documentElement)))
				.catch(reject);

			if (options.pageURL) {
				window.location.href = options.pageURL;
			}

			if(options.scripts) {
				for(const script of options.scripts) {
					script.runInContext(this.context);
				}
			}

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
