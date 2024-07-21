import * as yup from "yup";

export const register_schema = yup.object({
  username: yup.string().required("username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  isSeller: yup.boolean().required(),
  storeName: yup.string().when("isSeller", {
    is: true,
    then: (schema) =>
      schema.min(3, "store name must have atleast 3 character").required(),
    otherwise: (schema) => schema.nullable(),
  }),
});
export const login_schema = yup.object({
  username: yup.string().required("username is required"),
  password: yup.string().required("Password is required"),
});

export const product_schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  description: yup.string().trim().required("Description is required"),
  category: yup.string().trim().required("Category is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be at least 0"),
  quantityAvailable: yup
    .number()
    .required("Quantity available is required")
    .min(0, "Quantity must be at least 0"),
});
