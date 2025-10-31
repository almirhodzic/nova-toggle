import DetailField from './components/DetailField.vue';
import FormField from './components/FormField.vue';
import IndexField from './components/IndexField.vue';

Nova.booting((app) => {
    app.component('index-nova-toggle', IndexField);
    app.component('detail-nova-toggle', DetailField);
    app.component('form-nova-toggle', FormField);
});
