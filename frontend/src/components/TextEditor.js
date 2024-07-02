import React, { useEffect, useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/authProvider";
import "katex/dist/katex.min.css";
import Navbar from "./Navbar";
const TextEditor = () => {
  const [value, setValue] = useState("");
  const [isloggedin, setIsLoggedIn] = useState(false);
  const authData = useContext(AuthContext);

  if (authData.authData) {
    setIsLoggedIn(true);
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["code-block"],
      ["formula"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
    "video",
    "code-block",
    "formula",
  ];

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="flex flex-col h-screen ">
      <Navbar></Navbar>
      <div className="flex flex-1">
        <div className="w-1/2 pr-4 border-r px-2">
          <h2 className="text-2xl font-bold py-4">Editor</h2>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            className="h-full"
          />
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold py-4">Preview</h2>
          <Preview value={value} />
        </div>
      </div>
    </div>
  );
};

const Preview = ({ value }) => {
  return (
    <div
      className="h-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default TextEditor;
