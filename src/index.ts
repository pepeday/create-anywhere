import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './create-anywhere.vue';

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
		console.log('Options function triggered for collection:', field?.collection);
		const collection = field?.collection;
		// Define the fields
		const fields = [
			{
				field: 'selectedCollection',
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
										collectionName: collection, // Use dynamic template
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
										collectionName: collection, // Use dynamic template
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
		return fields;
	},
});
