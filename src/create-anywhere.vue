<template>
	<div v-if="primaryKey !== '+'" class="create-anywhere">
		<v-button :icon="icon" :style-type="color" @click="handleClick">
			<v-icon :name="icon" />
		</v-button>

		<drawer-item
			v-model:active="showDrawer"
			:collection="selectedCollection"
			:primary-key="'+'"
			:edits="defaultEdits"
			@input="handleDrawerSave"
			persistent
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useStores, useApi } from '@directus/composables';

// Debug log to verify component mounting
console.log('Create Anywhere Component mounted at:', new Date().toISOString());

interface Props {
	collection: string;
	primaryKey?: string | number;
	value: any;
	selectedCollection: string;
	defaultFields: Array<{ field: string; value: string }>;
	color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
	icon: string;
}

const props = withDefaults(defineProps<Props>(), {
	primaryKey: undefined,
	icon: 'content_copy',
	color: 'primary',
	defaultFields: () => [],
	selectedCollection: '',
});

// Debug logs for props
onMounted(() => {
	console.log('Create Anywhere Props:', {
		collection: props.collection,
		primaryKey: props.primaryKey,
		icon: props.icon,
		color: props.color,
		defaultFields: props.defaultFields,
	});
});

// Watch for changes in defaultFields
watch(() => props.defaultFields, (newFields) => {
	console.log('Default Fields changed:', newFields);
}, { deep: true });

const { useNotificationsStore } = useStores();
const notificationsStore = useNotificationsStore();
const api = useApi();

// State
const showDrawer = ref(false);

// Rename to be more explicit about what values these are
const currentItemValues = inject('values', ref<Record<string, any>>({}));

// Update the resolveTemplateValue function to use current item values
const resolveTemplateValue = (template: string) => {
	// If it's not a template, return as is
	if (!template.includes('{{')) return template;

	// Extract variable name from {{variableName}}
	const matches = template.match(/\{\{(.*?)\}\}/g);
	if (!matches) return template;

	return matches.reduce((resolved, match) => {
		const fieldName = match.replace(/\{\{|\}\}/g, '').trim();
		// Use currentItemValues to resolve templates
		return resolved.replace(match, currentItemValues.value?.[fieldName] ?? '');
	}, template);
};

// Update the defaultEdits computed to be more explicit
const defaultEdits = computed(() => {
	console.log('Computing default edits:', {
		currentCollection: props.collection,
		targetCollection: props.selectedCollection,
		defaultFields: props.defaultFields,
		currentValues: currentItemValues.value
	});
	
	const edits: Record<string, any> = {};
	
	if (props.defaultFields?.length) {
		props.defaultFields.forEach((fieldConfig) => {
			// Resolve template using current item's values
			const resolvedValue = resolveTemplateValue(fieldConfig.value);
			console.log(`Resolving field ${fieldConfig.field}:`, {
				original: fieldConfig.value,
				resolved: resolvedValue,
				sourceValues: currentItemValues.value
			});
			edits[fieldConfig.field] = resolvedValue;
		});
	}
	
	return edits;
});

// Methods
const handleClick = () => {
	console.log('Create button clicked with configuration:', {
		selectedCollection: props.selectedCollection,
		collection: props.collection,
		defaultFields: props.defaultFields,
		defaultEdits: defaultEdits.value,
		color: props.color,
		icon: props.icon,
	});
	showDrawer.value = true;
};

const handleDrawerSave = async (newEdits: Record<string, any>) => {
	console.log('Creating new item:', {
		targetCollection: props.selectedCollection,
		defaultEdits: defaultEdits.value,
		newEdits,
		merged: { ...defaultEdits.value, ...newEdits },
	});

	try {
		// Use selectedCollection instead of collection for the API call
		const response = await api.post(`/items/${props.selectedCollection}`, {
			...defaultEdits.value,
			...newEdits,
		});

		console.log('Item created successfully:', response);

		showDrawer.value = false;

			notificationsStore.add({
				title: 'Item Created',
				type: 'success',
			});
	} catch (error) {
		console.error('Error creating item:', error);
		notificationsStore.add({
			title: 'Error',
			type: 'error',
			text: error instanceof Error ? error.message : 'Could not create item',
		});
	}
};

onMounted(() => {
	console.log('Create Anywhere Component Configuration:', {
		selectedCollection: props.selectedCollection,
		defaultFields: props.defaultFields,
		color: props.color,
		icon: props.icon,
		collection: props.collection,
	});
});
</script>

<style lang="scss" scoped>
.create-anywhere {
	display: flex;
	justify-content: flex-end;
}
</style>
