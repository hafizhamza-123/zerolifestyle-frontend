import * as yup from "yup";

export const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[A-Za-z\s-]+$/, "Name must contain only letters, spaces or hyphens")
    .max(20, "Name must be at most 20 characters"),
    
  slug: yup
    .string()
    .required("Slug is required")
    .matches(/^[A-Za-z\s-]+$/, "Slug must contain only letters, spaces or hyphens")
    .max(20, "Slug must be at most 20 characters"),
    
  categoryId: yup.string().required("Category is required"),
  
  description: yup
    .string()
    .max(200, "Description must be at most 200 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),

  discountedPrice: yup
    .number()
    .typeError("Discounted Price must be a number")
    .min(0, "Cannot be negative")
    .lessThan(yup.ref("price"), "Discounted price must be less than price")
    .notRequired(),

  stockCount: yup
    .number()
    .typeError("Stock Count must be a number")
    .integer("Must be an integer")
    .min(0, "Cannot be negative")
    .required("Stock Count is required"),

  bestseller: yup.boolean(),
});


