import type { Api } from '@directus/types';

export async function resolveMustacheString(
    collection: string, 
    templates: string | string[], 
    currentValues: Record<string, any>,
    api: Api
): Promise<string | string[]> {
    // Handle single template case
    const isArray = Array.isArray(templates);
    const templateArray = isArray ? templates : [templates];
    
    // If no templates contain mustache syntax, return early
    if (!templateArray.some(template => template.includes('{{'))) {
        return isArray ? templateArray : templateArray[0];
    }

    // Collect all unique mustache fields across all templates
    const allMatches = new Set<string>();
    templateArray.forEach(template => {
        const matches = template.match(/{{\s*([^}]+)\s*}}/g) || [];
        matches.forEach(match => {
            allMatches.add(match.replace(/{{\s*|\s*}}/g, '').trim());
        });
    });


    try {
        let itemWithRelations = currentValues;

        // Only make API call if we have an ID
        if (currentValues?.id) {


            const response = await api.get(`/items/${collection}/${currentValues.id}`, {
                params: {
                    fields: ['*', ...Array.from(allMatches)]
                }
            });
            itemWithRelations = response.data.data;
        }

        // Resolve all templates using the single API response
        const resolvedTemplates = templateArray.map(template => {
            const matches = template.match(/{{\s*([^}]+)\s*}}/g);
            if (!matches) return template;

            return matches.reduce((resolved, match) => {
                const fieldPath = match.replace(/{{\s*|\s*}}/g, '').trim();
                const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], itemWithRelations) ?? '';
                
                // Handle objects - return their ID or a meaningful string representation
                if (typeof value === 'object' && value !== null) {
                    return resolved.replace(match, value.id || '');
                }
                
                return resolved.replace(match, String(value));
            }, template);
        });

        return isArray ? resolvedTemplates : resolvedTemplates[0];

    } catch (error) {
        console.warn('Error details:', {
            errorMessage: error.message,
            errorResponse: error.response?.data,
            collection,
            currentValues
        });
        // On error, try to resolve using currentValues
        // ... rest of error handling
    }
}

export default resolveMustacheString;
