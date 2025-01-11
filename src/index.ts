import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './create-anywhere.vue';

// Add a changing console log to verify rebuilds
console.log('Create Anywhere Interface loaded at:', new Date().toISOString(), Math.random());

export default defineInterface({
	id: 'create-anywhere',
	name: 'Create anywhere',
	description: 'Adds a button that allows the user to create items from any collection.',
	icon: 'content_copy',
	component: InterfaceComponent,
	hideLabel: true,
	hideLoader: true,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: ({ field }) => {
		console.log('Field in options:', field);
		console.log('Collection from field:', field.collection);
		
		// Get the collection name from the field object
		const targetCollection = field.collection;
		console.log('Target collection for interfaces:', targetCollection);
		
		const fields = [
			{
				field: 'collection',
				name: 'Target Collection',
				type: 'string',
				meta: {
					width: 'full',
					interface: 'system-collection',
					required: true,
				},
			},
			{
				field: 'defaultFields',
				name: 'Default Values',
				type: 'json',
				meta: {
					width: 'full',
					interface: 'list',
					options: {
						template: '{{ field }}: {{ value }}',
						fields: [
							{
								field: 'field',
								name: 'Field',
								type: 'string',
								meta: {
									width: 'half',
									interface: 'system-field',
									options: {
										collectionName: targetCollection,
										allowPrimaryKey: false,
										allowNone: false,
									},
								},
							},
							{
								field: 'value',
								name: 'Value Template',
								type: 'string',
								meta: {
									width: 'half',
									interface: 'system-display-template',
									options: {
										collectionName: targetCollection,
										placeholder: 'Enter static value or {{ field }}',
										font: 'monospace',
									},
								},
							},
						],
					},
				},
				schema: {
					default_value: [],
				},
			},
			{
				field: 'color',
				name: 'Color',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-dropdown',
					options: {
						choices: [
							{ text: 'Primary', value: 'primary' },
							{ text: 'Secondary', value: 'secondary' },
							{ text: 'Success', value: 'success' },
							{ text: 'Warning', value: 'warning' },
							{ text: 'Danger', value: 'danger' },
						],
					},
				},
				schema: {
					default_value: 'primary',
				},
			},
			{
				field: 'icon',
				name: 'Icon',
				type: 'string',
				meta: {
					width: 'half',
					interface: 'select-icon',
				},
				schema: {
					default_value: 'content_copy',
				},
			},
		];

		console.log('Field selector options:', fields[1].meta.options.fields[0].meta.options);
		console.log('Value template options:', fields[1].meta.options.fields[1].meta.options);

		return fields;
	},
});
