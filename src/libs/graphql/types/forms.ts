export interface FormDate {
    date: number;
    operator: "AFTER" | "BEFORE" | "EQUAL";
}

export interface FormSettingsInput {
    title: string;
    to: string;
    cc: string[];
    bcc: string[];
    success_email_handle: string;
    entry_title: string;
}
