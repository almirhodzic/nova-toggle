<template>
    <div class="flex items-center gap-2" @click.stop>
        <div v-if="field.hidden" class="h-5 w-10"></div>

        <div
            v-else
            class="flex items-center gap-2"
            :class="
                loading || field.readonly
                    ? 'cursor-default'
                    : 'cursor-pointer'
            "
        >
            <label
                class="group disabled:pointer-events-non relative inline-flex h-5 w-10 shrink-0 items-center overflow-hidden rounded-full inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out disabled:opacity-50 has-focus-visible:outline-2"
                :class="labelClasses"
                :style="[{ padding: '2.01px' }, wrapperStyle]"
                @click.stop
            >
                <span
                    v-if="field.onLabel || field.offLabel"
                    class="pointer-events-none absolute inset-0 flex items-center font-medium tracking-wide uppercase"
                    :style="labelTextStyle"
                    :class="value ? 'justify-start' : 'justify-end'"
                >
                    {{ value ? field.onLabel : field.offLabel }}
                </span>

                <input
                    type="checkbox"
                    :class="inputClasses"
                    class="absolute inset-0 appearance-none opacity-0 focus:outline-hidden disabled:pointer-events-none"
                    :aria-label="`Toggle ${field.attribute}`"
                    :name="field.attribute"
                    :checked="value"
                    :disabled="loading || field.readonly"
                    @change="handleChange"
                    @click.stop
                />

                <span
                    class="inline-block h-4 w-4 rounded-full shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out"
                    :style="bulletStyle"
                />
            </label>

            <p
                v-if="field.helpOnIndex && !field.hidden"
                class="help-text text-xs italic"
            >
                {{ field.helpOnIndex }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

interface Field {
    value?: boolean;
    attribute: string;
    hidden?: boolean;
    readonly?: boolean;
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
    name?: string;
    reloadPage?: boolean;
    helpOnIndex?: string;
}

interface Props {
    field: Field;
    resourceName: string;
    resourceId?: string | number;
    resource?: Record<string, any>;
}

const inputClasses = computed(() =>
    loading.value || props.field.readonly ? 'cursor-default' : 'cursor-pointer',
);

const props = defineProps<Props>();

declare const Nova: any;

const loading = ref(false);
const value = ref<boolean>(props.field.value ?? false);
const isDark = ref(false);
const id = props.resourceId ?? props.resource?.id?.value;

let mediaQuery: MediaQueryList | null = null;

// Computed
const labelClasses = computed(() => [
    loading.value || props.field.readonly
        ? 'pointer-events-none cursor-default opacity-50'
        : 'cursor-pointer opacity-100',
]);

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

// Methods
const handleChange = async () => {
    if (props.field.readonly || loading.value) {
        return;
    }

    const prev = value.value;
    value.value = !prev;
    loading.value = true;

    try {
        const res = await Nova.request().post(
            `/nova-vendor/nova-toggle/toggle/${props.resourceName}/${id}`,
            { attribute: props.field.attribute },
        );

        if (res.data?.success) {
            value.value = !!res.data.value;

            const getToastMessage = () => {
                const action = value.value ? 'activated' : 'deactivated';
                const label = res.data.label || props.field.name;
                return `"${label}" ${action}!`;
            };

            if (props.field.reloadPage) {
                sessionStorage.setItem(
                    'nova-toggle-message',
                    getToastMessage(),
                );
                setTimeout(() => window.location.reload(), 100);
            } else {
                Nova.$toasted?.show(getToastMessage(), { type: 'success' });
            }
        }
    } catch (e) {
        console.error(e);
        value.value = prev;
        Nova.$toasted?.show('Error occurred.', { type: 'error' });
    } finally {
        loading.value = false;
    }
};

const handleColorSchemeChange = (e: MediaQueryListEvent) => {
    isDark.value = e.matches;
};

// Lifecycle
onMounted(() => {
    const message = sessionStorage.getItem('nova-toggle-message');
    if (message) {
        sessionStorage.removeItem('nova-toggle-message');
        Nova.$toasted?.show(message, { type: 'success', duration: 3000 });
    }

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isDark.value = mediaQuery.matches;
    mediaQuery.addEventListener('change', handleColorSchemeChange);
});

onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleColorSchemeChange);
});
</script>
