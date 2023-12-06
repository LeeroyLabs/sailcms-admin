import {
    Category,
    Dashboard,
    Group,
    Info,
    Input,
    Logout,
    Menu, Person,
    VerifiedUser,
    Widgets,
    ContactMail,
    Send,
    Terminal,
    Extension,
    Lan,
    Assignment,
    Bookmarks
} from '@steeze-ui/material-design-icons';

export const systembarNavigation = {
    main: [
        {icon: Info, label: 'systembar.main.about'},
        {icon: Logout, label: 'systembar.main.logout'}
    ],
    cms: [
        {icon: Widgets, label: 'systembar.content.categories'},
        {icon: Menu, label: 'systembar.content.navigations'},
        {icon: Category, label: 'systembar.content.content_types'},
        {icon: Dashboard, label: 'systembar.content.layouts'},
        {icon: Input, label: 'systembar.content.fields'}
    ],
    users: [
        {icon: Group, label: 'systembar.users.groups'},
        {icon: VerifiedUser, label: 'systembar.users.roles'},
        {icon: Person, label: 'systembar.users.users'}
    ],
    utilities: [
        {icon: ContactMail, label: 'systembar.utils.email_template'},
        {icon: Send, label: 'systembar.utils.email_test'},
        {icon: Terminal, label: 'systembar.utils.tasks'},
        {icon: Extension, label: 'systembar.utils.extensions'},
        {icon: Bookmarks, label: 'systembar.utils.bookmarks'},
        {icon: Lan, label: 'systembar.utils.hosting'},
        {icon: Assignment, label: 'systembar.utils.logs'}
    ]
};