<?php

use AlmirHodzic\NovaToggle\Http\Controllers\ToggleController;
use Illuminate\Support\Facades\Route;

Route::post('/{resource}/{resourceId}', [ToggleController::class, 'toggle'])
    ->name('nova-toggle.toggle');
