import styled from "styled-components";
import { Form } from "antd";

// Define a reusable styled Form Item
const StyledFormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    font-weight: 600;
    color: gray !important;
  }

  .ant-form-item-control {
    input {
      height: 40px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.palette.main_layout?.border};
      &:hover {
        border-color: ${({ theme }) => theme.palette.main_layout?.border};
      }
    }
  }

  /* Custom error message styling */
  .ant-form-item-explain-error {
    font-size: 12px;
    color: ${({ theme }) => theme.palette.main_layout?.primar_text};
  }
`;

export default StyledFormItem;
