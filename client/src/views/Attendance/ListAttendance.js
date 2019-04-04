import React, { Component } from 'react';
import {  Card, CardHeader, CardBody, Input, Button, Modal, ModalBody, Badge, Table, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions';
import { getAttendance, clearAttendance} from '../../actions/attendanceActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import isEmptyObj from '../../validation/is-empty';
import {Chart} from 'react-google-charts';

class ListAttendance extends Component {
  constructor() {
    super();
    this.state = {
      users:[],
      intialUsers: [],
      courseId: '',
      isLoading: false,
      startDate: null,
      highlightDates: [],
      chartData:[
        [
          {
            type: "date",
            id: "Date"
          },
          {
            type: "number",
            id: "Absent"
          }
        ]
      ]
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
        chartData: [
          [
            {
              type: "date",
              id: "Date"
            },
            {
              type: "number",
              id: "Absent"
            }
          ]
        ]
      })
      nextProps.attendance.attendance.forEach(element => {
        var tempList = [];
        tempList.push(new Date(element.date))
        var count = 0
        element.students.forEach(student=>{
          if(student.isPresent === false)
            count++
        })
        tempList.push(count)
        this.setState(prevState => ({
          chartData: [...prevState.chartData, tempList]
        }))
      })

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
    if(this.state.startDate !== null)
    {
      this.setState({
        users: []
      })
      var userList = [];
      this.props.attendance.attendance.forEach(element => {
        if(this.state.startDate.getFullYear() === new Date(element.date).getFullYear()
          && this.state.startDate.getMonth() === new Date(element.date).getMonth()
          && this.state.startDate.getDate() === new Date(element.date).getDate())
          userList = element.students
      })
      this.setState({
        users: userList,
        intialUsers: userList
      })
    }
  }

  onchange = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialUsers));
    updatedList = updatedList.filter((user)=>
      user.userId.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
      user.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({users: updatedList});
  }

  render() {
    const superClass = this;
    const {currentcourses} = this.props.courses;
    const {attendance} = this.props.attendance;

    var SelectCourse =                 
              <div className="card-header-actions" style={{marginRight:10, marginBottom:40}} >
                <ReactLoading type='bars' color='#05386B' height={10} width={50}/>
              </div>

    if(!isEmptyObj(currentcourses))
    {
      SelectCourse = 
              <div className="card-header-actions">
                <Input type="select" name="courseId" onChange={this.onChangeSelectCourse}>
                  <option value = '0'>Hãy chọn khóa học</option>
                  {
                    this.props.courses.currentcourses.map(course=>
                      <option key={course._id} value={course._id}>{course.title}</option>
                    )
                  }
                </Input>
              </div>
    }

    var SelectDate = <div></div>;
    
    var SelectDateChart = <div></div>;

    if(!isEmptyObj(attendance) && this.state.courseId !== '0')
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

      SelectDateChart =
          <Chart
            width={1000}
            height={350}
            chartType="Calendar"
            loader={<div><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>}
            data={this.state.chartData}
            options={{
              title: 'Thống kê số lượng sinh viên nghỉ'
            }}
            chartEvents={[
              {
                eventName: "select",
                callback({ chartWrapper }) {
                  superClass.setState({
                    startDate : new Date(chartWrapper.getChart().getSelection()[0].date)
                  })
                }
              }
            ]}
            rootProps={{ 'data-testid': '1' }}
          />
    }

    if(this.state.courseId === '0'){
      SelectDate = <div></div>;
    }
    
    var StudentList = <div className="animated fadeIn"><h4>Hãy chọn khóa học và ngày điểm danh</h4></div>;

    if(!isEmptyObj(this.state.intialUsers) && isEmptyObj(this.state.users) && this.state.courseId !== '0')
    {
      StudentList = <div className="animated fadeIn">
                      <Input type="text" name="search" value={this.state.search} onChange={this.onchange} placeholder="Mã số hoặc Họ Tên ..."  />
                      <br/>
                      <h4>Không tìm thấy kết quả</h4>
                    </div>
    }

    if(!isEmptyObj(this.state.users) && this.state.courseId !== '0' )
    {
      StudentList = 
        <div className="animated fadeIn">
          <Input type="text" name="search" value={this.state.search} onChange={this.onchange} placeholder="Mã số hoặc Họ Tên ..."  />
          <br/>
          <Table hover bordered striped responsive size="sm">
            <thead>
              <tr>
                <th>Hình đại diện</th>
                <th>Email</th>
                <th>Họ và Tên</th>
                <th>Trạng thái điểm danh</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.users.map((user, index) =>
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
            <Row >
              <Col sm="3">
                <strong>Xem lịch sử điểm danh</strong>
              </Col>
              <Col>
                {SelectDate}
                {SelectCourse}
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {SelectDateChart}
            {StudentList}
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