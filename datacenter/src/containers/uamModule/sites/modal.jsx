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
// } from "../../../store/features/uamModule/sites/apis";
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
//   site_name: yup.string().required("Site name is required"),
//   status: yup.string().required("Status is required"),
//   region_name: yup.string().required("Region name is required"),
//   latitude: yup.string().required("Latitude is required"),
//   longitude: yup.string().required("Longitude is required"),
//   city: yup.string().required("City is required"),
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
//   // const passwordGroupNames = useSelector(selectPasswordGroupNames);
//   // const passwordGroupTypeNames = useSelector(selectPasswordGroupTypeNames);

//   // on form submit
//   const onSubmit = (data) => {
//     if (recordToEdit) {
//       data.site_id = recordToEdit.site_id;
//       updateRecord(data);
//     } else {
//       addRecord(data);
//     }
//   };

//   return (
//     <FormModal
//       sx={{ zIndex: "999" }}
//       title={`${recordToEdit ? "Edit" : "Add"} Site`}
//       open={open}
//     >
//       <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <DefaultFormUnit
//               control={control}
//               dataKey="site_name"
//               disabled={recordToEdit !== null}
//               required
//             />

//             <DefaultFormUnit control={control} dataKey="status" required />
//             <DefaultFormUnit control={control} dataKey="region_name" required />
//             <DefaultFormUnit control={control} dataKey="device_name" required />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <DefaultFormUnit control={control} dataKey="latitude" required />
//             <DefaultFormUnit control={control} dataKey="longitude" required />
//             <DefaultFormUnit control={control} dataKey="city" required />
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
