import { createTheme } from '@mui/material/styles';
import { lightThemeColors, darkThemeColors } from '../utils/constants/colors';
import { color } from 'echarts';
import { icon } from 'leaflet';

const PRIMARY_GREEN = '#48A345';
const PRIMARY_BLUE = '#0490E7';
const PRIMARY_PURPLE = '#9619B5';
const DARK_GREEN_LAYOUT_BG = '#03120d';
const DARK_GREEN_CONTENT_BG = '#040d0a';
const DARK_PURPLE_LAYOUT_BG = '#100B19';

const DARK_PURPLE_CONTENT_BG = '#1E1721';
const DARK_GREEN_INPUT_BG = '#172118';
const DARK_PURPLE_INPUT_BG = '#1E1721';

const WHITE = '#fff';

export const lightTheme = createTheme({
  name: 'lightGreen',
  mode: 'light',
  palette: {
    background: {
      default: '#F6F6F6',
    },

    main_layout: {
      contents_bg: '#F7F7F7F7',
      background: '#FFFFFF',
      profile_picture_background: '#ACACAC',
      primary_text: '#000000',
      secondary_text: PRIMARY_GREEN,
      border_bottom: '#D9D9D9',
      sideBar: {
        icon_color: PRIMARY_GREEN,
        icon_bg: '#48A3451F',
      },
    },
    available_options: {
      card_bg: '#FFFFFF',
      border: '#D9D9D9',
      border_bottom: '#D9D9D9',
      options_bg: '#FFFFFF',
      primary_text: '#000000',
      checkbox_bg: '#3D9E47',
    },
    graph: {
      title: 'black',
      xis: '',
      yAxis: '#D9D9D9',
      trailColor: '#E9F4E9',
      toolTip_bg: 'white',
      tooltip_border: 'lightgray',
      line_color: '#D9D9D9',
      graph_area: {
        from_top: '#85DB66',
        to_bottom: 'white',
        line: '#42AE46',
        // line: '#42AE46',
        secondary_tooltip: '#FDCF2B',
        secondary_line: '#FDCF2B',
        // secondary_line: '#0490E7',
      },
      // mycode:
      slider: {
        backgroundColor: '#e0e0e0',
        fillerColor: '#555555',
        hoverFillerColor: '#555555',
        handleColor: '#808080',
        handleHoverColor: '#555555',
        track: '#6f42c1',
        rail: '#ecdff9',
        handle: '#6f42c1',
      },
    },
    chat_bot: {
      icon: '',
      icon_bg: '#85DB66',
      messages_bg: '#FFFFFF',

      user: {
        background: '#68B144',
        color: 'white',
      },
      response: {
        background: '#a8c2a3',
        color: 'black',
      },
      background: {
        from_top: '#68B144',
        to_bottom: 'white',
      },
    },
    default_card: {
      background: '#FFFFFF',
      border: '#D8D8D8',
      icon_bg: '#E9F4E9',
      color: '#212123',
    },
    status: {
      background: '#71B62633',
      color: '#28b00c',
      access_module: {
        background: PRIMARY_GREEN,
        color: '#f5f5f5',
      },
    },

    horizontal_menu: {
      primary_text: '#000000',
      secondary_text: '#3D9E47',
    },

    default_table: {
      header_row: '#FFFFFF',
      odd_row: '#FAFAFA',
      even_row: '#FFFFFF',
      hovered_row: '#F1F6EE',
      selected_row: '#F1F6EE',
      search_icon: '#ACACAC',
      search_filtered_icon: '#3E9F48',
      header_text: '#262626',
      primary_text: '#262626',
      secondary_text: PRIMARY_GREEN,
      hovered_text: '#262626',
      selected_text: '#262626',
      link_text: '#3E9F48',
      border: '#EBEBEB',
      check_box_border: '#EBEBEB',
      check_box_inner: '#FFFFFF',
      delete_icon: '#262626',
      edit_icon: '#262626',
      // pagination_text: '#262626',
      pagination_text: WHITE,
      pagination_background: PRIMARY_GREEN,
      // pagination_background: '#EBEBEB',
      pagination_border: '#262626',
      pagination_arrow: '#262626',
    },

    default_button: {
      delete_background: '#E34444',
      import_background: '#3D9E47',
      onboard_background: '#F1B92A',
      add_background: '#3D9E47',
      cancel_background: '#E34444',
      submit_background: '#3D9E47',
      sync_background: '',
      primary_text: '#FFFFFF',
    },

    drop_down_button: {
      add_background: '#3D9E47',
      add_text: '#FFFFFF',

      export_background: '#FFFFFF',
      export_text: 'red',

      border: '#EAEAEA',
      options_text: '#000000',
      options_background: '#FFFFFF',
      options_hover_text: '#7F7F7F',
      options_hover_background: '#E4F1E5',
    },

    page_header: {
      primary_text: '#000000',
      icons_bg: '#E4E5E8',
    },

    dialog: {
      title_background: '#EBEBEB',
      content_background: '#FFFFFF',
      title_text: '#000000',
      content_text: '#000000',
    },

    form_unit: {
      error_text: 'red',
    },

    default_input: {
      border: 'lightgray',
      primary_text: '#000000',
      background: '#FFFFFF',
    },
    default_accordion: {
      border: '#F5F5F5',
      primary_text: '#000000',
      background: 'white',
    },
    default_select: {
      border: '#F5F5F5',
      primary_text: '#000000',
      // background: "#E4E5E8",
      background: 'white',
      place_holder: '#B9B9B9',
      color: 'black',
      dropDown: 'white',
    },

    default_option: {
      border: '#F5F5F5',
      primary_text: '#000000',
      background: '#FFFFFF',
    },

    default_label: {
      primary_text: '#000000',
      required_star: '#E34444',
    },

    icon: {
      complete: '#66B127',
      incomplete: '#F1B92A',
    },
  },

  typography: {
    font_family: 'Arial, sans-serif',

    textSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      extraLarge: '',
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});

export const darkGreenTheme = createTheme({
  name: 'darkGreen',
  mode: 'dark',
  palette: {
    background: {
      default: '#100B19',
    },

    main_layout: {
      // contents_bg: '#0D131C',
      contents_bg: DARK_GREEN_CONTENT_BG,
      background: DARK_GREEN_LAYOUT_BG,
      profile_picture_background: '#ACACAC',
      primary_text: '#E4E5E8',
      // secondary_text: '#0490E7',
      secondary_text: PRIMARY_GREEN,

      // border_bottom: '#36424E',
      border_bottom: '#D9D9D9',

      sideBar: {
        icon_color: PRIMARY_GREEN,
        icon_bg: '#48A3451F',
      },
    },

    available_options: {
      card_bg: DARK_GREEN_INPUT_BG,
      border: '#050C17',
      border_bottom: '#36424E',
      options_bg: DARK_GREEN_LAYOUT_BG,
      primary_text: '#E4E5E8',
      // checkbox_bg: '#0490E7',
      checkbox_bg: '#3D9E47',
    },
    graph: {
      title: '#E4E5E8',
      xis: '',
      yAxis: '#151A20',
      trailColor: '#151A20',
      toolTip_bg: DARK_GREEN_LAYOUT_BG,
      tooltip_border: '#36424E',
      line_color: 'lightgray',
      graph_area: {
        // from_top: '#0490E7',
        from_top: '#85DB66',
        to_bottom: 'transparent',
        // secondary_tooltip: '#FDCF2B',
        // secondary_line: '#FDCF2B',
        // line: '#42AE46',
        line: '#42AE46',
        // line: '#42AE46',
        secondary_tooltip: '#FDCF2B',
        secondary_line: '#FDCF2B',
        // secondary_line: '#0490E7',
      },
    },
    slider: {
      backgroundColor: '#e0e0e0',
      fillerColor: '#555555',
      hoverFillerColor: '#555555',
      handleColor: '#808080',
      handleHoverColor: '#555555',
      track: '#6f42c1',
      rail: '#ecdff9',
      handle: '#6f42c1',
    },
    chat_bot: {
      icon: '',
      icon_bg: '#0490E7',
      messages_bg: '#16212A',
      user: {
        background: '#0490E7',
        color: 'white',
      },
      response: {
        background: '#050C17',
        color: 'white',
      },

      background: {
        from_top: '#0490E7',
        to_bottom: 'white',
      },
      // background: "#117A1E",
      primary_text: '#E4E5E8',
      secondary_text: '#2268D1',
    },
    status: {
      background: '#71B62633',
      color: '#C8FF8C',
    },
    access_module: {
      background: PRIMARY_GREEN,
      color: '#f5f5f5',
    },
    default_card: {
      background: DARK_GREEN_LAYOUT_BG,
      border: '#36424E',
      color: '#74787E',
    },

    horizontal_menu: {
      primary_text: '#FFFFFF',
      secondary_text: '#3D9E47',
    },

    default_table: {
      // header_row: '#16212a',
      header_row: DARK_GREEN_LAYOUT_BG,
      odd_row: '#172118',
      even_row: DARK_GREEN_LAYOUT_BG,
      hovered_row: '#5A5A5A',
      selected_row: '#5A5A5A',
      search_icon: '#FFFFFF',
      search_filtered_icon: '#3E9F48',
      header_text: '#FFFFFF',
      primary_text: '#FFFFFF',
      secondary_text: '#2268D1',
      hovered_text: '#FFFFFF',
      selected_text: '#FFFFFF',
      link_text: '#3E9F48',
      border: '#EBEBEB',
      check_box_border: '#EBEBEB',
      check_box_inner: '#09120C',
      delete_icon: '#262626',
      edit_icon: '#262626',
      pagination_text: WHITE,
      pagination_background: PRIMARY_GREEN,
      pagination_border: '#EBEBEB',
      pagination_arrow: '#EBEBEB',
    },

    default_button: {
      delete_background: '#0490E7',
      import_background: '#0490E7',
      onboard_background: '#F1B92A',
      add_background: PRIMARY_GREEN,
      cancel_background: '#E34444',
      submit_background: '#3D9E47',
      sync_background: '',
      primary_text: '#FFFFFF',
    },

    drop_down_button: {
      // add_background: '#0490E7',
      add_background: '#3D9E47',
      add_text: '#FFFFFF',

      export_background: '#1D2934',
      export_text: '#FFFFFF',

      border: '#0490E7',
      options_text: '#FFFFFF',
      options_background: '#000000',
      options_hover_text: '#7F7F7F',
      options_hover_background: '#C8EF9E',
    },

    page_header: {
      primary_text: '#FFFFFF',
      icons_bg: '#141b26',
    },

    dialog: {
      title_background: '#09120C',
      content_background: '#131B15',
      title_text: '#FFFFFF',
      content_text: '#FFFFFF',
    },

    form_unit: {
      error_text: '#E34444',
    },

    default_input: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: DARK_GREEN_INPUT_BG,
    },
    default_accordion: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: '#16212a',
    },
    default_select: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: DARK_GREEN_INPUT_BG,
      place_holder: '#B9B9B9',
      color: '#e5e5e5',
      dropDown: DARK_GREEN_INPUT_BG,
    },

    default_option: {
      border: '#09120C',
      primary_text: '#ACACAC',
      background: DARK_GREEN_INPUT_BG,
      selected_background: DARK_GREEN_LAYOUT_BG,
    },

    default_label: {
      primary_text: '#FFFFFF',
      required_star: '#E34444',
    },

    icon: {
      complete: '#66B127',
      incomplete: '#F1B92A',
    },
  },

  typography: {
    font_family: 'Arial, sans-serif',

    textSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      extraLarge: '18px',
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});

