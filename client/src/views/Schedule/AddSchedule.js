import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Card, CardHeader, CardBody, Input, Button, Modal, ModalBody, Table } from 'reactstrap';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { getCurentCourse } from '../../actions/courseActions';
import { addSchedule, getSchedule } from '../../actions/scheduleActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import { clearSuccess } from '../../actions/courseActions';
import isEmptyObj from '../../validation/is-empty';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
var moment = require('moment');

const styles = {
  left: {
    float: "left",
    width: "220px"
  },
  main: {
    marginLeft: "220px"
  }
};

class AddSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: false,
      isLoading:false,
      isShowSuccess: false,
      courseId: '0',
      viewType: "Week",
      headerHeight: 30,
      hourWidth: 60,
      cellHeight: 30,
      timeRangeSelectedHandling: "Disabled",
      durationBarVisible: false
    };
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.clearSuccess();
    this.props.getSchedule(this.state.courseId)
  }

  componentDidMount() {
    this.props.getCurentCourse();

    document.getElementsByClassName("calendar_default_corner")[0].innerHTML = `<div class="calendar_default_corner_inner" unselectable="on"></div>`;

    this.setState({
      startDate: DayPilot.Date.today(),
      events: []
    });
  }

  onChangeSelectCourse = e => {
    if(e.target.value !== '0')
    {
      this.props.getSchedule(e.target.value)
    }
    this.setState({ 
      courseId: e.target.value
    });
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.success.mes === "Lưu thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }

    if (nextProps.schedule)
    {
      const { schedule, loading } = nextProps.schedule

      if(!isEmptyObj(schedule))
      {
        this.setState({ 
          events: schedule.events,
          loading 
        });
      }
      this.setState({ 
        loading 
      });
    }
  }

  submit=()=>{

    var newSchedule = {
      courseId: this.state.courseId,
      events: this.state.events
    };
    // console.log(newSchedule)

    this.props.addSchedule(newSchedule)
    this.setState({isLoading: true})
  }

  onChangeTime = (eventId, time) => 
  {
    var Arr = this.state.events.slice(0);

    Arr.map(function(e) {
      if(eventId === e._id)
      {
        e.time = time
        e.start = moment(e.date).format('YYYY-MM-DD') + 'T' + time[0] + ':00'
        e.end = moment(e.date).format('YYYY-MM-DD') + 'T' + time[1] + ':00'
      }
      return e
    });
    this.setState({events: Arr})
  }

  onChangeDate = (eventId, date) => 
  {
    var Arr = this.state.events.slice(0);

    Arr.map(function(e) {
      if(eventId === e._id)
      {
        e.date = moment(date).format('YYYY-MM-DD')
        e.start = moment(date).format('YYYY-MM-DD') + 'T' + e.time[0] + ':00'
        e.end = moment(date).format('YYYY-MM-DD') + 'T' + e.time[1] + ':00'
      }
      return e
    });
    this.setState({events: Arr})
  }
  
  render() {
    var {...config} = this.state;
    const {currentcourses} = this.props.courses;

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

    var DisPlay = <h2>Hãy chọn khóa học</h2>;
    if(this.state.courseId !== '0'){
      DisPlay = null;
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Sửa thời khóa biểu</strong>
            {SelectCourse}
          </CardHeader>
          <CardBody >
            {DisPlay}
            <div style={{display: this.state.courseId === '0' ? 'none' : 'block'}}>
              <Button color="danger" onClick={this.submit}> Lưu </Button>
              <br/>
              <br/>
              {
                this.state.events.length === 0
                ?
                null
                :
                <Table responsive bordered>
                  <thead className="thead-light">
                    <tr>
                      <th>Ngày học</th>
                      <th>Giờ học</th>
                      <th>Bài học</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.events.map(e=>
                      <tr key={e._id}>
                        <td>
                          <DatePicker
                            selected={new Date(e.date)}
                            onChange={this.onChangeDate.bind(this, e._id)}
                            dateFormat="dd/MM/yyyy"
                            customInput={<Input />}
                          />
                        </td>
                        <td>
                          <TimeRangePicker
                            onChange={this.onChangeTime.bind(this, e._id)}
                            value={e.time}
                          />
                        </td>
                        <td>
                          {e.text}
                        </td>
                      </tr>
                    )
                  }
                  </tbody>
                </Table>
              }
              <div style={styles.left}>
                <DayPilotNavigator
                  selectMode={"week"}
                  cellWidth={30}
                  cellHeight={30}
                  dayHeaderHeight={30}
                  titleHeight={30}
                  showMonths={3}
                  skipMonths={3}
                  onTimeRangeSelected={ args => {
                    this.setState({
                      startDate: args.day
                    });
                  }}
                  events= {this.state.events}
                />
              </div>
              <div style={styles.main}>
              <DayPilotCalendar
                {...config}
                ref={component => {
                  this.calendar = component && component.control;
                }}
              />
              </div>
            </div>
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Lưu thành công!"
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
        <Modal isOpen={this.state.loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading ...</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

AddSchedule.propTypes = {
  courses: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  getCurentCourse : PropTypes.func.isRequired,
  addSchedule : PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  getSchedule: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  success: state.success,
  schedule: state.schedule,
});

export default connect(mapStateToProps, { getCurentCourse, addSchedule, clearSuccess, getSchedule })(AddSchedule);  