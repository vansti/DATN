import React, { Component } from 'react'
import SubmitValidationForm from '../../components/Quiz/Add/index'
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import {Modal, ModalBody} from 'reactstrap';

import { getCurentCourse } from '../../actions/courseActions';
// import isEmptyObj from '../../validation/is-empty';

import {
  connect
} from 'react-redux';

class QuizAddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: 300,
      isShowSuccess: false,
      isLoading: false,
      errors: {}
    };
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.data === "Thêm bài kiểm tra thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }
  }
  

  render() {
    let form = '';
    if(this.props.courses.currentcourses === null)
    {
      form = <tr><td></td><td></td><td ><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td><td></td></tr>
    }
    else {
      if(this.props.courses.currentcourses.length === 0)
      {
        form = <tr><td></td><td></td><td >Hiện không có khóa học nào</td><td></td></tr>
      }
      else {
        form = (
          <SubmitValidationForm courses={this.props.courses.currentcourses}/>
        )
      }
    }
    return (
      <div>
        {form}
        <SweetAlert
          success
          confirmBtnText="OK"
          confirmBtnBsStyle="success"
          title="Thêm bài kiểm tra thành công!"
          show={this.state.isShowSuccess}
          onConfirm={this.hideAlertSuccess.bind(this)}
          onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm bài kiểm tra</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
    
}

QuizAddPage.propTypes = {
  getCurentCourse: PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  success: state.success, 
  courses: state.courses
});

export default connect(mapStateToProps, { getCurentCourse })(QuizAddPage);
