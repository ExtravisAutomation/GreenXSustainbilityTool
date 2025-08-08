import * as XLSX from "xlsx";

export const getTitle = (dataKey) => {
  return dataKey
    ?.split("_")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const convertToJson = (headers, fileData) => {
  let rows = [];
  fileData.forEach((row) => {
    const rowData = {};
    headers.forEach((element, index) => {
      if (row[index]) {
        rowData[element] = row[index];
      } else {
        rowData[element] = "";
      }
    });
    rows.push(rowData);
  });
  rows = rows.filter((value) => JSON.stringify(value) !== "{}");
  return rows;
};

// Function to handle file selection
export const handleFileChange = (event, convertToJson, handlePostSeed) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsBinaryString(file);
  reader.onload = (e) => {
    const bstr = e.target.result;
    const workbook = XLSX.read(bstr, { type: "binary" });
    const workSheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[workSheetName];
    const fileData = XLSX.utils.sheet_to_json(workSheet, {
      header: 1,
      raw: false,
    });
    const headers = fileData[0];
    fileData.splice(0, 1);
    let data = convertToJson(headers, fileData);
    handlePostSeed(data);
  };
};

export const columnGenerator = (dataKeys, getColumnSearchProps, getTitle) => {
  return dataKeys.map((dataKey) => {
    return {
      title: getTitle(dataKey),
      dataIndex: dataKey,
      key: dataKey,
      ellipsis: true,
      ...getColumnSearchProps(dataKey),
    };
  });
};

export const jsonToExcel = (jsonData, fileName) => {
  let wb = XLSX.utils.book_new();
  let binarySeedData = XLSX.utils.json_to_sheet(jsonData);
  XLSX.utils.book_append_sheet(wb, binarySeedData, fileName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const formSetter = (data, setValue) => {
  if (data) {
    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });
  }
};

export const generateNumbersArray = (upToValue) => {
  return Array.from({ length: upToValue + 1 }, (_, index) => index);
};

export const generateObject = (dataKeys) => {
  return Object.fromEntries(dataKeys.map((key) => [key, ""]));
};

// dynamicFilterUtils.js

export const customFilter = (filterValue, record, dataSource, key) => {
  const allValues = dataSource
    .map((item) => item?.[key])
    .filter((val) => val !== null);

  if (!allValues.length) return false;

  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const avgValue =
    allValues.reduce((sum, val) => sum + val, 0) / allValues.length;

  switch (filterValue) {
    case "max":
      return record?.[key] === maxValue;
    case "min":
      return record?.[key] === minValue;
    case "average":
      return record?.[key] === avgValue;
    default:
      return false;
  }
};

// const menuItems = [
//   { id: "Atom", name: "Atom", path: "/" },
//   {
//     id: "password",
//     name: "Password Group",
//     children: [
//       {
//         id: "web-development",
//         name: "Web Development",
//         path: "atom",
//       },
//       {
//         id: "mobile-app-development",
//         name: "Mobile App Development",
//         path: "/mobile-app-development",
//       },
//       {
//         id: "design",
//         name: "Design",
//         children: [
//           { id: "ui-ux-design", name: "UI/UX Design", path: "/ui-ux-design" },
//           {
//             id: "graphic-design",
//             name: "Graphic Design",
//             path: "atom",
//           },
//         ],
//       },
//     ],
//   },
//   { id: "about-us", name: "About Us", path: "atom" },
// ];

//   {
//     title: "Board",
//     dataIndex: "board",
//     key: "board",
//     render: (text, record) => {
//       const icon =
//         record.board === "true" ? (
//           <div
//             style={{
//               color: "#3D9E47",
//               background: "#F1F6EE",
//               width: "80%",
//               margin: "0 auto",
//               padding: "3px 2px",
//               borderRadius: "15px",
//               textAlign: "center",
//             }}
//           >
//             true
//           </div>
//         ) : (
//           <div
//             style={{
//               color: "#E34444",
//               background: "#FFECE9",
//               width: "80%",
//               margin: "0 auto",
//               padding: "3px 2px",
//               borderRadius: "15px",
//               textAlign: "center",
//             }}
//           >
//             false
//           </div>
//         );
//       return <span>{icon}</span>;
//     },
//   },
