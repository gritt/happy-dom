import Window from '../../lib/Window';
import MutationObserver from '../../lib/mutation-observer/MutationObserver';

describe('MutationObserver', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('observe()', () => {
		test('Observes attributes.', () => {
			let records = [];
			const div = document.createElement('div');
			const observer = new MutationObserver(mutationRecords => {
				records = mutationRecords;
			});
			observer.observe(div, { attributes: true });
			div.setAttribute('attr', 'value');
			expect(records).toEqual([{
				"addedNodes": [],
				"attributeName": "attr",
				"attributeNamespace": null,
				"nextSibling": null,
				"oldValue": null,
				"previousSibling": null,
				"removedNodes": [],
				"target": null,
				"type": "attributes",
			}]);
		});

		test('Observes attributes and old attribute values.', () => {
			let records = [];
			const div = document.createElement('div');
			const observer = new MutationObserver(mutationRecords => {
				records = mutationRecords;
			});
			div.setAttribute('attr', 'old');
			observer.observe(div, { attributeOldValue: true, attributes: true });
			div.setAttribute('attr', 'new');
			expect(records).toEqual([{
				"addedNodes": [],
				"attributeName": "attr",
				"attributeNamespace": null,
				"nextSibling": null,
				"oldValue": 'old',
				"previousSibling": null,
				"removedNodes": [],
				"target": null,
				"type": "attributes",
			}]);
		});

		test('Only observes a list of filtered attributes if defined.', () => {
			let records = [];
			const div = document.createElement('div');
			const observer = new MutationObserver(mutationRecords => {
				records.push(mutationRecords);
			});
			div.setAttribute('attr1', 'old');
			div.setAttribute('attr2', 'old');
			observer.observe(div, { attributeFilter: ['attr1'], attributeOldValue: true, attributes: true });
			div.setAttribute('attr1', 'new');
			div.setAttribute('attr2', 'new');
			expect(records).toEqual([[{
				"addedNodes": [],
				"attributeName": "attr1",
				"attributeNamespace": null,
				"nextSibling": null,
				"oldValue": 'old',
				"previousSibling": null,
				"removedNodes": [],
				"target": null,
				"type": "attributes",
			}]]);
		});
	});
});
