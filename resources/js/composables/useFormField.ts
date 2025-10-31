// packages/nova-toggle/resources/js/composables/useFormField.ts
import { computed, getCurrentInstance, onMounted, ref } from 'vue';

interface Field {
    value?: any;
    attribute: string;
    visible?: boolean;
    readonly?: boolean;
    fill?: (formData: FormData) => void;
    [key: string]: any;
}

interface FormFieldProps {
    resourceName?: string;
    resourceId?: string | number;
    field?: Field;
    showHelpText?: boolean;
    errors?: object;
}

export function useFormField() {
    const instance = getCurrentInstance();
    const props = instance?.props as unknown as FormFieldProps;

    const value = ref<any>(null);

    const currentField = computed(() => props.field);
    const fieldAttribute = computed(() => props.field?.attribute || '');
    const isVisible = computed(() => props.field?.visible !== false);
    const currentlyIsReadonly = computed(() => props.field?.readonly || false);

    const setInitialValue = () => {
        value.value = props.field?.value ?? false;
    };

    const fieldDefaultValue = () => false;

    const fillInto = (formData: FormData, attribute: string, val: any) => {
        formData.append(attribute, val);
    };

    const fillIfVisible = (formData: FormData, attribute: string, val: any) => {
        if (isVisible.value) {
            fillInto(formData, attribute, val);
        }
    };

    const fill = (formData: FormData) => {
        const attribute = fieldAttribute.value;
        if (attribute) {
            fillIfVisible(formData, attribute, value.value ? 1 : 0);
        }
    };

    const emitFieldValueChange = (attribute: string, val: any) => {
        (window as any).Nova?.$emit(`${attribute}-value`, val);
    };

    onMounted(() => {
        if (props.field) {
            props.field.fill = fill;
        }
    });

    return {
        value,
        currentField,
        fieldAttribute,
        isVisible,
        currentlyIsReadonly,
        setInitialValue,
        fieldDefaultValue,
        fillInto,
        fillIfVisible,
        fill,
        emitFieldValueChange,
        loading: ref(false),
    };
}
