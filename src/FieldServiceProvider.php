<?php

namespace AlmirHodzic\NovaToggle;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Nova;

class FieldServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Nova::serving(function (ServingNova $event) {
            Nova::script('nova-toggle', __DIR__ . '/../dist/js/field.js');

            if (file_exists(__DIR__ . '/../dist/css/field.css')) {
                Nova::style('nova-toggle', __DIR__ . '/../dist/css/field.css');
            }
        });

        $this->app->booted(function () {
            $this->routes();
        });
    }

    protected function routes(): void
    {
        $guards = $this->collectGuardsFromFields();

        Route::middleware(['web', 'auth:' . implode(',', $guards)])
            ->prefix('nova-vendor/nova-toggle/toggle')
            ->group(__DIR__ . '/../routes/api.php');
    }

    private function collectGuardsFromFields(): array
    {
        return config('nova-toggle.guards', ['web']);
    }
}
