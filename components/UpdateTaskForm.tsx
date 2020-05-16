import React, { useState, useEffect } from "react";
import { useUpdateTaskMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface Values {
  id: number;
  title: string;
}
interface Props {
  initialValues: Values;
}
const UpdateTaskForm: React.FC<Props> = ({ initialValues }) => {
  const [values, setValues] = useState<Values>({ ...initialValues });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(() => ({
      ...values,
      [name]: value,
    }));
  };

  const [updateTask, { loading, error, data }] = useUpdateTaskMutation();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTask({
      variables: {
        input: values,
      },
    });
  };

  const router = useRouter();

  useEffect(() => {
    if (data && data.updateTask) {
      router.push("/");
    }
  }, [data]);
  return (
    <form onSubmit={handleSubmit}>
      {error && <p>An error occurred.</p>}
      <p>
        <label className="field-label">Title</label>
        <input
          onChange={handleChange}
          value={values.title}
          type="text"
          name="title"
          className="text-input"
        />
      </p>
      <p>
        <button disabled={loading} type="submit" className="button">
          {loading ? "loading..." : "Save"}
        </button>
      </p>
    </form>
  );
};

export default UpdateTaskForm;
