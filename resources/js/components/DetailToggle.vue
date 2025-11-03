<!--
  Nova-Toggle 5 by Almir Hodzic
  Original: https://github.com/almirhodzic/nova-toggle
  Copyright (c) 2025 Almir Hodzic
  MIT License
-->

<template>
    <!-- The outer Nova PanelItem wrapper provides consistent styling and layout within Nova detail panels -->
    <PanelItem :index="index" :field="field">
        <!-- Replace the default "value" slot with a custom toggle presentation -->
        <template #value>
            <div class="flex items-center gap-2">
                <!-- The visual toggle wrapper -->
                <label
                    class="group pointer-events-none relative inline-flex h-5 w-10 shrink-0 items-center overflow-hidden rounded-full opacity-50 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out"
                    :style="[{ padding: '2.25px' }, wrapperStyle]"
                >
                    <!-- Optional ON/OFF labels inside the toggle -->
                    <span
                        v-if="field.onLabel || field.offLabel"
                        class="pointer-events-none absolute inset-0 flex items-center font-medium tracking-wide uppercase"
                        :style="labelTextStyle"
                        :class="value ? 'justify-start' : 'justify-end'"
                    >
                        {{ value ? field.onLabel : field.offLabel }}
                    </span>

                    <!-- The small circular bullet that moves left/right -->
                    <span
                        class="inline-block h-4 w-4 rounded-full shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out"
                        :style="bulletStyle"
                    />
                </label>

                <!-- Optional helper text displayed next to the toggle (if defined and visible) -->
                <p
                    v-if="field.helpOnDetail && !field.hidden"
                    class="help-text text-xs italic"
                >
                    {{ field.helpOnDetail }}
                </p>
            </div>
        </template>
    </PanelItem>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * Field interface represents configuration passed from Nova.
 * Each property corresponds to a customizable color, label,
 * or text option that can differ for light and dark themes.
 */
interface Field {
    value?: boolean;
    hidden?: boolean;
    onLabel?: string;
    offLabel?: string;
    onLabelColor?: string;
    offLabelColor?: string;
    onLabelColorDark?: string;
    offLabelColorDark?: string;
    onBulletColor?: string;
    offBulletColor?: string;
    onBulletColorDark?: string;
    offBulletColorDark?: string;
    onColor?: string;
    offColor?: string;
    onColorDark?: string;
    offColorDark?: string;
    helpOnDetail?: string;
}

/**
 * Props interface for the component.
 * `field` is required; others are optional.
 */
interface Props {
    index?: number;
    field: Field;
    resource?: Record<string, any>;
    resourceName?: string;
    resourceId?: string | number;
}

const props = defineProps<Props>();

/**
 * `value` represents the boolean toggle state (on/off)
 * taken from the Nova field's current value.
 */
const value = ref<boolean>(props.field.value ?? false);

/**
 * Tracks whether the user's system is currently in dark mode.
 */
const isDark = ref(false);

/**
 * Reference to the system color scheme media query listener.
 */
let mediaQuery: MediaQueryList | null = null;

/**
 * Computed: Dynamic text color for ON/OFF labels inside the toggle.
 * Changes based on:
 *   - Toggle state (on/off)
 *   - User's theme (light/dark)
 */
const labelTextStyle = computed(() => ({
    color: value.value
        ? isDark.value
            ? props.field.onLabelColorDark
            : props.field.onLabelColor
        : isDark.value
          ? props.field.offLabelColorDark
          : props.field.offLabelColor,
    fontSize: '6px',
    padding: '0 6px',
}));

/**
 * Computed: Styles for the toggle's moving bullet.
 * Sets the background color and translation distance.
 */
const bulletStyle = computed(() => {
    const onColor = isDark.value
        ? props.field.onBulletColorDark
        : props.field.onBulletColor;
    const offColor = isDark.value
        ? props.field.offBulletColorDark
        : props.field.offBulletColor;

    return {
        backgroundColor: value.value ? onColor : offColor,
        transform: value.value ? 'translateX(1.25rem)' : 'translateX(0)',
    };
});

/**
 * Computed: Background color of the toggle wrapper itself.
 * Reacts to both dark/light theme and ON/OFF state.
 */
const wrapperStyle = computed(() => {
    const onColor = isDark.value
        ? props.field.onColorDark
        : props.field.onColor;
    const offColor = isDark.value
        ? props.field.offColorDark
        : props.field.offColor;

    return {
        backgroundColor: value.value ? onColor : offColor,
    };
});

/**
 * Handles changes to the user's color scheme preference (dark/light).
 */
const handleColorSchemeChange = (e: MediaQueryListEvent) => {
    isDark.value = e.matches;
};

/**
 * Lifecycle hook: initialize color scheme detection.
 * Registers a media query listener to detect when the user switches
 * between light and dark mode.
 */
onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isDark.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', handleColorSchemeChange);
});

/**
 * Lifecycle hook: clean up event listeners when the component unmounts.
 */
onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleColorSchemeChange);
});
</script>
