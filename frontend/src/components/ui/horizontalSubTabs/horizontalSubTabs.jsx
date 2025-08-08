import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';

const HorizontalSubTabs = ({ tabs, styles = {} }) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const TabsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
  `;

  const TabsHeader = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme?.palette?.divider || '#ccc'};
    background-color: ${theme?.palette?.default_card?.background || '#f0f0f0'};
    padding: ${styles?.tabsContent?.padding || '0'};
    margin: ${styles?.tabsContent?.margin || '10px 28px'};
  `;

  const Tab = styled.div`
    padding: 10px 20px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    width: ${(props) => `${100 / props.tabsLength}%`};
    border-bottom: ${(props) =>
      props.isActive
        ? `2px solid ${theme?.palette?.horizontal_menu?.secondary_text || '#007bff'}`
        : 'none'};
    color: ${(props) =>
      props.isActive
        ? theme?.palette?.horizontal_menu?.secondary_text || '#007bff'
        : theme?.palette?.horizontal_menu?.primary_text || 'black'};
    // font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};

    &:hover {
      // background-color: ${theme?.palette?.action?.hover || '#f0f0f0'};
      border-bottom: ${`2px solid ${theme?.palette?.horizontal_menu?.secondary_text || '#007bff'}`};
      color: ${theme?.palette?.horizontal_menu?.secondary_text || '#007bff'};
    }

    // Add a right border to separate tabs, except for the last one
    border-right: ${(props) =>
      props.isLast ? 'none' : `1px solid ${theme?.palette?.divider || '#ccc'}`};
  `;

  const TabsContent = styled.div`
    position: relative;
    overflow: hidden;
    padding: ${styles?.tabsContent?.padding || '0'};
    margin: ${styles?.tabsContent?.margin || '10px 0'};
  `;

  const TabContent = styled.div`
    display: ${(props) => (props.isActive ? 'block' : 'none')};
    opacity: ${(props) => (props.isActive ? 1 : 0)};
    transition: opacity 0.3s ease;
    position: ${(props) => (props.isActive ? 'relative' : 'absolute')};
    width: 100%;
  `;

  return (
    <TabsContainer>
      <TabsHeader>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            isActive={activeTab === index}
            onClick={() => handleTabClick(index)}
            tabsLength={tabs.length}
          >
            {tab.label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsContent>
        {tabs.map((tab, index) => (
          <TabContent key={index} isActive={activeTab === index}>
            {tab.content}
          </TabContent>
        ))}
      </TabsContent>
    </TabsContainer>
  );
};

export default HorizontalSubTabs;
