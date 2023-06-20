export const emailRoutes = [
    {
        path: '/settings/email-test',
        name: 'EmailTest',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/misc/EmailTest.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private',
            parent: 'Settings'
        }
    },
    {
        path: '/emails',
        name: 'Emails',
        component: () => import(/* webpackChunkName: "emails" */ '@/views/emails/Emails.vue'),
        meta: {
            guarded: true,
            permission: 'read_emails',
            layout: 'private',
            parent: ''
        }
    },
    {
        path: '/emails/:id',
        name: 'SingleEmail',
        component: () => import(/* webpackChunkName: "emails" */ '@/views/emails/Email.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_emails',
            layout: 'private',
            parent: 'Emails'
        }
    }
];
