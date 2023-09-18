export interface FormDate {
    date: number;
    operator: "AFTER" | "BEFORE" | "EQUAL";
}

export enum FormAction {
    MAIL = "MAIL",
    DATABASE = "DATABASE",
    BOTH = "BOTH",
}

export interface FormSettingsInput {
    title: string;
    to: string;
    cc: string[];
    bcc: string[];
    success_email_handle: string;
    action: FormAction;
    entry_title: string;
}
