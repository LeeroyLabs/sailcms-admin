import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";

export default createVuetify({
    theme: {
        themes: {
            light: {
                colors: {
                    primary:          "#52688F",
                    secondary:        "#7391C8",
                    "primary-darker": "#283447",
                    "primary-darker-60": "#28344760"
                }
            },
            dark: {
                colors: {
                    primary:          "#52688F",
                    secondary:        "#7391C8",
                    "primary-darker": "#283447",
                    "primary-darker-60": "#28344760"
                }
            }
        }
    }
});
