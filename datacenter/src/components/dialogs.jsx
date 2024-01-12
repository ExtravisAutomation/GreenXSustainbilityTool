import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme, styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const StyledPaper = styled(Paper)`
  & {
    border-radius: 10px;
    background-color: transparent;
  }
`;

export default function DefaultDialog({ title, open, sx, children, ...rest }) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      maxWidth="md"
      sx={{ zIndex: "999", ...sx }}
      PaperComponent={StyledPaper}
      {...rest}
    >
      <DialogTitle
        sx={{
          color: theme?.palette?.dialog?.title_text,
          backgroundColor: theme?.palette?.dialog?.title_background,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          color: theme?.palette?.dialog?.content_text,
          backgroundColor: theme?.palette?.dialog?.content_background,
        }}
      >
        {children}
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>{submitText}</Button>
      </DialogActions> */}
    </Dialog>
  );
}
