import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UpdateAdminTemplate } from "../../Api";
const AdminEditTemplate = ({ ediItem }) => {
  const [template, setTemplate] = useState(ediItem.template);

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
  const handleEditTemplate = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: ediItem.id,
      name: data.get("name"),
      is_available: data.get("is_available") !== null ? 1 : 0,
      template: template,
    };
    UpdateAdminTemplate(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
      } else {
        console.log(data);
      }
    });
  };
  return (
    <div>
      <form onSubmit={handleEditTemplate}>
        <label>Name</label>
        <input type="text" name="name" defaultValue={ediItem.name} />
        <input
          type="checkbox"
          role="switch"
          name="is_available"
          defaultChecked={ediItem.is_available == 1}
        />
        <label>is available</label>
        <ReactQuill
          defaultValue={template}
          onChange={setTemplate}
          modules={modules}
        />
        <button className="btn" type="submit">
          Submit
        </button>
        <button className="btn">Cancel</button>
      </form>
    </div>
  );
};

export default AdminEditTemplate;
