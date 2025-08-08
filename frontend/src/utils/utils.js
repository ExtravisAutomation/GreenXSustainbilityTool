export const renderStatusTag =(record, theme) => {
    return (
      <div
        style={{
          background:
            record === true
              ? theme?.palette?.status?.background
              : '#D21E164A',

          width: '59px',
          textAlign: 'center',
          height: '18px',
          borderRadius: '24px',
          // color: "#C8FF8C",
          color:
            record === true ? theme?.palette?.status?.color : '#D21E16',
          padding: '2px 5px',
        }}
      >
        {/* {text.ip_address == "172.31.100.12" && revert_status !== "true"
          ? "false"
          : "true"} */}
        {record === true ? 'True' : 'False'}
      </div>
    );
  }