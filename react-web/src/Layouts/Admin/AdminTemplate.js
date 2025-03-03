import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  DeleteAdminTemplate,
  GetAdminAllTemplate,
  PostAdminTemplate,
  UpdateAdminTemplate,
} from "../Api";

const AdminTemplate = ({ data }) => {
  const { labelValue, permission } = data;
  const [templateList, setTemplateList] = useState();
  const [editItem, setEditItem] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [template, setTemplate] = useState();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indet: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
    ],
  };

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
    setEditItem(selectedItem);
    setTemplate(selectedItem.template);
  };

  const handleEditTemplate = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      name: data.get("name"),
      is_available: data.get("is_available") !== null ? 1 : 0,
      template: template,
    };
    UpdateAdminTemplate(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setTemplate(null);
        setEditItem(null);
        fetchAllTemplate();
      } else {
        console.log(data);
      }
    });
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

  const handleAddTemplate = (event) => {
    event.preventDefault();
    if (template != undefined) {
      const data = new FormData(event.currentTarget);
      const jsonData = {
        name: data.get("name"),
        is_available: data.get("is_available") !== null ? 1 : 0,
        template: template,
      };
      PostAdminTemplate(jsonData).then((data) => {
        const { status, msg } = data;
        if (status == "SUCCESS") {
          setOpenAddForm(false);
          fetchAllTemplate();
        } else {
          console.log(data);
        }
      });
    } else {
      console.log("need value in template");
    }
  };

  return (
    <div className="lg:ml-64 p-4 flex-1 h-screen overflow-y-auto">
      <div className="text-lg bg-yellow-100 mb-5 ">{labelValue}</div>

      {permission && permission.includes("2") && (
        <button className="btn" onClick={() => setOpenAddForm(true)}>
          Add Template
        </button>
      )}

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
                <td>
                  <button
                    className="btn"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    preview
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {previewTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">{previewTemplate.name}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: previewTemplate.template }}
              style={{ height: "200px", overflowY: "auto" }}
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {openAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">New Template</h2>
            <form onSubmit={handleAddTemplate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <input
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  name="is_available"
                />
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                  is available
                </label>
              </div>
              <div className="mb-4">
                <ReactQuill
                  value={template}
                  onChange={setTemplate}
                  modules={modules}
                  style={{ height: "200px", overflowY: "auto" }}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setTemplate(null);
                    setOpenAddForm(false);
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Edit Template</h2>
            <form onSubmit={handleEditTemplate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  defaultValue={editItem.name}
                  type="text"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <input
                  defaultChecked={editItem.is_available == 1}
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  name="is_available"
                />
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                  is available
                </label>
              </div>
              <div className="mb-4">
                <ReactQuill
                  defaultValue={template}
                  onChange={setTemplate}
                  modules={modules}
                  style={{ height: "200px", overflowY: "auto" }}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => {
                    setEditItem(null);
                    setTemplate(null);
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplate;
