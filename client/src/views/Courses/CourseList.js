import React, { Component } from 'react';
import {Card, Table, CardBody,  CardHeader, Button, Modal, ModalBody} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions';
import ModalEnroll from '../../components/ModalEnroll';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import { unenrollCourse, clearSuccess } from '../../actions/courseActions';
import SweetAlert from 'react-bootstrap-sweetalert';

const styles = {
  bigAvatar: {
    height: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}


class CourseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowSuccess: false,
      isLoading: false
    };
    this.handelOutcourse = this.handelOutcourse.bind(this);
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  handelOutcourse(courseId){
    this.props.unenrollCourse(courseId);
    this.setState({
      isLoading: true
    })
  }

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.success.data === "Đã rút tên ra khỏi khóa học") {
      this.setState({
        isShowSuccess: true,
        isLoading: false
      })
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.clearSuccess()
  }

  render() {
    const {currentcourses} = this.props.courses

    var CourseListTable = <ReactLoading type='bars' color='#05386B' height={100} width={50}/>

    if(currentcourses !== null){

      if(currentcourses.length === 0)
      {
        CourseListTable = <h3>Bạn hiện không có khóa học nào</h3>
      }
      else{
        CourseListTable=
        <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th className="text-center">Hình khóa học</th>
              <th>Tên khóa học</th>
              <th>Ngày tạo</th>
              <th>Rút tên</th>
            </tr>
          </thead>
          <tbody>
            {
              currentcourses.map(course=>
              <tr key={course._id}>
                <td>
                  <div className="text-center">
                    <Link to={`/courses/${course._id}`}>
                      <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                    </Link>
                  </div>
                </td>
                <td>
                  <Link to={`/courses/${course._id}`}>{course.title}</Link>
                </td>
                <td>
                  <Moment format="DD/MM/YYYY">
                    {course.created}
                  </Moment>
                </td>
                <td>
                  <Button color="danger" onClick={this.handelOutcourse.bind(this, course._id)}> <i className="fa fa-sign-out"></i></Button>
                </td>
              </tr>
              )
            }
          </tbody>
        </Table>
      }
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-book"></i>Danh sách khóa học
          </CardHeader>
          <CardBody>
            <ModalEnroll/>
            <br/>
            {CourseListTable}
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Rút tên khỏi khóa học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang rút tên khỏi khóa học</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

CourseList.propTypes = {
  getCurentCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
  unenrollCourse: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,
  success: state.success
});
export default connect(mapStateToProps, { getCurentCourse, unenrollCourse, clearSuccess })(CourseList); 