import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader,Form,FormGroup,Input,Label,Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { enrollCourse } from '../actions/courseActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../validation/is-empty';

class ModalEnroll extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      courseCode:'',
      errors: {},
      isShowSuccess: false,
      isLoading: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    const courseData = {};
    courseData.courseCode = this.state.courseCode;
    this.props.enrollCourse(courseData);
    this.setState({isLoading: true});
  }

  componentWillReceiveProps(nextProps) {
    
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.success.data === "Đã tham gia vào khóa học") {
      this.setState({
        isShowSuccess: true,
        isLoading: false
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      courseCode:'',
      isShowSuccess: false,
      modal: false,
    })
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Button onClick={this.toggle} color="danger">Ghi danh</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Ghi danh vào khóa học</ModalHeader>
          <ModalBody>
            <Form action="" method="post">
              <FormGroup>
                <Label htmlFor="courseCode">Mã khóa học</Label>
                <Input type="text" id="courseCode" name="courseCode" value={this.state.courseCode} onChange={this.onChange} />
              </FormGroup>
              {errors.courseCode && <Alert color="danger">{errors.courseCode}</Alert>}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSubmit}>Ghi danh</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Hủy</Button>
          </ModalFooter>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Đã tham gia vào khóa học!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang ghi danh</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

ModalEnroll.propTypes = {
  enrollCourse: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { enrollCourse })(ModalEnroll);
