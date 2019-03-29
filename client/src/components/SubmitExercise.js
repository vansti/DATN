import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, NavLink, ModalFooter, Button, 
  Input, Col, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { addSubmission, getSubmission, download, deleteSubmission } from '../actions/exerciseActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import ReactDropzone from "react-dropzone";

class SubmitExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachFile: null,
      large: false,
      errors: {},
      isLoading: false,
      isShowSuccess: false
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  componentWillReceiveProps(nextProps) {

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.data === "Nộp bài tập thành công!") {
      this.setState({
        isShowSuccess: true,
        isLoading: false,
        studentNote:'',
        attachFile: null
      })
    }
  }

  componentDidMount = () => {
    this.props.getSubmission(this.props.exerciseId);
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false

    })
  }

  onChangeFile = e =>{
    this.setState({
      attachFile: e.target.files[0]
    })
  }

  onDrop = (files) => {
    let file = files[0];
   
    this.setState({
      attachFile: file,
      fileName: file.name
    });
  }

  onsubmit = (e) => {
    e.preventDefault();
    const data = {
      file: this.state.attachFile,
    }
    this.props.addSubmission(data, this.props.exerciseId);
  }
  download = (e) => {
    e.preventDefault();
    this.props.download(this.props.exerciseId, this.props.submission.submission);
  }

  deleteSubmission = (e) => {
    e.preventDefault();
    this.props.deleteSubmission(this.props.exerciseId);
  }

  render() {
    const { errors } = this.state;
    return (
      <Fragment>
        <Button block color="primary" onClick={this.toggleLarge} >Nộp bài tập</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg modal-primary'>
          <ModalHeader  toggle={this.toggleLarge}>Nộp bài tập</ModalHeader>
          <ModalBody>
            <FormGroup row> 
            <ReactDropzone onDrop={this.onDrop} >
                            Thả file vào đây!
                          </ReactDropzone>
            </FormGroup>
            <FormGroup row>
              <p>{this.state.fileName}</p>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Bài đã nộp</Label>
              </Col>
              <Col xs="12" md="9">
                <NavLink href="#" onClick={this.download}>{this.props.submission.submission}</NavLink>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Button color="danger" onClick={this.deleteSubmission}>Hủy bài nộp</Button>
              </Col>
            </FormGroup>
            {/* <FormGroup row>
              <Col md="3">
                <Label>Đính kèm tập tin</Label>
              </Col>
              <Col>
                <Input type="file" onChange={this.onChangeFile}/>
                {errors.attachFile && <Alert color="danger">{errors.attachFile}</Alert>}
              </Col>
            
            </FormGroup> */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.onsubmit}>Nộp</Button>{' '}
            <Button color="secondary" onClick={this.toggleLarge}>Hủy</Button>
          </ModalFooter>
        </Modal>
        {/* Phần thông báo nộp bài thành công */}
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Nộp bài tập thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

SubmitExercise.propTypes = {
  addSubmission: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  submission: state.submission,
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { addSubmission, getSubmission, download, deleteSubmission })(SubmitExercise)); 