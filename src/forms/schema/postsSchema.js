import * as yup from "yup";

export const postSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
  sections: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Section title is required"),
        body: yup.string().required("Section body is required"),
      })
    )
    .min(1, "At least one section is required"),
});
