import Element from '../nodes/basic-types/element/Element';
import HTMLRenderResult from './HTMLRenderResult';
/**
 * Utility for converting an element to string.
 *
 * @class QuerySelector
 */
export default interface IHTMLRenderer {

	/**
	 * Renders an element as HTML.
	 *
	 * @param {Element} element Element to render.
	 * @return {HTMLRenderResult} Result.
	 */
	getOuterHTML(element: Element): HTMLRenderResult;

	/**
	 * Renders an element as HTML.
	 * 
	 * @param {Element} element Element to render.
	 * @return {HTMLRenderResult} Result.
	 */
	getInnerHTML(element: Element): HTMLRenderResult;
}
