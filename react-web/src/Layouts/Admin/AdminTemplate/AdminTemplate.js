import React, { useEffect, useState } from "react";

import { DeleteAdminTemplate, GetAdminAllTemplate } from "../../Api";
import AdminAddTemplate from "./AdminAddTemplate";
import AdminEditTemplate from "./AdminEditTemplate";

const AdminTemplate = ({ data }) => {
  const { labelValue, permission } = data;
  const [isSelectedAllTemplate, setIsSelectedAllTemplate] = useState(true);
  const [isSelectedAddTemplate, setIsSelectedAddTemplate] = useState(false);
  const [templateList, setTemplateList] = useState();
  const [editItem, setEditItem] = useState(null);

  const fetchAllTemplate = () => {
    GetAdminAllTemplate().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setTemplateList(msg);
      } else if (status == "NO DATA") {
        setTemplateList(null);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchAllTemplate();
  }, []);

  const handleSelectEditId = (selectedItem) => {
    setIsSelectedAddTemplate(false);
    setIsSelectedAllTemplate(false);
    setEditItem(selectedItem);
  };

  const handleDeleteChannel = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteAdminTemplate(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAllTemplate();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setIsSelectedAllTemplate(value == "allTemplate" ? true : false);
    setIsSelectedAddTemplate(value == "addTemplate" ? true : false);
    setEditItem(null);
    if (value == "allTemplate") {
      fetchAllTemplate();
    }
  };

  return (
    <div className="ml-80 mt-16">
      <div className="text-lg bg-yellow-100 mb-5 ">{labelValue}</div>
      <button
        value="allTemplate"
        className="btn"
        disabled={isSelectedAllTemplate}
        onClick={handleSelectedContent}
      >
        All Template
      </button>
      {permission.includes("2") && (
        <button
          value="addTemplate"
          class="btn"
          onClick={handleSelectedContent}
          disabled={isSelectedAddTemplate}
        >
          Add Template
        </button>
      )}
      {isSelectedAllTemplate && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>name</td>
              <td>is available</td>
              {permission && permission.includes("3") && <td>Edit</td>}
              {permission && permission.includes("4") && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {templateList &&
              templateList.map((template) => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>
                    {template.is_available == 1 ? "available" : "not available"}
                  </td>
                  {permission && permission.includes("3") && (
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSelectEditId(template)}
                        value={template.id}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {permission && permission.includes("4") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleDeleteChannel}
                        value={template.id}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {isSelectedAddTemplate && <AdminAddTemplate permission={permission} />}
      {editItem && <AdminEditTemplate ediItem={editItem} />}
    </div>
  );
};

export default AdminTemplate;
