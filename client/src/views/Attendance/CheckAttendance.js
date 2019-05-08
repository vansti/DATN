import React, { Component } from 'react';
import {  Card, CardHeader, CardBody, Input, Table, Button, ModalBody, Modal, Badge } from 'reactstrap';
import { connect } from 'react-redux';
import Moment from 'react-moment'; 
import { getCurentCourse, clearSuccess } from '../../actions/courseActions';
import { getUsers, clearUsers } from '../../actions/userActions';
import { addAttendance, getTodayAttendance, editAttendance, clearAttendance } from '../../actions/attendanceActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../../validation/is-empty';
import { AppSwitch } from '@coreui/react'
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
var moment = require('moment');

class CheckAttendance extends Component {
  constructor() {
    super();
    this.state = {
      user:[],
      userAttendance:[],
      attendanceId:'',
      courseId: '0',
      isShowSuccess: false,
      loadingUser: true,
      loadingUserAttendance: true
    };
  }
 
  componentDidMount = () => {
    this.props.clearUsers();
    this.props.clearAttendance();
    this.props.getCurentCourse();
  }

  onChangeSelectCourse = e => {
    if(e.target.value !== '0')
    {
      this.props.getTodayAttendance(e.target.value);
      this.props.getUsers(e.target.value);
    }
    
    this.setState({ 
      courseId: e.target.value, 
      user:[],
      userAttendance:[]
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const { users, loading } = nextProps.users

      users.students.map(user => {
        return user.isPresent = true;
      })

      this.setState({
        user: users.students,
        loadingUser: loading
      })
    }

    if (!isEmptyObj(nextProps.attendance)) {
      const { loading, today_attendance } = nextProps.attendance
      if(!isEmptyObj(today_attendance))
      {
        this.setState({
          attendanceId: today_attendance._id,
          userAttendance: today_attendance.students,
          loadingUserAttendance: loading
        })
      }else{
        this.setState({
          attendanceId: '',
          userAttendance: [],
          loadingUserAttendance: false
        })
      }
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
      if(user.userId._id.toString() === userid.toString())
        return user.isPresent = !user.isPresent;
      return user;
    })
  }

  submit = () => {
    var today = moment().format('YYYY-MM-DD');

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
      students: []
    };

    editAttendance.students = JSON.parse(JSON.stringify(this.state.userAttendance));
    editAttendance.students.map(student => {
      return student.userId = student.userId._id
    })

    this.props.editAttendance(editAttendance);
    this.setState({isLoading: true})

  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.clearSuccess()
    this.props.getTodayAttendance(this.state.courseId);
  }

  render() {
    const {currentcourses} = this.props.courses;
    const { users } = this.props.users;
    const { loadingUser, loadingUserAttendance, user, userAttendance, courseId } = this.state
    var SelectCourse = 
                <div className="card-header-actions" style={{marginRight:10, marginBottom:40}} >
                  <ReactLoading type='bars' color='#05386B' height={10} width={50}/>
                </div>

    if(currentcourses !== null)
    {
      if(currentcourses.length === 0)
        SelectCourse = 
                  <div className="card-header-actions" style={{marginRight:10}} >
                      <Input  type="select">
                        <option value="0">Chưa tham gia khóa học</option>
                      </Input>
                  </div>
      else{
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
    }

    var StudentList = <h3>Hãy chọn khóa học</h3>;

    if(isEmptyObj(user) && isEmptyObj(userAttendance) && courseId !== '0'){
      StudentList = <h3>Chưa có học viên ghi danh</h3>
    }
    if(!isEmptyObj(user) && isEmptyObj(userAttendance) && courseId !== '0'){
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
                user.map(u =>
                  <tr key={u._id}>
                    <th>                      
                      <div className="avatar">
                        <img src={u.photo} className="img-avatar" alt="" />
                      </div>
                    </th>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td> <Badge className="mr-1" color="dark" pill>Chưa điểm danh</Badge> </td>
                    <td><AppSwitch onChange={this.onChangeSwitch.bind(this, u._id)} className={'mx-1'} variant={'pill'} color={'success'} checked label dataOn={'Có'} dataOff={'Ko'} /></td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </div>
    }

    if(!isEmptyObj(users) && !isEmptyObj(userAttendance) && courseId !== '0'){
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
                userAttendance.map(u =>
                  <tr key={u._id}>
                    <th>                      
                      <div className="avatar">
                        <img src={u.userId.photo} className="img-avatar" alt="" />
                      </div>
                    </th>
                    <td>{u.userId.email}</td>
                    <td>{u.userId.name}</td>
                    <td>{u.isPresent === true
                        ?<Badge className="mr-1" color="success" pill>Hiện diện</Badge>
                        :<Badge className="mr-1" color="danger" pill>Vắng</Badge>
                        }
                    </td>
                    <td><AppSwitch onChange={this.onChangeSwitch2.bind(this, u.userId._id)} className={'mx-1'} variant={'pill'} color={'success'} checked={u.isPresent} label dataOn={'Có'} dataOff={'Ko'} /></td>
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
            {
              loadingUser || loadingUserAttendance
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              StudentList
            }
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
  getTodayAttendance: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { getCurentCourse, getUsers, addAttendance, getTodayAttendance, clearSuccess, editAttendance, clearAttendance, clearUsers })(CheckAttendance);  