import {createVuetify} from "vuetify";
import 'vuetify/dist/vuetify.min.css'

import '@mdi/font/css/materialdesignicons.css'

import * as directives from 'vuetify/directives'
import {VDateInput} from "vuetify/labs/VDateInput";

const vuetify = createVuetify({
    directives,
    components: {
        VDateInput
    }
})

export default vuetify;
