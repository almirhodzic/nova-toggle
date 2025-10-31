<?php

namespace AlmirHodzic\NovaToggle\Http\Controllers;

use Laravel\Nova\Nova;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ToggleController extends Controller
{
    public function toggle(Request $request, string $resource, string $resourceId): JsonResponse
    {
        $guards = config('nova-toggle.guards', ['web']);
        $hasAccess = collect($guards)->contains(fn($guard) => auth()->guard($guard)->check());

        if (!$hasAccess) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Finde Resource-Class dynamisch
        $resourceClass = Nova::resourceForKey($resource);

        if (!$resourceClass) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        // Model über Resource finden
        $model = $resourceClass::newModel()->findOrFail($resourceId);

        $attribute = $request->input('attribute');

        if (!$attribute) {
            return response()->json(['error' => 'Attribute required'], 400);
        }

        // Toggle
        $newValue = !$model->{$attribute};
        $model->{$attribute} = $newValue;

        // Log Action Event
        Nova::actionEvent()->forResourceUpdate($request->user(), $model)->save();

        $model->save();

        // Cache leeren wenn NovaPlugin
        if (get_class($model) === \App\Models\NovaPlugin::class) {
            \App\Support\Plugins::clearCache();
        }

        // Label für Toast
        $label = $model->name ?? $model->label ?? $model->title ?? $resourceClass::singularLabel();
        $reloadNavigation = get_class($model) === \App\Models\NovaPlugin::class;

        return response()->json([
            'success' => true,
            'value' => $newValue,
            'reloadNavigation' => $reloadNavigation,
            'label' => $label
        ]);
    }
}
