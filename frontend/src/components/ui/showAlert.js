import { useTheme } from '@mui/material/styles';
import Swal from 'sweetalert2';

export const useShowAlert = () => {
  const theme = useTheme();
  const isDarkMode = theme?.mode === 'dark';

  return ({ title, icon, onClose }) => {
    Swal.fire({
      title,
      icon,
      confirmButtonText: 'OK',
      onClose,
      customClass: {
        container:
          theme?.mode == 'light'
            ? 'custom-swal-container'
            : 'custom-swal-container-dark',
        title: 'custom-swal-title',
        confirmButton: theme?.name?.includes('Purple')
          ? 'custom-swal-button-purple'
          : theme?.name?.includes('Green')
            ? 'custom-swal-button-green'
            : 'custom-swal-button-blue',
      },
      // customClass: {
      //   container: isDarkMode
      //     ? 'custom-swal-container-dark'
      //     : 'custom-swal-container-light',
      //   title: isDarkMode ? 'custom-swal-title-dark' : 'custom-swal-title-light',
      //   confirmButton: isDarkMode
      //     ? 'custom-swal-button-dark'
      //     : 'custom-swal-button-light',
      // },
    });
  };
};
