import React, { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import { TextField } from "../components";
import { Editor } from "@tinymce/tinymce-react";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { userIsLoggedIn, getUser } from "../services/auth";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Document = ({ setCurrentRoute }) => {
  const editorRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data } = useSWR(
    `http://localhost:3001/document/${params.id === undefined ? 0 : params.id}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  setCurrentRoute(location.pathname);

  const loadingDocument = async () => {
    if (params.id !== undefined) {
      setTitle(data.document.title);
      setContent(data.document.content);
    }
  };

  const updateDocument = async () => {
    if (params.id !== undefined) {
      await fetch(`http://localhost:3001/document/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          content: editorRef.current.getContent(),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } else {
      const response = await fetch(`http://localhost:3001/document`, {
        method: "POST",
        body: JSON.stringify({
          title,
          content: editorRef.current.getContent(),
          user_id: user.id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      navigate(`/document/${data._id}`);
    }
  };

  useEffect(() => {
    loadingDocument();
  }, [data]);

  useEffect(() => {
    userIsLoggedIn(navigate, null);
  }, []);

  return (
    <Box
      style={{
        padding: 20,
      }}
    >
      <TextField
        style={{
          marginBottom: 16,
        }}
        label={"Title"}
        fullWidth={true}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={content}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <Button variant="contained" onClick={updateDocument}>
        Save
      </Button>
    </Box>
  );
};

export default Document;
