import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteSavedJob({ savedJobId, onDelete }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Are you you want to delete this saved job?"))
      startTransition(() => onDelete(savedJobId));
  }

  return (
    <button onClick={handleDelete} className="group cursor-pointer">
      {!isPending ? (
        <span>
          <TrashIcon className="h-5 w-5 text-primary-400 group-hover:text-primary-500 transition-colors" />
        </span>
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}

export default DeleteSavedJob;
