export interface Task {
    _id: string;
    name: string;
    handler: string;
    action: string;
    settings: string;
    priority: number;
    retriable: boolean;
    retry_count: number;
    scheduled_at: number;
    locked: boolean;
    executed: boolean;
    executed_at: number;
    execution_result: string;
    execution_success: boolean;
}
