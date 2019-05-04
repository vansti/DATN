import React, { Component } from 'react';
import {  Card, CardHeader, CardBody, Input, Table, Badge, Button } from 'reactstrap';
import { connect } from 'react-redux';
import Moment from 'react-moment'; 
import { getCurentCourse } from '../../actions/courseActions';
import { getUsers } from '../../actions/userActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../../validation/is-empty';
import { AppSwitch } from '@coreui/react'

//import ReactLoading from 'react-loading';

class CheckAttendance extends Component {
  constructor() {
    super();
    this.state = {
      user:[],
      courseId: ''
    };
  }
 
  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  onChangeSelectCourse = e => {
    this.props.getUsers(e.target.value);
    this.setState({ courseId: e.target.value });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users.users)) {
      nextProps.users.users.students.map(user => {
        return user.isPresent = true;
      })
      this.setState({ user: nextProps.users.users.students });
    }
  }

  onChangeSwitch(userid){
    this.state.user.map(user => {
      // if(user._id.toString() === userid.toString())
      //   return user.isPresent = !user.isPresent;
      return user;
    })
  }

  submit = () => {
    var newAttendance = {
      courseId: this.state.courseId,
      date: Date.now(),
      students: []
    };

    newAttendance.students = this.state.user.slice(0);
    newAttendance.students.map(student => {
      student.userId = student._id
      delete student._id
      delete student.name
      delete student.photo
      return student
    })
    console.log(newAttendance)

  }

  render() {
    
    var SelectCourse = '';
    if(this.props.courses.currentcourses === null)
    {
      SelectCourse = null;
    }
    else{
      SelectCourse = this.props.courses.currentcourses.map(course=>
                      <option key={course._id} value={course._id}>{course.title}</option>
                    )
    }

    var StudentList = '';
    if(isEmptyObj(this.props.users.users))
    {
      StudentList = <tr><td></td><td>Chọn khóa học và ngày điểm danh</td></tr>
    }
    else{
      if(this.props.users.users.students.length === 0)
      {
        StudentList = <tr><td></td><td>Chưa có học viên ghi danh</td></tr>
      }
      else{
        StudentList = this.props.users.users.students.map((user, index) =>
        <tr key={user._id}>
          <th>                      
            <div className="avatar">
              <img src={user.photo} className="img-avatar" alt="" />
            </div>
          </th>
          <td>{user.name}</td>
          
          <td><Badge className="mr-1" color="dark" pill>Chưa điểm danh</Badge></td>
          
          <td><AppSwitch onChange={this.onChangeSwitch.bind(this, user._id)} className={'mx-1'} variant={'pill'} color={'success'} checked label dataOn={'Có'} dataOff={'Ko'} /></td>
        </tr>
        )
      }
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Điểm danh ngày <Moment format="DD/MM/YYYY"></Moment></strong>
            <div className="card-header-actions">
              <Input type="select" name="courseId" onChange={this.onChangeSelectCourse}>
                <option value="0">Hãy chọn khóa học</option>
                {SelectCourse}
              </Input>
            </div>
          </CardHeader>
          <CardBody>
            <Button color="danger" onClick={this.submit}> Lưu điểm danh <i className="fa fa-save"></i></Button>
            <br/>
            <br/>
            <Table responsive>
              <thead>
                <tr>
                  <th>Hình</th>
                  <th>Họ Tên</th>
                  <th>Trạng thái</th>
                  <th>Điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {StudentList}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    )
  }
}

CheckAttendance.propTypes = {
  courses: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  getCurentCourse : PropTypes.func.isRequired,
  getUsers : PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  users: state.users
});

export default connect(mapStateToProps, { getCurentCourse, getUsers })(CheckAttendance);  