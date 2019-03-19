import React, { Component } from 'react';
import {  Card, CardHeader, CardBody, Input, Button, Modal, ModalBody, Badge, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions';
import { getAttendance, clearAttendance} from '../../actions/attendanceActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import isEmptyObj from '../../validation/is-empty';

class ListAttendance extends Component {
  constructor() {
    super();
    this.state = {
      users:[],
      courseId: '',
      isLoading: false,
      startDate: null,
      highlightDates: []
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  handleChangeDate(date) {
    this.setState({
      startDate: date
    });
  }

  onChangeSelectCourse = e => {
    if(e.target.value !== '0')
      this.props.getAttendance(e.target.value);
    this.setState({ courseId: e.target.value, startDate: null });
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.attendance.attendance)) {
      this.setState({
        highlightDates: []
      })
      var dateList = [];
      nextProps.attendance.attendance.forEach(element => {
        dateList.push(new Date(element.date))
      })
      this.setState({
        highlightDates: dateList
      })
    }
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
    this.props.clearAttendance();
  }
  
  submit=()=>{
    this.setState({
      users: []
    })
    var userList = [];
    this.props.attendance.attendance.forEach(element => {
      if(this.state.startDate.getTime() === new Date(element.date).getTime())
        userList = element.students
    })
    this.setState({
      users: userList
    })
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
    var SelectDate = <div></div>;
    

    if(!isEmptyObj(this.props.attendance.attendance) && this.state.courseId !== 0)
    {
      SelectDate = 
          <div className="animated fadeIn">
            <div className="card-header-actions" >
              <Button color="danger" onClick={this.submit}> Xác nhận </Button>
            </div>
            <div className="card-header-actions" style={{marginRight:10}}>
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChangeDate}
                highlightDates={this.state.highlightDates}
                customInput={<Input />}
                dateFormat="dd/MM/yyyy"
                placeholderText="Hãy chọn ngày" />
            </div>
            <div className="card-header-actions">
              <div style={{width:60}}>
                <i style={{marginLeft:25, marginTop:10}}className="fa fa-arrow-right" aria-hidden="true"></i>
              </div>
            </div>
          </div>
    }

    if(this.state.courseId === '0'){
      SelectDate = <div></div>;
    }
    
    var StudentList = '';
    if(isEmptyObj(this.state.users))
    {
      StudentList = <tr><td></td><td>Chọn khóa học và ngày điểm danh</td></tr>
    }
    else{
      if(this.state.users.length === 0)
      {
        StudentList = <tr><td></td><td>Chưa có học viên ghi danh</td></tr>
      }
      else{
        StudentList = this.state.users.map((user, index) =>
        <tr key={user._id}>
          <th>                      
            <div className="avatar">
              <img src={user.photo} className="img-avatar" alt="" />
            </div>
          </th>
          <td>{user.name}</td>
          <td>{user.isPresent === true
              ?<Badge className="mr-1" color="success" pill>Hiện diện</Badge>
              :<Badge className="mr-1" color="danger" pill>Vắng</Badge>
              }
          </td>
        </tr>
        )
      }
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            {SelectDate}
            <div className="card-header-actions">
              <Input type="select" name="courseId" onChange={this.onChangeSelectCourse}>
                <option value = '0'>Hãy chọn khóa học</option>
                {SelectCourse}
              </Input>
            </div>

          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr>
                  <th>Hình</th>
                  <th>Họ Tên</th>
                  <th>Trạng thái điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {StudentList}
              </tbody>
            </Table>
          </CardBody>
        </Card>
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

ListAttendance.propTypes = {
  courses: PropTypes.object.isRequired,
  getCurentCourse : PropTypes.func.isRequired,
  attendance : PropTypes.object.isRequired,
  getAttendance: PropTypes.func.isRequired,
  clearAttendance: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  attendance: state.attendance,
});

export default connect(mapStateToProps, { getCurentCourse, getAttendance, clearAttendance })(ListAttendance);  