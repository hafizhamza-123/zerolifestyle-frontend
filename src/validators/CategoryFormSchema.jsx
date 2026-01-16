import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .matches(/^[A-Za-z\s-]+$/, "Name must contain only letters, spaces or hyphens")
    .max(30, "Category name must be at most 30 characters"),
});
