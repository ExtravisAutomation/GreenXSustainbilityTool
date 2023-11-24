// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import FormModal from "../../../components/dialogs";
// import Grid from "@mui/material/Grid";
// import DefaultFormUnit from "../../../components/formUnits";
// import { SelectFormUnit } from "../../../components/formUnits";
// import DefaultDialogFooter from "../../../components/dialogFooters";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useTheme } from "@mui/material/styles";
// import {
//   useUpdateRecordMutation,
//   useAddRecordMutation,
// } from "../../../store/features/atomModule/passwordGroup/apis";
// import {
//   useFetchPasswordGroupNamesQuery,
//   useFetchPasswordGroupTypeNamesQuery,
// } from "../../../store/features/dropDowns/apis";
// import { useSelector } from "react-redux";
// import {
//   selectPasswordGroupNames,
//   selectPasswordGroupTypeNames,
// } from "../../../store/features/dropDowns/selectors";
// import useErrorHandling from "../../../hooks/useErrorHandling";
// import { formSetter } from "../../../utils/helpers";

// const schema = yup.object().shape({
//   password_group: yup.string().required("Password Group is required"),
//   username: yup.string().required("User name is required"),
//   password: yup.string().required("Password is required"),
//   password_group_type: yup.string().required("Password group type is required"),
//   secret_password: yup
//     .string()
//     .when("password_group_type", (passwordGroupType, schema) => {
//       if (passwordGroupType == "TELNET")
//         return schema.required("Secret password is required");
//       return schema;
//     }),
// });

// const Index = ({ handleClose, open, recordToEdit }) => {
//   const theme = useTheme();

//   // states
//   const [isSecretPasswordDisable, setIsSecretPasswordDisable] = useState(false);

//   // useForm hook
//   const { handleSubmit, control, setValue, watch, trigger } = useForm({
//     resolver: yupResolver(schema),
//   });

//   // effects
//   useEffect(() => {
//     formSetter(recordToEdit, setValue);
//   }, []);

//   useEffect(() => {
//     if (watch("password_group_type") === "SSH") {
//       setValue("secret_password", "");
//       setIsSecretPasswordDisable(true);
//     } else {
//       setIsSecretPasswordDisable(false);
//     }
//     trigger("secret_password");
//   }, [watch("password_group_type")]);

//   // fetching dropdowns data from backend using apis
//   const {
//     error: passwordGroupNamesError,
//     isLoading: isPasswordGroupNamesLoading,
//   } = useFetchPasswordGroupNamesQuery();

//   const {
//     error: passwordGroupTypeNamesError,
//     isLoading: isPasswordGroupTypeNamesLoading,
//   } = useFetchPasswordGroupTypeNamesQuery();

//   // post api for the form
//   const [
//     addRecord,
//     {
//       data: addRecordData,
//       isSuccess: isAddRecordSuccess,
//       isLoading: isAddRecordLoading,
//       isError: isAddRecordError,
//       error: addRecordError,
//     },
//   ] = useAddRecordMutation();

//   const [
//     updateRecord,
//     {
//       data: updateRecordData,
//       isSuccess: isUpdateRecordSuccess,
//       isLoading: isUpdateRecordLoading,
//       isError: isUpdateRecordError,
//       error: updateRecordError,
//     },
//   ] = useUpdateRecordMutation();

//   // error handling custom hooks
//   useErrorHandling({
//     data: addRecordData,
//     isSuccess: isAddRecordSuccess,
//     isError: isAddRecordError,
//     error: addRecordError,
//     type: "single",
//   });

//   useErrorHandling({
//     data: updateRecordData,
//     isSuccess: isUpdateRecordSuccess,
//     isError: isUpdateRecordError,
//     error: updateRecordError,
//     type: "single",
//   });

//   // getting dropdowns data from the store
//   const passwordGroupNames = useSelector(selectPasswordGroupNames);
//   const passwordGroupTypeNames = useSelector(selectPasswordGroupTypeNames);

//   // on form submit
//   const onSubmit = (data) => {
//     if (recordToEdit) {
//       data.password_group_id = recordToEdit.password_group_id;
//       updateRecord(data);
//     } else {
//       addRecord(data);
//     }
//   };

//   return (
//     <FormModal
//       sx={{ zIndex: "999" }}
//       title={`${recordToEdit ? "Edit" : "Add"} Password Group`}
//       open={open}
//     >
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container>
//           <Grid item xs={12}>
//             <DefaultFormUnit
//               control={control}
//               dataKey="password_group"
//               disabled={recordToEdit !== null}
//               required
//             />
//             <DefaultFormUnit control={control} dataKey="username" required />
//             <DefaultFormUnit control={control} dataKey="password" required />
//             <SelectFormUnit
//               control={control}
//               dataKey="password_group_type"
//               options={passwordGroupTypeNames}
//               required
//             />
//             <DefaultFormUnit
//               control={control}
//               dataKey="secret_password"
//               disabled={isSecretPasswordDisable}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <DefaultDialogFooter handleClose={handleClose} />
//           </Grid>
//         </Grid>
//       </form>
//     </FormModal>
//   );
// };

// export default Index;
