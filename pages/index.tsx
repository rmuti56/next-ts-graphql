import React from "react";
import { NextPage } from "next";
import { withApollo } from "../lib/apollo";
import { useTasksQuery, TaskStatus } from "../generated/graphql";
import TaskList from "../components/TaskList";
import CreateTaskForm from "../components/CreateTaskForm";

interface InitialProps {}

interface Props extends InitialProps {}

const IndexPage: NextPage<Props, InitialProps> = () => {
  const { loading, error, data, refetch } = useTasksQuery({
    variables: { status: undefined },
  });
  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>An error qccurrend.</p>;
  }
  const tasks = data?.tasks;
  return (
    <>
      <CreateTaskForm onTaskCreated={refetch} />
      {tasks ? <TaskList tasks={tasks} /> : <p>There are no tasks here</p>}
    </>
  );
};

const IndexPageWithApollo = withApollo(IndexPage);
export default IndexPageWithApollo;
