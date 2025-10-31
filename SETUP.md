# Installation in dein Laravel Nova Projekt

## Schritt 1: Package ins Projekt kopieren

Kopiere den `nova-toggle` Ordner in dein Projekt:

```bash
cd /Users/almiro/Projekte/Nova\ Toggle/Website/laravel-nova-package-playground
mkdir -p packages
# Entpacke nova-toggle.tar.gz hier in packages/
```

Struktur:

```bash
laravel-nova-package-playground/
├── app/
├── packages/
│   └── nova-toggle/         # <- Hier
├── composer.json
└── ...
```

---

## Schritt 2: Haupt-composer.json anpassen

Öffne: `/Users/almiro/Projekte/Nova Toggle/Website/laravel-nova-package-playground/composer.json`

Füge hinzu:

```json
{
    "repositories": [
        {
            "type": "path",
            "url": "./packages/nova-toggle",
            "options": {
                "symlink": true
            }
        }
    ],
    "require": {
        "laravel/nova": "^5.0",
        "almirhodzic/nova-toggle": "@dev"
    }
}
```

---

## Schritt 3: Package installieren

```bash
cd /Users/almiro/Projekte/Nova\ Toggle/Website/laravel-nova-package-playground
composer require almirhodzic/nova-toggle:@dev
```

---

## Schritt 4: Package Assets builden

```bash
cd packages/nova-toggle
npm install
npm run build
```

---

## Schritt 5: In Nova Resource nutzen

Erstelle z.B. `app/Nova/Plugin.php`:

```php
<?php

namespace App\Nova;

use AlmirHodzic\NovaToggle\Toggle;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Resource;

class Plugin extends Resource
{
    public static $model = \App\Models\Plugin::class;

    public static $title = 'name';

    public function fields(NovaRequest $request)
    {
        return [
            ID::make()->sortable(),

            Text::make('Name'),

            Toggle::make('Active', 'is_active')
                ->onColor('#10b981')
                ->offColor('#ef4444'),
        ];
    }
}
```

---

## Schritt 6: Migration & Model erstellen

```bash
php artisan make:model Plugin -m
```

**Migration** (`database/migrations/xxxx_create_plugins_table.php`):

```php
Schema::create('plugins', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->boolean('is_active')->default(false);
    $table->timestamps();
});
```

**Model** (`app/Models/Plugin.php`):

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plugin extends Model
{
    protected $fillable = ['name', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
```

```bash
php artisan migrate
```

---

## Schritt 7: Resource in NovaServiceProvider registrieren

Öffne: `app/Providers/NovaServiceProvider.php`

```php
use App\Nova\Plugin;

protected function resources(): array
{
    return [
        Plugin::class,
    ];
}
```

---

## Fertig! 🎉

Öffne: `https://nova-toggle.test/nova/resources/plugins`

Der Toggle-Switch sollte auf der Index-Seite erscheinen!

---

## Troubleshooting

### Assets nicht geladen?

```bash
cd packages/nova-toggle
npm run build

# Im Haupt-Projekt
php artisan optimize:clear
```

### Klassen nicht gefunden?

```bash
composer dump-autoload
```

### Route-Fehler?

```bash
php artisan route:clear
php artisan optimize:clear
```
