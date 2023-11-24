import { useEffect } from "react";
import {
  handleSuccessAlert,
  handleInfoAlert,
  handleErrorAlert,
} from "../components/sweetAlertWrapper";

export default function useErrorHandling({
  data,
  isSuccess,
  isError,
  error,
  type,
}) {
  useEffect(() => {
    if (type === "fetch") {
      if (isSuccess) {
        // handleSuccessAlert("Data Fetched Successfully");
        console.log("Data Fetched Successfully");
      } else if (isError) {
        if (error?.status === 400) {
          handleErrorAlert(error?.data);
        } else if (error?.status === 404) {
          handleErrorAlert(error?.data?.detail);
        } else if (error?.status === 500) {
          handleErrorAlert(error?.data);
        } else {
          console.log(error);
        }
      }
    } else if (type === "single") {
      if (isSuccess) {
        handleSuccessAlert(data?.message);
      } else if (isError) {
        if (error?.status === 400) {
          handleErrorAlert(error?.data);
        } else if (error?.status === 404) {
          handleErrorAlert(error?.data?.detail);
        } else if (error?.status === 422) {
          handleErrorAlert(
            error?.data?.detail
              .map(
                (item) =>
                  `${item?.loc[2]} ${item?.msg} in ${item?.loc[0]} at index  ${item?.loc[1]}`
              )
              .join("<br>")
          );
        } else if (error?.status === 500) {
          handleErrorAlert(error?.data);
        } else {
          console.log(error);
        }
      }
    } else if (type === "bulk") {
      if (isSuccess) {
        if (data?.error === 0) {
          handleSuccessAlert(data?.success_list?.join("<br>"));
        } else if (data?.success === 0) {
          handleErrorAlert(data?.error_list?.join("<br>"));
        } else {
          handleInfoAlert(
            `${data?.success_list?.join("<br>")}<br>${data?.error_list?.join(
              "<br>"
            )}`
          );
        }
      } else if (isError) {
        if (error?.status === 400) {
          handleErrorAlert(error?.data);
        } else if (error?.status === 404) {
          handleErrorAlert(error?.data?.detail);
        } else if (error?.status === 422) {
          handleErrorAlert(
            error?.data?.detail
              .map(
                (item) =>
                  `${item?.loc[2]} ${item?.msg} in ${item?.loc[0]} at index  ${item?.loc[1]}`
              )
              .join("<br>")
          );
        } else if (error?.status === 500) {
          handleErrorAlert(error?.data);
        } else {
          console.log(error);
        }
      }
    }
  }, [isSuccess, isError]);
}
