import React, { Component,Fragment } from 'react';
import {  
  Button, 
  Modal,
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  FormGroup,
  Col,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import { addLessonList, clearSuccess, clearErrors, getLessonList } from '../../actions/lessonActions'

class ModalAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSuccess: false,
      title: '',
      noLesson: '1',
      errors:{}
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
      title: '',
      noLesson: '1'
    });
  }

  onSubmit = e => {
    e.preventDefault();

    const lessonListData = {
      title: this.state.title,
      noLesson: this.state.noLesson
    };
    this.props.addLessonList(lessonListData);
    this.setState({ isLoading: true });
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillReceiveProps(nextProps) {

    if(!isEmptyObj(nextProps.errors))
    {
      this.setState({ errors: nextProps.errors, isLoading: false});
      this.props.clearErrors();
    }

    if (nextProps.success.mes === "Thêm danh sách bài học") {
      this.setState({
        isShowSuccess: true,
        title: '',
        noLesson: 1,
        isLoading: false
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      modal: false,
    })
    this.props.clearSuccess();
    this.props.getLessonList();
  }

  render() {
    const { errors } = this.state;
    
    return (
      <Fragment>
        <Button color="danger" onClick={this.toggleLarge} className="mr-1">Tạo danh sách bài học cho khóa học</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-danger'>
          <ModalHeader toggle={this.toggleLarge}>Thêm danh sách bài học mới</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Col md="4">
                <Label>Tiêu đề danh sách</Label>
              </Col>
              <Col>
                <Input type="text" name="title" value={this.state.title} onChange={this.onChange} placeholder="Tiêu đề..." required/> 
              </Col>
            </FormGroup>
            {errors.title && <Alert color="danger">{errors.title}</Alert>}
            <FormGroup row>
              <Col md="4">
                <Label>Số buổi học trong danh sách</Label>
              </Col>
              <Col>
                <Input type="number" name="noLesson" min='1' value={this.state.noLesson} onChange={this.onChange} rows="9" required/>
              </Col>
            </FormGroup>
            {errors.noLesson && <Alert color="danger">{errors.noLesson}</Alert>}
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
          	title="Thêm danh sách thành công!"
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

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { addLessonList, clearSuccess, clearErrors, getLessonList })(ModalAdd);  