export const darkTheme = createTheme({
  name: 'darkBlue',
  mode: 'dark',
  palette: {
    background: {
      default: '#050C17',
    },

    main_layout: {
      contents_bg: '#0D131C',
      background: '#050C17',
      profile_picture_background: '#ACACAC',
      primary_text: '#E4E5E8',
      secondary_text: '#0490E7',
      border_bottom: '#36424E',
      sideBar: {
        icon_color: '#0490E7',
        icon_bg: '#049FD921',
      },
    },
    shades: {
      red: '#D21E16',
      light_green: '#1CA18B',
      blue: '#632CE8',
      light_blue: '#0198CC',
      purple: '#8B5CF6',
      dark_purple: '#9F14A1',
      orange: '#F59E0B',
    },
    available_options: {
      card_bg: '#16212a',
      border: '#36424E',
      border_bottom: '#36424E',
      options_bg: '#050C17',
      primary_text: '#E4E5E8',
      checkbox_bg: '#0490E7',
    },
    graph: {
      title: '#E4E5E8',
      label_color: '#f7f7f7',
      xis: '#B9B9B9',
      yAxis: '#151A20',
      trailColor: '#151A20',
      toolTip_bg: '#081221ff',
      toolTip_text_color: '#B9B9B9',
      tooltip_border: '#36424E',
      line_color: '#36424E',
      graph_area: {
        from_top: '#0490E7',
        to_bottom: 'transparent',
        secondary_tooltip: '#3D9E47',
        // secondary_line: '#FDCF2B',
        line: PRIMARY_BLUE,
        secondary_line: '#3D9E47',
      },
    },
    slider: {
      backgroundColor: '#36424E',
      fillerColor: '#555555',
      hoverFillerColor: '#555555',
      handleColor: '#808080',
      handleHoverColor: '#555555',
      track: '#6f42c1',
      rail: '#36424E',
      handle: '#6f42c1',
      border: '#000',
    },
    chat_bot: {
      icon: '',
      icon_bg: '#0490E7',
      messages_bg: '#16212A',
      user: {
        background: '#0490E7',
        color: 'white',
      },
      response: {
        background: '#050C17',
        color: 'white',
      },

      background: {
        from_top: '#0490E7',
        to_bottom: 'white',
      },
      // background: "#117A1E",
      primary_text: '#E4E5E8',
      secondary_text: '#2268D1',
    },
    status: {
      background: '#71B62633',
      color: '#C8FF8C',
    },
    access_module: {
      background: PRIMARY_BLUE,
      color: '#f5f5f5',
    },
    default_card: {
      background: '#050C17',
      border: '#36424E',
      color: '#74787E',
    },

    horizontal_menu: {
      primary_text: '#FFFFFF',
      secondary_text: '#0490e7',
    },

    default_table: {
      header_row: '#16212a',
      odd_row: '#050C17',
      even_row: '#16212a',
      // hovered_row: '#5A5A5A',
      hovered_row: '#4A4A4A',
      selected_row: '#5A5A5A',
      search_icon: '#FFFFFF',
      search_filtered_icon: '#3E9F48',
      // header_text: '#FFFFFF',
      header_text: '#7A8CA6',
      // primary_text: '#FFFFFF',
      // primary_text: '#74787E',
      primary_text: '#7A8CA6',
      secondary_text: '#2268D1',
      hovered_text: '#FFFFFF',
      selected_text: '#FFFFFF',
      link_text: '#3E9F48',
      border: '#EBEBEB',
      check_box_border: '#EBEBEB',
      check_box_inner: '#09120C',
      delete_icon: '#262626',
      edit_icon: '#262626',
      pagination_text: WHITE,
      pagination_background: '#262626',
      pagination_border: '#EBEBEB',
      pagination_arrow: '#EBEBEB',
    },

    default_button: {
      delete_background: '#0490E7',
      import_background: '#0490E7',
      onboard_background: '#F1B92A',
      add_background: '#0490E7',
      cancel_background: '#E34444',
      submit_background: '#3D9E47',
      sync_background: '',
      primary_text: '#FFFFFF',
    },

    drop_down_button: {
      add_background: '#0490E7',
      add_text: '#FFFFFF',

      export_background: '#1D2934',
      export_text: '#FFFFFF',

      border: '#0490E7',
      options_text: '#FFFFFF',
      options_background: '#000000',
      options_hover_text: '#7F7F7F',
      options_hover_background: '#C8EF9E',
    },

    page_header: {
      primary_text: '#FFFFFF',
      icons_bg: '#141b26',
    },

    dialog: {
      title_background: '#09120C',
      content_background: '#131B15',
      title_text: '#FFFFFF',
      content_text: '#FFFFFF',
    },

    form_unit: {
      error_text: '#E34444',
    },

    default_input: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: '#16212a',
    },
    default_accordion: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: '#16212a',
    },
    default_select: {
      border: '#36424E',
      primary_text: '#ACACAC',
      // primary_text: '#000000',
      background: '#16212a',
      place_holder: '#B9B9B9',
      color: '#e5e5e5',
      dropDown: '#141b26',
    },

    default_option: {
      border: '#09120C',
      primary_text: '#ACACAC',
      background: '#09120C',
      selected_background: '#35465f',
      // selected_background: '#000',
      // primary_text: '#fff',
    },

    default_label: {
      primary_text: '#FFFFFF',
      required_star: '#E34444',
    },

    icon: {
      complete: '#66B127',
      incomplete: '#F1B92A',
    },
  },

  typography: {
    font_family: 'Arial, sans-serif',

    textSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      extraLarge: '18px',
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});

