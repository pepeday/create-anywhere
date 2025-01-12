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
        // Extract all fields including nested ones
        const fields = matches.map(match => match.replace(/{{\s*|\s*}}/g, '').trim());
        
        // Get the current item with all needed fields
        const response = await api.get(`/items/${collection}/${currentValues.id}`, {
            params: {
                fields: ['*', ...fields]  // Include all fields plus the specific nested ones
            }
        });

        const itemWithRelations = response.data.data;

        // Replace placeholders using the fetched data
        const resolvedString = matches.reduce((resolved, match) => {
            const fieldPath = match.replace(/{{\s*|\s*}}/g, '').trim();
            const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], itemWithRelations) ?? '';
            return resolved.replace(match, String(value));
        }, template);

        return resolvedString;
    } catch (error) {
        console.error('Error resolving mustache string:', error);
        return template;
    }
}

export default resolveMustacheString;
