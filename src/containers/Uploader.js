import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from "semantic-ui-react";

// Import React FilePond
import { FilePond, File, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const getWidth = () => {
  const isSSR = typeof window === "undefined";
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        />
        {children}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;
    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        {children}
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

class Uploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [
        {
          source: "index.html",
          options: {
            type: "local",
          },
        },
      ],
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: "8em 0em" }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as="h3" style={{ fontSize: "2em" }}></Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment style={{ padding: "8em 0em" }} vertical>
          <Container text>
            <Header as="h3" style={{ fontSize: "2em" }}>
              Filepond ReactJS + DRF
            </Header>
            <FilePond
              ref={(ref) => (this.pond = ref)}
              files={this.state.files}
              allowMultiple={true}
              allowReorder={true}
              maxFiles={3}
              server="http://127.0.0.1:8000/fp/process/"
              name="filepond"
              oninit={() => this.handleInit()}
              onupdatefiles={(fileItems) => {
                // Set currently active file objects to this.state
                this.setState({
                  files: fileItems.map((fileItem) => fileItem.file),
                });
              }}
            />
          </Container>
        </Segment>
      </ResponsiveContainer>
    );
  }
}

// const Uploader = () => (

//   <ResponsiveContainer>
//     <Segment style={{ padding: "8em 0em" }} vertical>
//       <Grid container stackable verticalAlign="middle">
//         <Grid.Row>
//           <Grid.Column width={8}>
//             <Header as="h3" style={{ fontSize: "2em" }}>
//               DRF Filepond
//             </Header>
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//     </Segment>
//     <Segment style={{ padding: "8em 0em" }} vertical>
//       <Container text>
//         <Header as="h3" style={{ fontSize: "2em" }}>
//           Filepond
//         </Header>
//         <FilePond
//           files={files}
//           onupdatefiles={setFiles}
//           allowMultiple={true}
//           maxFiles={3}
//           server="/api"
//           name="files"
//           labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
//         />
//       </Container>
//     </Segment>
//   </ResponsiveContainer>
// );
export default Uploader;