export const lightBlueTheme = createTheme({
  name: 'lightBlue',
  mode: 'light',
  palette: {
    background: {
      default: '#F6F6F6',
    },

    main_layout: {
      contents_bg: '#F7F7F7F7',
      background: '#FFFFFF',
      profile_picture_background: '#ACACAC',
      primary_text: '#000000',
      secondary_text: PRIMARY_BLUE,
      border_bottom: '#D9D9D9',
      sideBar: {
        icon_color: PRIMARY_BLUE,
        icon_bg: '#EDF7FE',
      },
    },
    shades: {
      red: '#D21E16',
      light_green: '#1CA18B',
      blue: '#632CE8',
      light_blue: '#0198CC',
      purple: '#8B5CF6',
      dark_purple: '#9F14A1',
      orange: '#F59E0B',
    },
    available_options: {
      card_bg: '#FFFFFF',
      border: '#D9D9D9',
      border_bottom: '#D9D9D9',
      options_bg: '#FFFFFF',
      primary_text: '#000000',
      checkbox_bg: PRIMARY_BLUE,
    },
    graph: {
      label_color: '#f7f7f7',

      title: 'black',
      xis: '#666666',
      trailColor: '#e1e9f7',
      toolTip_bg: 'white',
      tooltip_border: 'lightgray',
      toolTip_text_color: '#36424E',
      line_color: '#D9D9D9',
      graph_area: {
        from_top: PRIMARY_BLUE,
        to_bottom: 'white',
        line: PRIMARY_BLUE,
        // line: '#0490E7',

        secondary_tooltip: '#3D9E47',
        secondary_line: '#3D9E47',
      },
    },
    slider: {
      backgroundColor: '#36424E',
      fillerColor: '#555555',
      hoverFillerColor: '#555555',
      handleColor: '#808080',
      handleHoverColor: '#555555',
      track: '#6f42c1',
      rail: 'lightgray',
      handle: '#6f42c1',
      border: '#fff',
    },
    chat_bot: {
      icon: '',
      icon_bg: PRIMARY_BLUE,
      background: {
        from_top: PRIMARY_BLUE,
        to_bottom: 'white',
      },
      messages_bg: '#FFFFF',
      user: {
        background: PRIMARY_BLUE,
        color: 'white',
      },
      response: {
        background: '#a6d4f5',
        color: 'black',
      },
    },

    default_card: {
      background: '#FFFFFF',
      border: '#D8D8D8',
      icon_bg: '#EDF7FE',
      color: '#212123',
    },
    status: {
      background: '#e2f5df',
      color: '#07820b',
    },
    access_module: {
      background: PRIMARY_BLUE,
      color: '#f5f5f5',
    },
    horizontal_menu: {
      primary_text: '#000000',
      secondary_text: PRIMARY_BLUE,
    },

    default_table: {
      header_row: '#FFFFFF',
      odd_row: '#FAFAFA',
      even_row: '#FFFFFF',
      hovered_row: '#f0f4fa',
      selected_row: '#F1F6EE',
      search_icon: '#ACACAC',
      search_filtered_icon: '#3E9F48',
      header_text: '#262626',
      primary_text: '#262626',
      secondary_text: PRIMARY_BLUE,
      hovered_text: '#262626',
      selected_text: '#262626',
      link_text: '#3E9F48',
      border: '#EBEBEB',
      check_box_border: '#EBEBEB',
      check_box_inner: '#FFFFFF',
      delete_icon: '#262626',
      edit_icon: '#262626',
      pagination_text: WHITE,
      pagination_background: PRIMARY_BLUE,
      pagination_border: '#262626',

      pagination_arrow: '#262626',
    },

    default_button: {
      delete_background: '#E34444',
      import_background: '#3D9E47',
      onboard_background: '#F1B92A',
      add_background: PRIMARY_BLUE,
      cancel_background: '#E34444',
      submit_background: '#3D9E47',
      sync_background: '',
      primary_text: '#FFFFFF',
    },

    drop_down_button: {
      add_background: PRIMARY_BLUE,
      add_text: '#FFFFFF',
      export_background: '#FFFFFF',
      export_text: 'red',
      border: '#EAEAEA',
      options_text: '#000000',
      options_background: '#FFFFFF',
      options_hover_text: '#7F7F7F',
      options_hover_background: '#E4F1E5',
    },

    page_header: {
      primary_text: '#000000',
      icons_bg: '#E4E5E8',
    },

    dialog: {
      title_background: '#EBEBEB',
      content_background: '#FFFFFF',
      title_text: '#000000',
      content_text: '#000000',
    },

    form_unit: {
      error_text: 'red',
    },

    default_input: {
      border: 'lightgray',
      primary_text: '#000000',
      background: '#FFFFFF',
    },
    default_accordion: {
      border: '#F5F5F5',
      primary_text: '#000000',
      background: 'white',
    },
    default_select: {
      border: '#F5F5F5',
      primary_text: '#000000',
      // background: "#E4E5E8",
      background: 'white',
      place_holder: '#B9B9B9',
      color: 'black',
      dropDown: 'white',
    },

    default_option: {
      border: '#F5F5F5',
      primary_text: '#000000',
      background: '#FFFFFF',
    },

    default_label: {
      primary_text: '#000000',
      required_star: '#E34444',
    },

    icon: {
      complete: '#66B127',
      incomplete: '#F1B92A',
    },
  },

  typography: {
    font_family: 'Arial, sans-serif',

    textSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      extraLarge: '',
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});

// light purple theme
export const lightPurpleTheme = createTheme({
  name: 'lightPurple',
  mode: 'light',
  palette: {
    background: {
      default: '#F6F6F6',
    },

    main_layout: {
      contents_bg: '#F7F7F7F7',
      background: '#FFFFFF',
      profile_picture_background: '#ACACAC',
      primary_text: '#000000',
      secondary_text: PRIMARY_PURPLE,
      border_bottom: '#D9D9D9',
      sideBar: {
        icon_color: PRIMARY_PURPLE,
        icon_bg: '#D4BEE4',
        // icon_bg: '#F5EFFF',
      },
    },
    available_options: {
      //   // card_bg: '#D4BEE4',
      //   card_bg: '#F5EFFF',
      //   border: '#D9D9D9',
      //   border_bottom: '#D9D9D9',
      //   options_bg: '#FFFFFF',
      //   primary_text: '#000000',
      //   checkbox_bg: PRIMARY_PURPLE,
      card_bg: '#F7F7F7',
      border: '#D9D9D9',
      border_bottom: '#D9D9D9',
      options_bg: '#FFFFFF',
      primary_text: '#000000',
      checkbox_bg: PRIMARY_PURPLE,
    },
    graph: {
      title: 'black',
      xis: '#7F7F7F',
      trailColor: '#e1e9f7',
      toolTip_bg: 'white',
      tooltip_border: 'lightgray',
      line_color: '#D9D9D9',
      graph_area: {
        from_top: PRIMARY_PURPLE,
        to_bottom: 'white',
        line: PRIMARY_PURPLE,
        secondary_tooltip: '#FDCF2B',
        // secondary_tooltip: '#6568ed',
        // line: '#609cf6',
        secondary_line: '#6568ed',
        pi_graph: '#DB76FC',
        gradient: 'linear-gradient(to right, #9619B5, #7b52db, #074f84)',
      },
    },
    slider: {
      backgroundColor: '#e0e0e0',
      fillerColor: '#555555',
      hoverFillerColor: '#555555',
      handleColor: '#808080',
      handleHoverColor: '#555555',
      track: '#6f42c1',
      rail: '#ecdff9',
      handle: '#6f42c1',
    },
    chat_bot: {
      icon: '',
      icon_bg: PRIMARY_PURPLE,
      background: {
        from_top: PRIMARY_PURPLE,
        to_bottom: 'white',
      },
      messages_bg: '#FFFFF',
      user: {
        background: PRIMARY_PURPLE,
        color: 'white',
      },
      response: {
        background: '#a6d4f5',
        color: 'black',
      },
    },

    default_card: {
      background: '#FFFFFF',
      border: '#D8D8D8',
      // icon_bg: '#EDF7FE',
      icon_bg: '#F9EFFC',
      color: '#212123',
    },
    status: {
      background: '#e2f5df',
      color: '#07820b',
    },
    access_module: {
      background: PRIMARY_PURPLE,
      color: '#f5f5f5',
    },
    horizontal_menu: {
      primary_text: '#000000',
      secondary_text: PRIMARY_PURPLE,
    },

    default_table: {
      header_row: '#FFFFFF',
      odd_row: '#FAFAFA',
      even_row: '#FFFFFF',
      hovered_row: '#f0f4fa',
      selected_row: '#F1F6EE',
      search_icon: '#ACACAC',
      search_filtered_icon: '#3E9F48',
      header_text: '#262626',
      primary_text: '#262626',
      secondary_text: PRIMARY_PURPLE,
      hovered_text: '#262626',
      selected_text: '#262626',
      link_text: '#3E9F48',
      border: '#EBEBEB',
      check_box_border: '#EBEBEB',
      check_box_inner: '#FFFFFF',
      delete_icon: '#262626',
      edit_icon: '#262626',

      pagination_text: WHITE,
      pagination_background: PRIMARY_PURPLE,
      pagination_border: '#262626',

      pagination_arrow: '#262626',
    },

    default_button: {
      delete_background: '#E34444',
      import_background: '#3D9E47',
      onboard_background: '#F1B92A',
      add_background: PRIMARY_PURPLE,
      cancel_background: '#E34444',
      submit_background: '#3D9E47',
      sync_background: '',
      primary_text: '#FFFFFF',
    },

    drop_down_button: {
      add_background: PRIMARY_PURPLE,
      add_text: '#FFFFFF',
      export_background: '#FFFFFF',
      export_text: 'red',
      border: '#EAEAEA',
      options_text: '#000000',
      options_background: '#FFFFFF',
      options_hover_text: '#7F7F7F',
      options_hover_background: '#E4F1E5',
    },

    page_header: {
      primary_text: '#000000',
      icons_bg: '#E4E5E8',
    },

    dialog: {
      title_background: '#EBEBEB',
      content_background: '#FFFFFF',
      title_text: '#000000',
      content_text: '#000000',
    },

    form_unit: {
      error_text: 'red',
    },

    default_input: {
      border: 'lightgray',
      primary_text: '#000000',
      background: '#FFFFFF',
    },
    default_accordion: {
      border: '#F5F5F5',
      primary_text: '#000000',
      background: 'white',
    },
    default_select: {
      border: '#F5F5F5',
      primary_text: '#000000',
      // background: "#E4E5E8",
      background: 'white',
      place_holder: '#B9B9B9',
      color: 'black',
      dropDown: 'white',
    },

    default_option: {
      border: '#F5F5F5',
      primary_text: '#000000',
      background: '#FFFFFF',
    },

    default_label: {
      primary_text: '#000000',
      required_star: '#E34444',
    },

    icon: {
      complete: '#66B127',
      incomplete: '#F1B92A',
    },
  },

  typography: {
    font_family: 'Arial, sans-serif',

    textSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      extraLarge: '',
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});

export const darkPurpleTheme = createTheme({
  name: 'darkPurple',
  mode: 'dark',
  palette: {
    background: {
      default: '#03120d',
    },

    main_layout: {
      contents_bg: DARK_PURPLE_CONTENT_BG,
      background: DARK_PURPLE_LAYOUT_BG,
      profile_picture_background: '#ACACAC',
      primary_text: '#E4E5E8',
      secondary_text: PRIMARY_PURPLE,
      border_bottom: '#D9D9D9',

      sideBar: {
        icon_color: PRIMARY_PURPLE,
        icon_bg: '#3B1E54',
      },
    },

    available_options: {
      card_bg: DARK_PURPLE_INPUT_BG,
      // num_card_bg:'#D4BEE4',
      border: '#050C17',
      border_bottom: '#36424E',
      options_bg: DARK_PURPLE_LAYOUT_BG,
      primary_text: '#E4E5E8',
      checkbox_bg: '#3D9E47',
    },
    graph: {
      title: '#E4E5E8',
      xis: '',
      yAxis: '#151A20',
      trailColor: '#151A20',
      toolTip_bg: DARK_PURPLE_LAYOUT_BG,
      tooltip_border: '#36424E',
      line_color: 'lightgray',
      graph_area: {
        // from_top: '#921bae',
        from_top: '#864879',
        to_bottom: 'transparent',
        line: PRIMARY_PURPLE,
        secondary_tooltip: '#FDCF2B',
        // line: '#609cf6',
        secondary_line: '#6568ed',
        //line: PRIMARY_PURPLE,
        // line: '#8C6A5D',
        // line: '#2268D1',
        // secondary_line: '#609cf6',
        //secondary_line: '#fcd027',
      },
    },
    slider: {
      backgroundColor: '#e0e0e0',
      fillerColor: '#555555',
      hoverFillerColor: '#555555',
      handleColor: '#808080',
      handleHoverColor: '#555555',
      track: '#6f42c1',
      rail: '#ecdff9',
      handle: '#6f42c1',
    },
    chat_bot: {
      icon: '',
      icon_bg: '#0490E7',
      messages_bg: '#16212A',
      user: {
        background: '#0490E7',
        color: 'white',
      },
      response: {
        background: '#050C17',
        color: 'white',
      },

      background: {
        from_top: '#0490E7',
        to_bottom: 'white',
      },
      primary_text: '#E4E5E8',
      secondary_text: '#2268D1',
    },
    status: {
      background: '#71B62633',
      color: '#C8FF8C',
    },
    access_module: {
      background: PRIMARY_PURPLE,
      color: '#f5f5f5',
    },
    default_card: {
      background: DARK_PURPLE_LAYOUT_BG,
      border: '#36424E',
      color: '#74787E',
    },

    horizontal_menu: {
      primary_text: '#FFFFFF',
      secondary_text: '#9619b5',
    },

    default_table: {
      header_row: DARK_PURPLE_LAYOUT_BG,
      odd_row: '#1E1721',
      even_row: DARK_PURPLE_LAYOUT_BG,
      hovered_row: '#5A5A5A',
      selected_row: '#5A5A5A',
      search_icon: '#FFFFFF',
      search_filtered_icon: '#9619b5',
      header_text: '#FFFFFF',
      primary_text: '#FFFFFF',
      secondary_text: '#9619b5',
      hovered_text: '#FFFFFF',
      selected_text: '#FFFFFF',
      link_text: '#9619b5',
      border: '#EBEBEB',
      check_box_border: '#EBEBEB',
      check_box_inner: '#09120C',
      delete_icon: '#262626',
      edit_icon: '#262626',
      pagination_text: WHITE,
      pagination_background: PRIMARY_PURPLE,
      pagination_border: '#EBEBEB',
      pagination_arrow: '#EBEBEB',
    },

    default_button: {
      delete_background: '#0490E7',
      import_background: '#0490E7',
      onboard_background: '#F1B92A',
      add_background: PRIMARY_PURPLE,
      cancel_background: '#E34444',
      submit_background: '#3D9E47',
      sync_background: '',
      primary_text: '#FFFFFF',
    },

    drop_down_button: {
      add_background: '#921bae',
      add_text: '#FFFFFF',
      export_background: '#1D2934',
      export_text: '#FFFFFF',
      border: '#921bae',
      options_text: '#FFFFFF',
      options_background: '#000000',
      options_hover_text: '#7F7F7F',
      options_hover_background: '#C8EF9E',
    },

    page_header: {
      primary_text: '#FFFFFF',
      icons_bg: '#141b26',
    },

    dialog: {
      title_background: '#09120C',
      content_background: '#131B15',
      title_text: '#FFFFFF',
      content_text: '#FFFFFF',
    },

    form_unit: {
      error_text: '#E34444',
    },

    default_input: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: DARK_PURPLE_INPUT_BG,
    },
    default_accordion: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: '#16212a',
    },
    default_select: {
      border: '#36424E',
      primary_text: '#ACACAC',
      background: DARK_PURPLE_INPUT_BG,
      place_holder: '#B9B9B9',
      color: '#e5e5e5',
      dropDown: DARK_PURPLE_INPUT_BG,
    },

    default_option: {
      border: '#09120C',
      primary_text: '#ACACAC',
      background: DARK_GREEN_INPUT_BG,
      selected_background: DARK_PURPLE_LAYOUT_BG,
    },

    default_label: {
      primary_text: '#FFFFFF',
      required_star: '#E34444',
    },

    icon: {
      complete: '#66B127',
      incomplete: '#F1B92A',
    },
  },

  typography: {
    font_family: 'Arial, sans-serif',

    textSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      extraLarge: '18px',
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});
