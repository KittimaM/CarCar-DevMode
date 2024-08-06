import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PostAdminTemplate } from "../../Api";
import AdminTemplate from "./AdminTemplate";

const AdminAddTemplate = () => {
  const [template, setTemplate] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
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
          setIsSuccess(true);
        } else {
          console.log(data);
        }
      });
    } else {
      console.log("need value in template");
    }
  };
  return (
    <div>
      <form onSubmit={handleAddTemplate}>
        <label>Name</label>
        <input type="text" name="name" />
        <input type="checkbox" role="switch" name="is_available" />
        <label>is available</label>
        <ReactQuill value={template} onChange={setTemplate} modules={modules} />
        <button className="btn" type="submit">
          Submit
        </button>
        <button className="btn">Cancel</button>
      </form>
    </div>
  );
};

export default AdminAddTemplate;
