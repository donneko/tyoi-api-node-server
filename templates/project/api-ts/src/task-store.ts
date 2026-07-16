export type Task = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
};

const tasks: Task[] = [];
let nextId = 1;

export function listTasks(): Task[] {
    return [...tasks];
}

export function createTask(title: string): Task {
    const task: Task = {
        id: nextId++,
        title,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
}
