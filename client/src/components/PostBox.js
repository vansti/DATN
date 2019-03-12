import React, { Component,Fragment } from 'react';
import {  Button, Modal, ModalHeader, ModalBody, ModalFooter,FormGroup,Col,Label,Input } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactDropzone from "react-dropzone";
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { addExercise } from '../actions/exerciseActions';
import isEmptyObj from '../validation/is-empty';
import { withRouter } from 'react-router-dom'

class PostBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      text: '',
      attachFile:'',
      large: false,
      errors: {},
      isShowSuccess: false,
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
      title: '',
      text: '',
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const exerciseData = {
      title: this.state.title,
      text: this.state.text,
      attachFile: this.state.attachFile,
      courseId: this.props.match.params.id
    };
    
    this.props.addExercise(exerciseData);
    this.setState({isLoading: true});
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.data === "Thêm bài tập thành công!") {
      this.setState({
        isShowSuccess: true,
        title: '',
        text: '',
        isLoading: false
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      modal: false,
    })
  }

  render() {

    return (
      <Fragment>
        <Button color="danger" onClick={this.toggleLarge} className="mr-1">Tạo bài tập</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg modal-danger'>
          <ModalHeader toggle={this.toggleLarge}>Thêm bài tập mới</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col md="3">
                <Label>Tiêu đề bài tập</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="title" value={this.state.title} onChange={this.onChange} placeholder="Tiêu đề..." />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Nội dung bài tập</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="textarea" name="text" value={this.state.text} onChange={this.onChange} rows="9" placeholder="Nội dung..." />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label>Đính kèm tập tin</Label>
              </Col>
              <Col xs="3" md="4">
                <ReactDropzone onDrop={this.onDrop} >
                  Thả file của bạn vào đây!
                </ReactDropzone>
              </Col>
              <Col xs="4" style={{wordWrap:'break-word'}}>
                
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Thêm</Button>{' '}
            <Button color="secondary" onClick={this.toggleLarge}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm bài tập thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

PostBox.propTypes = {
  addExercise: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { addExercise })(PostBox));  