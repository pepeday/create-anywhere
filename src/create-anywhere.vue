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
import { ref, computed, inject, watch } from 'vue';
import { useStores, useApi } from '@directus/composables';
import resolveMustacheString from './resolveMustacheString';

// Debug log to verify component mounting

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




const { useNotificationsStore } = useStores();
const notificationsStore = useNotificationsStore();
const api = useApi();

// State
const showDrawer = ref(false);

// Rename to be more explicit about what values these are
const currentItemValues = inject('values', ref<Record<string, any>>({}));


// Update to use batch template resolution
const resolveTemplateValues = async (templates: string[]) => {


	const resolved = await resolveMustacheString(
		props.collection,
		templates,
		currentItemValues.value,
		api
	) as string[];

<<<<<<< HEAD
=======

>>>>>>> 89c5fe2b14f052aa3f3393bc74b502e05241da02

	return resolved;
};

// Update defaultEdits to handle async template resolution
const defaultEdits = ref<Record<string, any>>({});

// Watch for changes in props.defaultFields and update defaultEdits
watch([() => props.defaultFields, currentItemValues], async () => {
	if (!props.defaultFields?.length) {
		defaultEdits.value = {};
		return;
	}

	const templates = props.defaultFields.map(field => field.value);
	const resolvedValues = await resolveTemplateValues(templates);

	const edits: Record<string, any> = {};
	props.defaultFields.forEach((fieldConfig, index) => {
		edits[fieldConfig.field] = resolvedValues[index];
	});

	defaultEdits.value = edits;
}, { immediate: true });

// Methods
const handleClick = () => {
	showDrawer.value = true;
};

const handleDrawerSave = async (newEdits: Record<string, any>) => {

	try {
		// Use selectedCollection instead of collection for the API call
		const response = await api.post(`/items/${props.selectedCollection}`, {
			...defaultEdits.value,
			...newEdits,
		});


		showDrawer.value = false;

			notificationsStore.add({
				title: 'Item Created',
				type: 'success',
			});
	} catch (error) {
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
