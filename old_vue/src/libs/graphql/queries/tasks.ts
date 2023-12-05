export default {
    task: `
        query task($id: ID!) {
            task(id: $id) {
                _id
                name
                action
                priority
                logs
                settings
                retriable
                retry_count
                scheduled_at
                locked
                executed
                executed_at
                execution_result
                execution_success
                pid
            }
        }
    `,
    taskList: `
        query taskList($limit: Int!) {
            taskList(limit: $limit) {
                _id
                name
                action
                priority
                retriable
                retry_count
                scheduled_at
                locked
                executed
                executed_at
                execution_result
                execution_success
                pid
            }
        }
    `,
    taskSearch: `
        query taskSearch($page: Int!, $limit: Int!, $search: String, $sort: String, $order: SortingOrder) {
            taskSearch(page: $page, limit: $limit, search: $search, sort: $sort, order: $order) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    _id
                    name
                    action
                    priority
                    retriable
                    retry_count
                    scheduled_at
                    locked
                    executed
                    executed_at
                    execution_result
                    execution_success
                    pid
                }
            }
        }
    `,
    taskRunningTime: `
        query taskRunningTime($pid: ID!) {
            taskRunningTime(pid: $pid)
        }
    `,
    cliCommand: `
        query cliCommand() {
            cliCommand()
        }
    `,
    taskLogs: `
        query taskLogs($id: ID!) {
            taskLogs(id: $id)
        }
    `,
    createTask: `
        mutation createTask($name: String!, $action: String!, $priority: Int!, $retriable: Boolean!, $timestamp: Int!, $settings: String!) {
            createTask(name: $name, action: $action, priority: $priority, retriable: $retriable, timestamp: $timestamp, settings: $settings) 
        }
    `,
    retryTask: `
        mutation retryTask($ids: [ID!]!) {
            retryTask(ids: $ids) 
        }
    `,
    changeTaskSchedule: `
        mutation changeTaskSchedule($id: ID!, $timestamp: Int!) {
            changeTaskSchedule(id: $id, timestamp: $timestamp) 
        }
    `,
    startTasks: `
        mutation startTasks($ids: [ID!]!) {
            startTasks(ids: $ids) 
        }
    `,
    startAllTasks: `
        mutation startAllTasks() {
            startAllTasks() 
        }
    `,
    stopTask: `
        mutation stopTask($pids: [Int!]!) {
            stopTask(pids: $pids) 
        }
    `,
    stopAllTasks: `
        mutation stopAllTasks() {
            stopAllTasks() 
        }
    `,
    cancelTask: `
        mutation cancelTask($ids: [ID!]!) {
            cancelTask(ids: $ids) 
        }
    `,
    updateTask: `
        mutation updateTask($id: ID!, $name: String!, $action: String!, $priority: Int!, $retriable: Boolean!, $timestamp: Int!, $settings: String!) {
            updateTask(id: $id, name: $name, action: $action, priority: $priority, retriable: $retriable, timestamp: $timestamp, settings: $settings) 
        }
    `,
};
