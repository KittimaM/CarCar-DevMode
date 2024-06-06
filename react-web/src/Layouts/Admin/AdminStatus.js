import React, { useState, useEffect } from "react";
import {
  DeleteStatus,
  GetAllStatus,
  GetAllStatusGroup,
  PostAddStatus,
  UpdateStatus,
} from "../Api";

const AdminStatus = ({ permission }) => {
  const [statusGroups, setStatusGroups] = useState();
  const [statuses, setStatuses] = useState();
  const [editItem, setEditItem] = useState(null);

  const fetchAllStatus = () => {
    GetAllStatusGroup().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setStatusGroups(msg);
      } else {
        console.log(data);
      }
    });
    GetAllStatus().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setStatuses(msg);
      } else {
        console.log(data);
      }
    });
  };
  useEffect(() => {
    fetchAllStatus();
  }, []);

  const handleAddStatus = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      code: data.get("code"),
      description: data.get("description"),
      status_group_id: data.get("status_group_id"),
    };
    PostAddStatus(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAllStatus();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditStatus = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      code: data.get("code"),
      description: data.get("description"),
      status_group_id: data.get("status_group_id"),
    };
    UpdateStatus(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setEditItem(null);
        fetchAllStatus();
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteStatus = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteStatus(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAllStatus();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 ">Status</div>
        {permission && permission.includes("2") && (
          <div>
            <form onSubmit={handleAddStatus}>
              <label>Code</label>
              <input type="text" name="code" />
              <label>description</label>
              <input type="text" name="description" />
              <select name="status_group_id">
                {statusGroups &&
                  statusGroups.map((statusGroup) => (
                    <option key={statusGroup.id} value={statusGroup.id}>
                      {statusGroup.code}
                    </option>
                  ))}
              </select>
              <button className="btn" type="submit">
                Add
              </button>
            </form>
          </div>
        )}
        {statusGroups &&
          statusGroups.map((statusGroup) => (
            <div>
              {statusGroup.code} - {statusGroup.description}
              <table className="table table-lg">
                <thead>
                  <tr>
                    <td>code</td>
                    <td>description</td>
                    {permission && permission.includes("3") && <td>Edit</td>}
                    {permission && permission.includes("4") && <td>Delete</td>}
                  </tr>
                </thead>
                <tbody>
                  {statuses &&
                    statuses.map(
                      (status) =>
                        status.status_group_id == statusGroup.id && (
                          <tr>
                            <td>{status.code}</td>
                            <td>{status.description}</td>
                            {permission && permission.includes("3") && (
                              <td>
                                <button
                                  className="btn"
                                  onClick={() => handleSelectEditId(status)}
                                  value={status.id}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                            {permission && permission.includes("4") && (
                              <td>
                                <button
                                  className="btn"
                                  onClick={handleDeleteStatus}
                                  value={status.id}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                    )}
                </tbody>
              </table>
            </div>
          ))}

        {permission && permission.includes("3") && editItem && (
          <form onSubmit={handleEditStatus}>
            <label>code</label>
            <input type="text" name="code" defaultValue={editItem.code} />
            <label>description</label>
            <input
              type="text"
              name="description"
              defaultValue={editItem.description}
            />
            <button className="btn" type="submit">
              Submit Edit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminStatus;
