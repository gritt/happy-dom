import Element from '../nodes/basic/element/Element';

const ATTRIBUTE_REGEXP = /\[([^ =]*) *=[ "]*([^\]"]*)[ "]*\]|\[([^\]]*)\]/g;
const CLASS_REGEXP = /\.([^\[(.]*)/g;
const TAG_NAME_REGEXP = /^[a-zA-Z-]+/;

export default class SelectorItem {
	public isAll: boolean;
	public isID: boolean;
	public isAttribute: boolean;
	public isClass: boolean;
	public isTagName: boolean;
	private tagName = null;
	private part: string;
	private id: string;

	/**
	 * Constructor.
	 *
	 * @param part Part.
	 */
	constructor(part: string) {
		this.isAll = part === '*';
		this.isID = !this.isAll ? part.startsWith('#') : false;
		this.isAttribute = !this.isAll && !this.isID && new RegExp(ATTRIBUTE_REGEXP, 'g').test(part);
		this.isClass = !this.isAll && !this.isID && new RegExp(CLASS_REGEXP, 'g').test(part);
		this.tagName = !this.isAll && !this.isID ? part.match(TAG_NAME_REGEXP) : null;
		this.tagName = this.tagName ? this.tagName[0].toUpperCase() : null;
		this.isTagName = this.tagName !== null;
		this.part = part;
		this.id = !this.isAll && this.isID ? this.part.replace('#', '') : null;
	}

	/**
	 * Matches a selector part against an element.
	 *
	 * @param element HTML element.
	 * @return TRUE if matching.
	 */
	public match(element: Element): boolean {
		const part = this.part;
		let match;

		// Is all (*)
		if (this.isAll) {
			return true;
		}

		// ID Match
		if (this.isID) {
			return this.id === element.id;
		}

		// Attribute match
		if (this.isAttribute) {
			const attributeRegexp = new RegExp(ATTRIBUTE_REGEXP, 'g');

			while ((match = attributeRegexp.exec(part))) {
				if (
					(match[3] && element._attributesMap[match[3]] === undefined) ||
					(match[1] && match[2] && element._attributesMap[match[1]] !== match[2].replace(/"/g, ''))
				) {
					return false;
				}
			}
		}

		// Class match
		if (this.isClass) {
			const classRegexp = new RegExp(CLASS_REGEXP, 'g');

			while ((match = classRegexp.exec(part))) {
				if (!element.classList.contains(match[1])) {
					return false;
				}
			}
		}

		// Tag name match
		if (this.isTagName) {
			if (this.tagName !== element.tagName) {
				return false;
			}
		}

		return true;
	}
}
