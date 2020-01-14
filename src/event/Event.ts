import Node from '../nodes/basic/node/Node';
import IEventInit from './IEventInit';

export default class Event {
	public readonly composed: boolean = false;
	public readonly currentTarget: Node = null;
	public readonly target: Node = null;
	public bubbles = false;
	public cancelable = false;
	public defaultPrevented = false;
	public _immediatePropagationStopped = false;
	public _propagationStopped = false;
	public type: string = null;

	/**
	 * Constructor.
	 *
	 * @param {string} type Event type.
	 * @param {IEventInit} eventInit Event init.
	 */
	constructor(type: string, eventInit: IEventInit = null) {
		this.type = type;
		this.bubbles = eventInit && eventInit.bubbles ? true : false;
		this.cancelable = eventInit && eventInit.cancelable ? true : false;
		this.composed = eventInit && eventInit.composed ? true : false;
	}

	/**
	 * Init event.
	 *
	 * @legacy
	 * @param {string} type Type.
	 * @param {boolean} [bubbles=false] "true" if it bubbles.
	 * @param {boolean} [cancelable=false] "true" if it cancelable.
	 */
	public initEvent(type: string, bubbles = false, cancelable = false): void {
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
	}

	/**
	 * Prevents default.
	 */
	public preventDefault(): void {
		this.defaultPrevented = true;
	}

	/**
	 * Stops immediate propagation.
	 */
	public stopImmediatePropagation(): void {
		this._immediatePropagationStopped = true;
	}

	/**
	 * Stops propagation.
	 */
	public stopPropagation(): void {
		this._propagationStopped = true;
	}
}
