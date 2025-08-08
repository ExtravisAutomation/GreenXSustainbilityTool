import Card from './Card';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';

const StyledStripItem = styled(Card)`
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 25px 0;
  display: flex;
  align-items: center;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  width: 80%;
  max-width: 600px;
`;

const StyledIcon = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 20px;
`;

const StyledText = styled.p`
  font-size: 1rem;
  font-weight: 500;
  line-height: 180%;
  color: #222222;
  margin: 0;
  flex: 1;
  text-align: left;
`;

const StripItem = ({ items }) => {
  const theme = useTheme();

  return (
    <>
      <StyledStripItem theme={theme}>
        {items.map((item, index) => (
          <Wrapper>
            <StyledIcon src={item.icon} alt="Icon" />
            <StyledText dangerouslySetInnerHTML={{ __html: item.text }} />
          </Wrapper>
        ))}
      </StyledStripItem>
    </>
  );
};

export default StripItem;
