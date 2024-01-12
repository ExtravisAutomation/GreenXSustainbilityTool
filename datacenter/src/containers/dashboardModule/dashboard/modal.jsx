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
// } from "../../../store/features/atomModule/atom/apis";
// import {
//   useFetchSiteNamesQuery,
//   useFetchRackNamesQuery,
//   useFetchVendorNamesQuery,
//   useFetchFunctionNamesQuery,
//   useFetchDeviceTypeNamesQuery,
//   useFetchPasswordGroupNamesQuery,
// } from "../../../store/features/dropDowns/apis";
// import { useSelector } from "react-redux";
// import {
//   selectSiteNames,
//   selectRackNames,
//   selectVendorNames,
//   selectFunctionNames,
//   selectDeviceTypeNames,
//   selectPasswordGroupNames,
// } from "../../../store/features/dropDowns/selectors";
// import useErrorHandling from "../../../hooks/useErrorHandling";
// import { formSetter, generateNumbersArray } from "../../../utils/helpers";

// const schema = yup.object().shape({
//   ip_address: yup.string().required("Ip address is required"),
 
// });

// const Index = ({ handleClose, open, recordToEdit }) => {
//   const theme = useTheme();

//   // states
//   const [initialRender, setInitialRender] = useState(true);

//   // useForm hook
//   const { handleSubmit, control, setValue, watch, trigger } = useForm({
//     resolver: yupResolver(schema),
//   });

//   // effects
//   useEffect(() => {
//     formSetter(recordToEdit, setValue);
//   }, []);

//   useEffect(() => {
//     // skip the first render
//     if (initialRender) {
//       setInitialRender(false);
//       return;
//     }

//     (async () => {
//       setValue("rack_name", "");
//       await trigger("rack_name");
//     })();
//   }, [watch("site_name")]);

//   useEffect(() => {
//     // skip the first render
//     if (initialRender) {
//       setInitialRender(false);
//       return;
//     }

//     (async () => {
//       await trigger("rack_name");
//     })();
//   }, [watch("rack_name")]);

//   // fetching dropdowns data from backend using apis
//   const { error: siteNamesError, isLoading: isSiteNamesLoading } =
//     useFetchSiteNamesQuery();
//   const { error: rackNamesError, isLoading: isRackNamesLoading } =
//     useFetchRackNamesQuery(
//       {
//         site_name: watch("site_name", ""),
//       },
//       { skip: watch("site_name") === undefined }
//     );

//   const { error: vendorNamesError, isLoading: isVendorNamesLoading } =
//     useFetchVendorNamesQuery();
//   const { error: functionNamesError, isLoading: isFunctionNamesLoading } =
//     useFetchFunctionNamesQuery();
//   const { error: deviceTypeNamesError, isLoading: isDeviceTypeNamesLoading } =
//     useFetchDeviceTypeNamesQuery();
//   const {
//     error: passwordGroupNamesError,
//     isLoading: isPasswordGroupNamesLoading,
//   } = useFetchPasswordGroupNamesQuery();

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
//   const siteNames = useSelector(selectSiteNames);
//   const rackNames = useSelector(selectRackNames);
//   const vendorNames = useSelector(selectVendorNames);
//   const functionNames = useSelector(selectFunctionNames);
//   const deviceTypeNames = useSelector(selectDeviceTypeNames);
//   const passwordGroupNames = useSelector(selectPasswordGroupNames);

//   // on form submit
//   const onSubmit = (data) => {
//     console.log(data);
//     if (recordToEdit) {
//       if (recordToEdit.atom_id) {
//         data.atom_id = recordToEdit.atom_id;
//       } else if (recordToEdit.atom_transition_id) {
//         data.atom_transition_id = recordToEdit.atom_transition_id;
//       }
//     }

//     if (
//       recordToEdit &&
//       (recordToEdit.atom_id || recordToEdit.atom_transition_id)
//     ) {
//       updateRecord(data);
//     } else {
//       addRecord(data);
//     }
//   };

//   return (
//     <FormModal
//       sx={{ zIndex: "999" }}
//       title={`${recordToEdit ? "Edit" : "Add"} Atom`}
//       open={open}
//     >
//       <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "15px" }}>
//         <Grid container spacing={5}>
//           <Grid item xs={12} sm={4}>
//             <DefaultFormUnit control={control} dataKey="ip_address" required />
//             <SelectFormUnit
//               control={control}
//               dataKey="site_name"
//               options={siteNames}
//               required
//             />
//             <SelectFormUnit
//               control={control}
//               dataKey="rack_name"
//               options={rackNames}
              
//             />
//             <DefaultFormUnit control={control} dataKey="section" />
//             <DefaultFormUnit control={control} dataKey="department" />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <SelectFormUnit
//               control={control}
//               dataKey="device_ru"
//               options={generateNumbersArray(30)} 
//             />
//             <SelectFormUnit
//               control={control}
//               dataKey="function"
//               options={functionNames}
//             />
//             <SelectFormUnit
//               control={control}
//               dataKey="device_type"
//               options={deviceTypeNames}
//             />
//             <DefaultFormUnit control={control} dataKey="device_name"/>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <SelectFormUnit
//               control={control}
//               dataKey="vendor"
//               options={vendorNames}
//             />
//             <SelectFormUnit
//               control={control}
//               dataKey="password_group"
//               options={passwordGroupNames}
//             />
//             <DefaultFormUnit control={control} dataKey="criticality"/>
//             <DefaultFormUnit control={control} dataKey="virtual" />
//             <DefaultFormUnit control={control} dataKey="domain" />
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
