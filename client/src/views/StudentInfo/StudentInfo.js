import React, { Component, Fragment } from 'react';
import {  Row, Col, Card, CardHeader, CardBody, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getStudent } from '../../actions/userActions';
import { getStudentCourse } from '../../actions/courseActions';
import { getStudentAbsent } from '../../actions/attendanceActions';
import { getPointColumnsStudent } from '../../actions/pointActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty'; 
import Moment from 'react-moment'; 

const styles = {
  Avatar: {
    width: 80,
    height: 80,
    margin: 'auto',
    borderRadius: 40
  },
  bigAvatar: {
    height: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class StudentIfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      student: {},
      studentcourses: [],
      loadingStudent: true,
      loadingStudentCourse: true,
      loadingStudentAbsentList: false,
      loadingPoint: false,
      isShowAbsentList: false,
      isShowPointList: false
    };
    this.handleAbsent = this.handleAbsent.bind(this);
    this.handlePoint = this.handlePoint.bind(this);
  }

  componentDidMount(){
    this.props.getStudent(this.props.match.params.id)
    this.props.getStudentCourse(this.props.match.params.id)
  }

  handleAbsent(courseId){
    this.setState({
      isShowAbsentList: true,
      isShowPointList: false
    })
    this.props.getStudentAbsent(courseId,this.props.match.params.id)
  }

  handlePoint(courseId){
    this.setState({
      isShowPointList: true,
      isShowAbsentList: false
    })
    this.props.getPointColumnsStudent( courseId, this.props.match.params.id )
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const { student, loading } = nextProps.users

      this.setState({
        student,
        loadingStudent: loading
      })
    }

    if (!isEmptyObj(nextProps.point)) {
      const { student_point, loading } = nextProps.point

      this.setState({
        student_point,
        loadingPoint: loading
      })
    }

    if (!isEmptyObj(nextProps.courses)) {
      const { studentcourses, loading } = nextProps.courses

      this.setState({
        studentcourses,
        loadingStudentCourse: loading
      })
    } 

    if (!isEmptyObj(nextProps.attendance)) {
      const { student_absent_list, loading } = nextProps.attendance

      this.setState({
        student_absent_list,
        loadingStudentAbsentList: loading
      })
    } 

  }

  caculateTotalPoint(pointColumns){
    var totalPoint = 0; 
    for(var i=0; i<pointColumns.length; i++)
    {
      if(!isEmptyObj(pointColumns[i].submit))
        totalPoint = totalPoint + pointColumns[i].submit.studentSubmission[0].point * pointColumns[i].pointRate / 100
    }
    return totalPoint
  }

  render() {
    const { 
      student, 
      loadingStudent, 
      loadingStudentCourse, 
      studentcourses, 
      loadingStudentAbsentList, 
      student_absent_list, 
      isShowAbsentList,
      student_point,
      loadingPoint,
      isShowPointList
    } = this.state
    console.log(student_point)
    var AbsentList = null;

    if(isShowAbsentList === true){
      AbsentList = 
      <Fragment>
        <div><strong>Số ngày nghỉ / Tổng số ngày điểm danh </strong>: {student_absent_list.absentlist.length} / {student_absent_list.attendanceNumber} </div>
        <br/>
        {
          student_absent_list.absentlist.length === 0
          ?
          <h3>Học viên không nghỉ ngày nào</h3>
          :
          <Table responsive bordered>
            <thead className="thead-light">
              <tr>
                <th>Ngày nghỉ</th>
                <th>Giờ học</th>
                <th>Bài học</th>
              </tr>
            </thead>
            <tbody>
              {
                student_absent_list.absentlist.map(element=>
                  <tr key={element._id} >
                    <td >
                      <Moment format="DD/MM/YYYY">
                        {element.date}
                      </Moment>
                    </td >
                    <td>
                    {
                      element.event
                        ? 
                        <Fragment>
                          <Moment format="HH:mm - ">
                            {element.event.start}
                          </Moment>
                          <Moment format="HH:mm">
                            {element.event.end}
                          </Moment>
                        </Fragment>
                        : 
                        <span>Chưa cập nhật</span>
                      }
                    </td>
                    <td>
                      {
                        element.event
                        ? 
                        <span>{element.event.text}</span> 
                        : 
                        <span>Chưa cập nhật</span>
                      }
                    </td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        }
      </Fragment>
    }

    var PointList = null;

    if(isShowPointList === true){
      PointList = 
      <Fragment>
        {
          student_point.pointColumns.length === 0
          ?
          <h3>Chưa cập nhật cột điểm</h3>
          :
          <Table responsive bordered>
            <thead className="thead-light">
              <tr>
                <th>Tên cột điểm</th>
                <th>Tỉ lệ %</th>
                <th>Tên bài làm</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {
                student_point.pointColumns.map(element=>
                  <tr key={element._id} >
                    <td>
                      {element.pointName}
                    </td>
                    <td>
                      {element.pointRate}
                    </td>
                    <td>
                      {
                        element.test
                        ?
                        element.test.title
                        :
                        'Chưa cập nhật'
                      }
                    </td>
                    <td>
                      {
                        element.submit
                        ?
                        element.submit.studentSubmission[0].point
                        :
                        'Chưa cập nhật'
                      }
                    </td>
                  </tr>
                )
              }
              <tr>
                <td colSpan='3' bgcolor="grey" align="center">
                  <font color="white"><b>Tổng điểm :</b></font>
                </td>
                <td>
                  {this.caculateTotalPoint(student_point.pointColumns)}
                </td>
              </tr>
            </tbody>
          </Table>
        }
      </Fragment>
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            {
              loadingStudent || loadingStudentCourse
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Card>
                <CardHeader>
                  <Row >
                    <Col sm="3">
                      <img src={student.photo} alt="avatar" style={styles.Avatar}/>
                    </Col>
                    <Col>
                      <h4>{student.name}</h4>
                      <div><strong>Email</strong>: {student.email}</div>
                      <div><strong>Số điện thoại</strong>: {student.phone ? student.phone : 'Chưa cập nhật'}</div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {
                    studentcourses.length === 0
                    ?
                    <h3>Học viên chưa ghi danh khóa nào</h3>
                    :
                    <Table responsive bordered>
                      <thead className="thead-light">
                        <tr>
                          <th colSpan="3" className="text-center">khóa học của học viên</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        studentcourses.map(course=>
                          <Fragment key={course._id} >
                            <tr >
                              <td rowSpan="2">
                                <div className="text-center">
                                  <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                                </div>
                              </td >
                              <td rowSpan="2">
                                {course.title}
                              </td>
                              <td className="changeCursor" onClick={this.handleAbsent.bind(this, course._id)}>
                                Xem ngày vắng
                              </td>
                            </tr>
                            <tr>
                              <td className="changeCursor" onClick={this.handlePoint.bind(this, course._id)}>
                                Xem điểm số
                              </td>
                            </tr>
                          </Fragment>
                        )
                      }
                      </tbody>
                    </Table>
                  }
                </CardBody>
              </Card>
            }
          </Col>
          <Col>
            <Card>
              <CardHeader>
                <strong>Thông tin của học viên trong khóa học</strong>
              </CardHeader>
              <CardBody>
                {
                  isShowAbsentList
                  ?
                  <Fragment>
                  {
                    loadingStudentAbsentList
                    ? 
                    <ReactLoading type='bars' color='#05386B' />
                    :
                    AbsentList
                  }
                  </Fragment>
                  :
                  <Fragment>
                  {
                    loadingPoint
                    ? 
                    <ReactLoading type='bars' color='#05386B' />
                    :
                    PointList
                  }
                  </Fragment>
                }

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

StudentIfo.propTypes = {
  getStudent: PropTypes.func.isRequired,
  getStudentCourse: PropTypes.func.isRequired,
  getStudentAbsent: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users,
  courses: state.courses,
  attendance: state.attendance,
  point: state.point
});

export default connect(mapStateToProps, { getStudent, getStudentCourse, getStudentAbsent, getPointColumnsStudent })(StudentIfo);  