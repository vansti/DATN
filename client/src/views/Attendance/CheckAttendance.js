import React, { Component } from 'react';
import {  Card, CardHeader, CardBody, Input, Table, Button, ModalBody, Modal, Badge } from 'reactstrap';
import { connect } from 'react-redux';
import Moment from 'react-moment'; 
import { getCurentCourse, clearSuccess } from '../../actions/courseActions';
import { getUsers, clearUsers } from '../../actions/userActions';
import { addAttendance, getAttendance, editAttendance, clearAttendance } from '../../actions/attendanceActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../../validation/is-empty';
import { AppSwitch } from '@coreui/react'
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';

class CheckAttendance extends Component {
  constructor() {
    super();
    this.state = {
      user:[],
      userAttendance:[],
      attendanceId:'',
      courseId: '',
      isShowSuccess: false,
    };
  }
 
  componentDidMount = () => {
    this.props.getCurentCourse();
    this.props.clearAttendance();
    this.props.clearUsers();
  }

  onChangeSelectCourse = e => {
    if(e.target.value !== '0')
    {
      this.props.getAttendance(e.target.value);
      this.props.getUsers(e.target.value);
    }
    
    this.setState({ 
      courseId: e.target.value, 
      user:[],
      userAttendance:[]
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users.users)) {
      nextProps.users.users.students.map(user => {
        return user.isPresent = true;
      })
      this.setState({ user: nextProps.users.users.students });
    }

    if (!isEmptyObj(nextProps.attendance.attendance)) {
      var today = new Date();

      nextProps.attendance.attendance.forEach(element => {
        if(new Date(element.date).getFullYear() === today.getFullYear()
        && new Date(element.date).getMonth() === today.getMonth()
        && new Date(element.date).getDate() === today.getDate())
        {
          this.setState({
            userAttendance: element.students,
            attendanceId: element._id
          })
        }
      })
    }

    if (nextProps.success.data === "Điểm danh thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }

  }

  onChangeSwitch(userid){
    this.state.user.map(user => {
      if(user._id.toString() === userid.toString())
        return user.isPresent = !user.isPresent;
      return user;
    })
  }

  onChangeSwitch2(userid){
    this.state.userAttendance.map(user => {
      if(user.userId.toString() === userid.toString())
        return user.isPresent = !user.isPresent;
      return user;
    })
  }


  submit = () => {
    // var today = (new Date()).toISOString().substring(0, 10);
    // console.log(new Date(today))
    var today = new Date();

    var newAttendance = {
      courseId: this.state.courseId,
      date: today,
      students: []
    };

    newAttendance.students = JSON.parse(JSON.stringify(this.state.user));
    newAttendance.students.map(student => {
      student.userId = student._id
      delete student._id
      delete student.name
      delete student.photo
      return student
    })
 
    this.props.addAttendance(newAttendance);
    this.setState({isLoading: true})

  }

  submit2 = () => {
    var editAttendance = {
      _id: this.state.attendanceId,
      students: this.state.userAttendance
    };
 
    this.props.editAttendance(editAttendance);
    this.setState({isLoading: true})

  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.clearSuccess()
    this.props.getAttendance(this.state.courseId);
  }

  render() {
    const {currentcourses} = this.props.courses;
    const {users} = this.props.users;
    
    var SelectCourse = 
                <div className="card-header-actions" style={{marginRight:10, marginBottom:40}} >
                  <ReactLoading type='bars' color='#05386B' height={10} width={50}/>
                </div>

    if(!isEmptyObj(currentcourses)){
      SelectCourse = 
              <div className="card-header-actions" style={{marginRight:10}}>
                <Input  type="select" name="courseId" onChange={this.onChangeSelectCourse}>
                  <option value="0">Hãy chọn khóa học</option>
                    { 
                      currentcourses.map(course=>
                        <option key={course._id} value={course._id}>{course.title}</option>
                      )
                    }
                </Input>
              </div>
    }

    var StudentList = <h2>Hãy chọn khóa học</h2>;
    if(!isEmptyObj(users) && isEmptyObj(this.state.userAttendance) && this.state.courseId !== '0'){
      
      if(users.students.length === 0)
      {
        StudentList = <h2>Chưa có học viên ghi danh</h2>
      }
      else{
        StudentList = 
          <div className="animated fadeIn">
            <Button color="danger" onClick={this.submit}> Lưu điểm danh </Button>
            <br/>
            <br/>
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th>Hình đại diện</th>
                  <th>Email</th>
                  <th>Họ và Tên</th>
                  <th>Trạng thái</th>
                  <th>Điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {
                  users.students.map((user, index) =>
                  <tr key={user._id}>
                    <th>                      
                      <div className="avatar">
                        <img src={user.photo} className="img-avatar" alt="" />
                      </div>
                    </th>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td> <Badge className="mr-1" color="dark" pill>Chưa điểm danh</Badge> </td>
                    <td><AppSwitch onChange={this.onChangeSwitch.bind(this, user._id)} className={'mx-1'} variant={'pill'} color={'success'} checked label dataOn={'Có'} dataOff={'Ko'} /></td>
                  </tr>
                  )
                }
              </tbody>
            </Table>
          </div>
      }
    }

    if(!isEmptyObj(users) && !isEmptyObj(this.state.userAttendance) && this.state.courseId !== '0'){
        StudentList = 
          <div className="animated fadeIn">
            <Button color="danger" onClick={this.submit2}> Chỉnh sửa điểm danh </Button>
            <br/>
            <br/>
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th>Hình đại diện</th>
                  <th>Email</th>
                  <th>Họ và Tên</th>
                  <th>Trạng thái</th>
                  <th>Điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.userAttendance.map((user, index) =>
                  <tr key={user._id}>
                    <th>                      
                      <div className="avatar">
                        <img src={user.photo} className="img-avatar" alt="" />
                      </div>
                    </th>
                    <td>{user.email}</td>
                    <td>{user.name}</td>
                    <td>{user.isPresent === true
                        ?<Badge className="mr-1" color="success" pill>Hiện diện</Badge>
                        :<Badge className="mr-1" color="danger" pill>Vắng</Badge>
                        }
                    </td>
                    <td><AppSwitch onChange={this.onChangeSwitch2.bind(this, user.userId)} className={'mx-1'} variant={'pill'} color={'success'} checked={user.isPresent} label dataOn={'Có'} dataOff={'Ko'} /></td>
                  </tr>
                  )
                }
              </tbody>
            </Table>
          </div>
    }
    
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Điểm danh ngày <Moment format="DD/MM/YYYY"></Moment></strong>
            {SelectCourse}
          </CardHeader>
          <CardBody>
            {StudentList}
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Điểm danh thành công!"
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
      </div>
    )
  }
}

CheckAttendance.propTypes = {
  courses: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  getCurentCourse : PropTypes.func.isRequired,
  getUsers : PropTypes.func.isRequired,
  getAttendance: PropTypes.func.isRequired,
  addAttendance: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  attendance : PropTypes.object.isRequired,
  editAttendance: PropTypes.func.isRequired,
  clearAttendance: PropTypes.func.isRequired,
  clearUsers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  users: state.users,
  errors: state.errors,
  success: state.success,
  attendance: state.attendance
});

export default connect(mapStateToProps, { getCurentCourse, getUsers, addAttendance, getAttendance, clearSuccess, editAttendance, clearAttendance, clearUsers })(CheckAttendance);  