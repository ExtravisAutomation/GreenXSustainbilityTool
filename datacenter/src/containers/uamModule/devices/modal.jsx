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
// } from "../../../store/features/uamModule/devices/apis";
// import { useFetchSiteNamesQuery } from "../../../store/features/dropDowns/apis";
// import { useSelector } from "react-redux";
// import { selectSiteNames } from "../../../store/features/dropDowns/selectors";
// import useErrorHandling from "../../../hooks/useErrorHandling";
// import { formSetter } from "../../../utils/helpers";

// const schema = yup.object().shape({
//   rack_name: yup.string().required("Rack name is required"),
//   site_name: yup.string().required("Site name is required"),
// });

// const Index = ({ handleClose, open, recordToEdit }) => {
//   const theme = useTheme();

//   // states

//   // useForm hook
//   const { handleSubmit, control, setValue, watch, trigger } = useForm({
//     resolver: yupResolver(schema),
//   });

//   // effects
//   useEffect(() => {
//     formSetter(recordToEdit, setValue);
//   }, []);

//   // fetching dropdowns data from backend using apis
//   const { error: siteNamesError, isLoading: isSiteNamesLoading } =
//     useFetchSiteNamesQuery();

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

//   // ///getting dropdowns data from the store
//   const siteNames = useSelector(selectSiteNames);

//   // on form submit
//   const onSubmit = (data) => {
//     if (recordToEdit) {
//       data.device_id = recordToEdit.device_id;
//       updateRecord(data);
//     } else {
//       addRecord(data);
//     }
//   };

//   return (
//     <FormModal
//       sx={{ zIndex: "999" }}
//       title={`${recordToEdit ? "Edit" : "Add"} Rack`}
//       open={open}
//     >
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={4}>
//             <DefaultFormUnit
//               control={control}
//               dataKey="rack_name"
//               disabled={recordToEdit !== null}
//               required
//             />

//             <SelectFormUnit
//               control={control}
//               dataKey="site_name"
//               options={siteNames}
//               required
//             />
//             <DefaultFormUnit control={control} dataKey="function" />
//             <DefaultFormUnit control={control} dataKey="ru" />
//             <DefaultFormUnit control={control} dataKey="section" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <DefaultFormUnit control={control} dataKey="department" />
//             <DefaultFormUnit control={control} dataKey="criticality" required />
//             <DefaultFormUnit control={control} dataKey="virtual" />
//             <DefaultFormUnit control={control} dataKey="software_version" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <DefaultFormUnit control={control} dataKey="manufacturer" />
//             <DefaultFormUnit control={control} dataKey="authentication" />
//             <DefaultFormUnit control={control} dataKey="serial_number" />
//             <DefaultFormUnit control={control} dataKey="pn_code" />
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
