import HTMLElement from '../src/nodes/basic/html-element/HTMLElement';

/**
 * CustomElement test class.
 */
export default class CustomElement extends HTMLElement {
	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * Executed the component is attached to the DOM.
	 */
	public connectedCallback(): void {
		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                div {
                    color: red;
                }
                .class1 {
                    color: blue;
                }
                .class1.class2 span {
                    color: green;
                }
                .class1[attr1="value1"] {
                    color: yellow;
                }
                [attr1="value1"] {
                    color: yellow;
                }
            </style>
            <div>
                <span>
                    Some text.
                </span>
            </div>
        `;
	}
}
