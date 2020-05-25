import Node from '../node/Node';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';

/**
 * CommentNode.
 */
export default class CommentNode extends Node {
	public nodeType = Node.COMMENT_NODE;
	protected _textContent: string;

	/**
	 * Converts to string.
	 *
	 * @return String.
	 */
	public toString(): string {
		return '<!--' + this._textContent + '-->';
	}

	/**
	 * Node name.
	 *
	 * @return Node name.
	 */
	public get nodeName(): string {
		return '#comment';
	}

	/**
	 * Returns text content.
	 *
	 * @return Text content.
	 */
	public get textContent(): string {
		return this._textContent;
	}

	/**
	 * Sets text content.
	 *
	 * @param textContent Text content.
	 */
	public set textContent(textContent: string) {
		const oldValue = this._textContent;
		this._textContent = textContent;

		// MutationObserver
		if (this._observers.length > 0) {
			for (const observer of this._observers) {
				if (observer.options.characterData) {
					const record = new MutationRecord();
					record.type = MutationTypeConstant.characterData;
					record.oldValue = observer.options.characterDataOldValue ? oldValue : null;
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Returns node value.
	 *
	 * @return Node value.
	 */
	public get nodeValue(): string {
		return this._textContent;
	}

	/**
	 * Sets node value.
	 *
	 * @param nodeValue Node value.
	 */
	public set nodeValue(nodeValue: string) {
		this.textContent = nodeValue;
	}

	/**
	 * Returns data.
	 *
	 * @return Data.
	 */
	public get data(): string {
		return this._textContent;
	}

	/**
	 * Sets data.
	 *
	 * @param data Data.
	 */
	public set data(nodeValue: string) {
		this.textContent = nodeValue;
	}
}
