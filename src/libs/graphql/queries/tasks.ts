export default {
    task: `
        query task($id: ID!) {
            task(id: $id) {
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
    createTask: `
        mutation createTask($name: String!, $action: String!, $priority: Int!, $retriable: Boolean!) {
            createTask(name: $name, action: $action, priority: $priority, retriable: $retriable) 
        }
    `,
    retryTask: `
        mutation retryTask($id: ID!) {
            retryTask(id: $id) 
        }
    `,
    changeTaskSchedule: `
        mutation changeTaskSchedule($id: ID!, $timestamp: Int!) {
            changeTaskSchedule(id: $id, timestamp: $timestamp) 
        }
    `,
    startAllTasks: `
        mutation startAllTasks() {
            startAllTasks() 
        }
    `,
    stopTask: `
        mutation stopTask($pid: Int!) {
            stopTask(pid: $pid) 
        }
    `,
    stopAllTasks: `
        mutation stopAllTasks() {
            stopAllTasks() 
        }
    `,
    cancelTask: `
        mutation cancelTask($id: ID!) {
            cancelTask(id: $id) 
        }
    `,
};
