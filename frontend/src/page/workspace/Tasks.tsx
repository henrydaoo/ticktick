import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import TaskTable from "@/components/workspace/task/task-table";

export default function Tasks() {
  return (
    <div className="px-3 lg:px-20 py-3">
      <div className="w-full h-full flex-col space-y-8 pt-3">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
            <p className="text-muted-foreground">
              Here&apos;s the complete list of tasks in this workspace!
            </p>
          </div>
          <CreateTaskDialog />
        </div>
        <div>
          <TaskTable />
        </div>
      </div>
    </div>
  );
}
