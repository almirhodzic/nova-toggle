# Nova Toggle

A Laravel Nova 5 toggle field for quick boolean updates directly on the index view.

## Features

- ✅ Toggle boolean fields directly on index page
- ✅ Customizable on/off colors
- ✅ Ajax updates with visual feedback
- ✅ Vue 3 & Nova 5 compatible

## Installation

```bash
composer require almirhodzic/nova-toggle
```

## Usage

In your Nova Resource:

```php
use AlmirHodzic\NovaToggle\Toggle;

public function fields(NovaRequest $request)
{
    return [
        ID::make()->sortable(),

        Toggle::make('Active', 'is_active'),

        // With custom colors
        Toggle::make('Published', 'is_published')
            ->onColor('#10b981')
            ->offColor('#ef4444'),
    ];
}
```

## Methods

### `onColor(string $color)`

Set the color when toggle is ON (default: `#10b981`)

### `offColor(string $color)`

Set the color when toggle is OFF (default: `#ef4444`)

## Requirements

- PHP 8.2+
- Laravel Nova 5+
- Vue 3

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode
npm run dev
```

## License

MIT License - feel free to use in your projects!

## Author

Almir Hodzic
