<template>
	<div v-if="primaryKey !== '+'" class="create-anywhere">
		<v-button :icon="icon" :style-type="color" @click="handleClick">
			<v-icon :name="icon" />
		</v-button>

		<drawer-item
			v-model:active="showDrawer"
			:collection="collection"
			:primary-key="'+'"
			:edits="defaultEdits"
			@input="handleDrawerSave"
			persistent
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useStores, useApi } from '@directus/composables';

// Debug log to verify component mounting
console.log('Create Anywhere Component mounted at:', new Date().toISOString());

interface Props {
	collection: string;
	primaryKey?: string | number;
	value: any;
	icon?: string;
	color?: string;
	defaultFields?: Array<{ field: string; value: string }>;
}

const props = withDefaults(defineProps<Props>(), {
	primaryKey: undefined,
	icon: 'content_copy',
	color: 'primary',
	defaultFields: () => [],
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

// Computed default edits from configured fields
const defaultEdits = computed(() => {
	console.log('Computing default edits with fields:', props.defaultFields);
	
	const edits: Record<string, any> = {};
	
	if (props.defaultFields?.length) {
		props.defaultFields.forEach((fieldConfig) => {
			console.log('Processing field config:', fieldConfig);
			edits[fieldConfig.field] = fieldConfig.value;
		});
	}
	
	console.log('Computed default edits:', edits);
	return edits;
});

// Methods
const handleClick = () => {
	console.log('Create button clicked for collection:', props.collection);
	console.log('Current default edits:', defaultEdits.value);
	showDrawer.value = true;
};

const handleDrawerSave = async (newEdits: Record<string, any>) => {
	console.log('Saving new item with edits:', {
		defaultEdits: defaultEdits.value,
		newEdits,
		merged: { ...defaultEdits.value, ...newEdits },
	});

	try {
		const response = await api.post(`/items/${props.collection}`, {
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
</script>

<style lang="scss" scoped>
.create-anywhere {
	display: flex;
	justify-content: flex-end;
}
</style>
