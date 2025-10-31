export default {
    props: {
        resourceName: String,
        resourceId: [String, Number],
        field: Object,
        showHelpText: Boolean,
        errors: Object,
    },

    data() {
        return {
            value: null,
        };
    },

    mounted() {
        this.field.fill = this.fill;
    },

    methods: {
        setInitialValue() {
            this.value = this.field.value ?? false;
        },

        fieldDefaultValue() {
            return false;
        },

        fillInto(formData, attribute, value) {
            formData.append(attribute, value);
        },

        fillIfVisible(formData, attribute, value) {
            if (this.isVisible) {
                this.fillInto(formData, attribute, value);
            }
        },

        fill(formData) {
            this.fillIfVisible(
                formData,
                this.fieldAttribute,
                this.value ? 1 : 0,
            );
        },

        emitFieldValueChange(attribute, value) {
            Nova.$emit(`${attribute}-value`, value);
        },
    },

    computed: {
        currentField() {
            return this.field;
        },

        fieldAttribute() {
            return this.field.attribute;
        },

        isVisible() {
            return this.field.visible !== false;
        },

        currentlyIsReadonly() {
            return this.field.readonly || false;
        },
    },
};
