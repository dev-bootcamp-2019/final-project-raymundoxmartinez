import React from "react";
import Dropzone from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

const img = {
  display: "block",
  width: "auto",
  height: "100%"
};

export default class ImageUpload extends React.Component {
  constructor() {
    super();
    this.state = {
      files: []
    };
  }

  onDrop(files) {
    const { onChange } = this.props;
    const newFiles = files;
    newFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const readAsDataURL = reader.result;
        this.setState({
          files: files.map((file) => {
            return Object.assign(file, {
              preview: URL.createObjectURL(file)
            });
          })
        });
        onChange(readAsDataURL);
      };
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.readAsDataURL(file);
    });
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    this.state.files.forEach((file) => URL.revokeObjectURL(file.preview));
  }

  render() {
    const { files } = this.state;

    const thumbs = files.map((file) => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} style={img} alt='' />
        </div>
      </div>
    ));

    return (
      <section>
        <Dropzone
          accept="image/*"
          multiple={false}
          onDrop={this.onDrop.bind(this)}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drop image here</p>
            </div>
          )}
        </Dropzone>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </section>
    );
  }
}
