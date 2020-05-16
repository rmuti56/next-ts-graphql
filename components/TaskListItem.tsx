import React, { useEffect } from "react";
import Link from "next/link";
import {
  Task,
  useDeleteTaskMutation,
  TaskStatus,
  TasksQueryVariables,
  TasksQuery,
  TasksDocument,
  useChangeStatusMutation,
} from "../generated/graphql";

interface Props {
  task: Task;
}
const TaskListItem: React.FC<Props> = ({ task }) => {
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    update: (cache, result) => {
      const data = cache.readQuery<TasksQuery, TasksQueryVariables>({
        query: TasksDocument,
        variables: { status: undefined },
      });
      if (data) {
        cache.writeQuery<TasksQuery, TasksQueryVariables>({
          query: TasksDocument,
          variables: { status: undefined },
          data: {
            tasks: data.tasks.filter(
              ({ id }) => id !== result.data?.deleteTask?.id
            ),
          },
        });
      }
    },
  });
  const handleDeleteClick = () => {
    deleteTask({ variables: { id: task.id } });
  };

  const [
    changeStatus,
    { loading: changingStatus, error: changeStatusError },
  ] = useChangeStatusMutation();

  useEffect(() => {
    if (error) {
      alert("An error occurred.");
    }

    if (changeStatusError) {
      alert("Could not change the task status.");
    }
  }, [error, changeStatusError]);

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus =
      task.status === TaskStatus.Active
        ? TaskStatus.Completed
        : TaskStatus.Active;
    changeStatus({ variables: { id: task.id, status: newStatus } });
  };

  return (
    <li className="task-list-item">
      <label className="checkbox">
        <input
          type="checkbox"
          onChange={handleChangeStatus}
          checked={task.status === TaskStatus.Completed}
          disabled={changingStatus}
        />
        <span className="checkbox-mark">&#10003;</span>
      </label>
      <Link href="/update/[id]" as={`/update/${task.id}`}>
        <a className="task-list-item-title"> {task.title}</a>
      </Link>
      <button
        disabled={loading}
        onClick={handleDeleteClick}
        className="task-list-item-delete"
      >
        &times;
      </button>
    </li>
  );
};

export default TaskListItem;
