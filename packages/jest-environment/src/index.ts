import VM from 'vm';
import * as JestUtil from 'jest-util';
import { ModuleMocker } from 'jest-mock';
import { LegacyFakeTimers, ModernFakeTimers } from '@jest/fake-timers';
import { JestEnvironment, EnvironmentContext } from '@jest/environment';
import { Window } from 'happy-dom';
import { Script } from 'vm';
import { Global, Config } from '@jest/types';

/**
 * Happy DOM Jest Environment.
 */
export default class HappyDOMEnvironment implements JestEnvironment {
	public fakeTimers: LegacyFakeTimers<number> = null;
	public fakeTimersModern: ModernFakeTimers = null;
	public global: Global.Global = <Global.Global>(<undefined>new Window());
	public moduleMocker: ModuleMocker = new ModuleMocker(<NodeJS.Global>this.global);
	private context: VM.Context = VM.createContext(this.global);

	/**
	 * Constructor.
	 *
	 * @param {Config} config Jest config.
	 * @param {EnvironmentContext} options Options.
	 */
	constructor(config: Config.ProjectConfig, options: EnvironmentContext = {}) {
		const global = this.global;

		// Node's error-message stack size is limited to 10, but it's pretty useful
		// to see more than that when a test fails.
		global.Error.stackTraceLimit = 100;

		JestUtil.installCommonGlobals(this.global, config.globals);

		if (options.console) {
			global.console = options.console;
			global.window.console = options.console;
		}

		this.fakeTimers = new LegacyFakeTimers({
			config,
			global,
			moduleMocker: this.moduleMocker,
			timerConfig: {
				idToRef: (id: number) => id,
				refToId: (ref: number) => ref
			}
		});

		this.fakeTimersModern = new ModernFakeTimers({
			config,
			global
		});
	}

	/**
	 * Setup.
	 *
	 * @return {Promise<void>} Promise.
	 */
	public async setup(): Promise<void> {}

	/**
	 * Teardown.
	 *
	 * @return {Promise<void>} Promise.
	 */
	public async teardown(): Promise<void> {
		this.fakeTimers.dispose();
		this.fakeTimersModern.dispose();
		this.global.dispose();

		this.global = null;
		this.context = null;
		this.moduleMocker = null;
		this.fakeTimers = null;
		this.fakeTimersModern = null;
	}

	/**
	 * Runs a script.
	 *
	 * @param {Script} script Script.
	 * @returns {any} Result.
	 */
	public runScript(script: Script): null {
		return script.runInContext(this.context);
	}

	/**
	 * Returns the VM context.
	 *
	 * @return {VM.Context} Context.
	 */
	public getVmContext(): VM.Context {
		return this.context;
	}
}
