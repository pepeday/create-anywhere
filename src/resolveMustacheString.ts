import type { Api } from '@directus/types';

export async function resolveMustacheString(
    collection: string, 
    template: string, 
    currentValues: Record<string, any>,
    api: Api
): Promise<string> {
    // If it's not a template string, return as is
    if (!template.includes('{{')) return template;

    // Find all mustache placeholders in the template
    const matches = template.match(/{{\s*([^}]+)\s*}}/g);
    if (!matches) return template;

    try {
        // If we don't have an ID, just use currentValues directly
        if (!currentValues?.id) {
            return matches.reduce((resolved, match) => {
                const fieldPath = match.replace(/{{\s*|\s*}}/g, '').trim();
                const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], currentValues) ?? '';
                return resolved.replace(match, String(value));
            }, template);
        }

        // Only fetch if we have an ID
        const fields = matches.map(match => match.replace(/{{\s*|\s*}}/g, '').trim());
        
        const response = await api.get(`/items/${collection}/${currentValues.id}`, {
            params: {
                fields: ['*', ...fields]
            }
        });

        const itemWithRelations = response.data.data;

        return matches.reduce((resolved, match) => {
            const fieldPath = match.replace(/{{\s*|\s*}}/g, '').trim();
            const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], itemWithRelations) ?? '';
            return resolved.replace(match, String(value));
        }, template);

    } catch (error) {
        // On error, try to resolve using currentValues
        console.warn('Error fetching data, falling back to current values:', error);
        return matches.reduce((resolved, match) => {
            const fieldPath = match.replace(/{{\s*|\s*}}/g, '').trim();
            const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], currentValues) ?? '';
            return resolved.replace(match, String(value));
        }, template);
    }
}

export default resolveMustacheString;
