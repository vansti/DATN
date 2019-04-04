import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Card, CardHeader, CardBody, Input, Button, Modal, ModalBody } from 'reactstrap';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import PropTypes from 'prop-types';
import { getCurentCourse } from '../../actions/courseActions';
import { addSchedule, getSchedule } from '../../actions/scheduleActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import { clearSuccess } from '../../actions/courseActions';

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
      isLoading:false,
      isShowSuccess: false,
      courseId: '0',
      viewType: "Week",
      headerHeight: 30,
      hourWidth: 60,
      cellHeight: 30,
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: args => {
        let dp = this.calendar;
        DayPilot.Modal.prompt("Thêm sự kiện:", "").then(function(modal) {
          dp.clearSelection();
          if (!modal.result) { return; }
          dp.events.add(new DayPilot.Event({
            start: args.start.value,
            end: args.end.value,
            id: DayPilot.guid(),
            text: modal.result
          }));
        });
      },
      eventDeleteHandling: "Update",
      onEventClick: args => {
        let dp = this.calendar;
        DayPilot.Modal.prompt("Thay đổi sự kiện:", args.e.text()).then(function(modal) {
          if (!modal.result) { return; }
          args.e.data.text = modal.result;
          dp.events.update(args.e);
        });
      },
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

    if (nextProps.success.data === "Lưu thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }

    if (nextProps.schedule.schedule)
    {
      this.setState({
        events: nextProps.schedule.schedule.events
      })
    }else{
      this.setState({
        events: []
      })
    }
  }

  submit=()=>{
    var elist = this.calendar.events.list;
    elist.map(element => {
      return element.date = element.start.toString().slice(0, 10)
    });

    var newSchedule = {
      courseId: this.state.courseId,
      events: elist
    };
    this.props.addSchedule(newSchedule)
    this.setState({isLoading: true})
  }

  render() {
    var {...config} = this.state;
    const {currentcourses} = this.props.courses;

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

    var DisPlay = <h2>Hãy chọn khóa học</h2>;
    if(this.state.courseId !== '0'){
      DisPlay = null;
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Tạo thời khóa biểu</strong>
            {SelectCourse}
          </CardHeader>
          <CardBody >
            {DisPlay}
            <div style={{display: this.state.courseId === '0' ? 'none' : 'block'}}>
              <Button color="danger" onClick={this.submit}> Lưu </Button>
              <br/>
              <br/>
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