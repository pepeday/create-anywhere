# Create Anywhere - Directus Extension

This is a custom Directus interface extension that enables users to create new items in any collection from any context within the app, using a configurable button and drawer interface.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [Development](#development)
- [License](#license)

## Features
- **Dynamic Item Creation**: Allows users to create items in any Directus collection.
- **Predefined Default Values**: Supports dynamic templates for default values (e.g., `{{fieldName}}`).
- **Configurable Interface**: Customize the button's appearance and behavior, including color, icon, and target collection.
- **Drawer Interface**: Opens a user-friendly drawer for inputting item details.
- **Notifications**: Success and error messages upon creation.

## Bugs
- The configuration options cannot use the selected collection for configurating dynamic default values. So dynamic default values are only possible for the current collection.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-URL>
   ```
   Replace `<repository-URL>` with the repository URL for this extension.

2. **Move Files**:
   Place the extension files in the `extensions/interfaces` directory of your Directus project.

3. **Restart Directus**:
   Restart the Directus server to load the new interface:
   ```bash
   npx directus start
   ```

## Usage
1. **Enable the Extension**:
   - Navigate to the Directus Admin panel.
   - Add the "Create Anywhere" interface to your desired collection or field.

2. **Configure Options**:
   - Set the target collection (`selectedCollection`).
   - Define default field values using templates (e.g., `{{current_user}}`).
   - Customize the button appearance (icon, color).

3. **Create Items**:
   - Click the "Create Anywhere" button.
   - Fill in the required fields in the drawer.
   - Save the form to create the new item.

## Customization
### Props
- `collection`: Current collection context.
- `selectedCollection`: Collection where the new item will be created.
- `defaultFields`: Array of field-value pairs for default values.
- `color`: Button color (e.g., `primary`, `success`, `danger`).
- `icon`: Button icon (e.g., `content_copy`).

### Example Configuration
```json
{
  "selectedCollection": "orders",
  "defaultFields": [
    { "field": "customer_id", "value": "{{current_user.id}}" },
    { "field": "status", "value": "new" }
  ],
  "color": "success",
  "icon": "add_circle"
}
```

## Development
### Prerequisites
- Node.js
- Directus instance

### Debugging
- The Vue component includes debug logs to monitor props and state changes.
- Logs are output to the browser console.

### Key Files
- **`create-anywhere.vue`**: Implements the UI and logic for the extension.
- **`index.ts`**: Registers the extension and defines configuration options.

## License
This project is licensed under the [MIT License](LICENSE).
