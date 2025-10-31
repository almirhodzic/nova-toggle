import DetailToggle from './components/DetailToggle.vue';
import FormToggle from './components/FormToggle.vue';
import IndexToggle from './components/IndexToggle.vue';

Nova.booting((app) => {
    app.component('index-nova-toggle', IndexToggle);
    app.component('detail-nova-toggle', DetailToggle);
    app.component('form-nova-toggle', FormToggle);
});
