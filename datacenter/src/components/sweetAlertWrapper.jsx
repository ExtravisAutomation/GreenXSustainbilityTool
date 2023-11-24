import Swal from "sweetalert2";

const sweetAlertWrapper = {
  success: (title, text) => Swal.fire({ icon: "success", title, html: text  }),
  error: (title, text) => Swal.fire({ icon: "error", title, html: text }),
  warning: (title, text) => Swal.fire({ icon: "warning", title, html: text }),
  info: (title, text) => Swal.fire({ icon: "info", title, html: text }),
  custom: (options) => Swal.fire(options),
  callback: (icon, title, text, callback) =>
    Swal.fire({ icon, title, html: text }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    }),
};

export default sweetAlertWrapper;

export const handleSuccessAlert = (message) => {
  sweetAlertWrapper.success("Success!", message);
};

export const handleErrorAlert = (message) => {
  sweetAlertWrapper.error("Error!", message);
};

export const handleWarningAlert = (message) => {
  sweetAlertWrapper.warning("Warning!", message);
};

export const handleInfoAlert = (message) => {
  sweetAlertWrapper.info("Info!", message);
};

export const handleCustomAlert = (icon, title, text) => {
  sweetAlertWrapper.custom({
    icon,
    title,
    text,
  });
};

export const handleCallbackAlert = (
  message,
  callback,
  type = "warning",
  title = null
) => {
  if (type === "success") {
    sweetAlertWrapper.callback(type, title ?? "Success!", message, callback);
  } else if (type === "error") {
    sweetAlertWrapper.callback(type, title ?? "Error!", message, callback);
  } else if (type === "warning") {
    sweetAlertWrapper.callback(type, title ?? "Warning!", message, callback);
  } else if (type === "info") {
    sweetAlertWrapper.callback(type, title ?? "Info!", message, callback);
  }
};
