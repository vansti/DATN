import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Row, 
  Col, 
  Container, 
  Table,
  Alert
} from 'reactstrap';
import { getCourseInfo, getGuestCourseInfo, clearSuccess } from '../actions/courseActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import ReactLoading from 'react-loading';
import LoginModal from './LoginModal';
import Payment from './Payment';
import 'moment/locale/vi';
import isEmptyObj from '../validation/is-empty';

var moment = require('moment');

const styles = {
  imgbox3: {
    position: 'relative',
    height: 200
  },
  bigAvatar: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

class CourseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      courseinfo: {},
      guestcourseinfo: []
    };
  }

  componentDidMount = () => {
    if(this.props.auth.isAuthenticated)
    {
      this.props.getCourseInfo(this.props.match.params.courseId);
    }else{
      this.props.getGuestCourseInfo(this.props.match.params.courseId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { guestcourseinfo, courseinfo, loading } = nextProps.courses
      this.setState({
        guestcourseinfo,
        courseinfo,
        loading
      })
    }

    if (nextProps.success.mes === 'đăng nhập thành công') {
      this.props.getCourseInfo(this.props.match.params.courseId)
      this.props.clearSuccess()
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const { courseinfo, loading, guestcourseinfo } = this.state
    return (
      <div className="animated fadeIn">
        {
          this.props.auth.isAuthenticated
          ?
          <div className="app-body" style={{marginBottom: 50}}>
            {
              loading || isEmptyObj(courseinfo)
              ?
              <Container>
                <ReactLoading type='bars' color='#05386B'/>
              </Container>
              :
              <main className="main">
                <Container>
                  <div style={styles.imgbox3}>
                    <img src={courseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                  </div>
                  <span style={{color:'#1E90FF', fontSize:20, fontWeight:'bold'}}>Mã khóa học: {courseinfo.course.code}</span>
                  <h2 style={{marginTop:10, fontWeight:'bold'}}>{courseinfo.course.title}</h2>
                  <p className="lead">{courseinfo.course.intro}</p>
                </Container>  
                <Container fluid>
                  <hr/>
                  <Row>
                    <Col xs="9">
                      <b>Hạn đăng ký - </b>
                      <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                        {courseinfo.course.enrollDeadline}
                      </Moment><br/>
                      <b>Học phí - </b>
                      <NumberFormat thousandSeparator={true} value={courseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                      <b>Thời gian học - </b>
                      {courseinfo.course_detail.studyTime}.<br/>
                      <b>Ngày khai giảng - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {courseinfo.course_detail.openingDay}
                      </Moment><br/>
                      <b>Ngày kết thúc - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {courseinfo.course_detail.endDay}
                      </Moment><br/>
                    </Col>
                    <Col>
                      {
                        courseinfo.isEnroll
                        ?
                        <Alert color='danger' style={{textAlign: 'center', fontWeight: 'bold'}}>Đã ghi danh</Alert>                        
                        :
                        <div>
                          {
                            courseinfo.course_detail.isFull === true
                            ?
                            <Alert color='danger' style={{textAlign: 'center', fontWeight: 'bold'}}>Khóa học đã hết chỗ</Alert>                        
                            :
                            <div>
                              <div style={{color:'red', fontSize:17, fontWeight:'bold', textAlign: 'center'}}>Ghi danh ngay</div>
                              <p style={{color:'red', fontSize:20, fontWeight:'bold', textAlign: 'center'}}><NumberFormat thousandSeparator={true} value={courseinfo.course_detail.fee} displayType={'text'}/> VND.</p>
                              <div style={{textAlign: 'center'}}><Payment fee={courseinfo.course_detail.fee}/></div>
                            </div>
                          }
                        </div>
                      }
                    </Col>
                  </Row>

                  <hr/>
                  <Container>
                    <h4 style={{fontWeight:'bold'}}>Giới thiệu nội dung khóa học</h4>
                  </Container>
                  <div dangerouslySetInnerHTML={ { __html: courseinfo.course_detail.info} }></div>

                  <hr/>
                  <Container>
                    <h4 style={{fontWeight:'bold'}}>Lịch học và bài học</h4>
                  </Container>
                  <Table  dark bordered responsive className="table-outline mb-0 d-none d-sm-table">
                    <thead>
                      <tr>
                        <th>Ngày học</th>
                        <th>Giờ học</th>
                        <th>Bài học</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        courseinfo.schedule.events.map(e=>
                          <tr key={e._id}>
                            <td>
                              {this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
                            </td>
                            <td>
                              <Moment format="HH:mm - ">
                                {e.start}
                              </Moment>
                              <Moment format="HH:mm">
                                {e.end}
                              </Moment>
                            </td>
                            <td>
                              {e.text}
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </Container>
              </main>
            }
          </div>
          :
          <div className="app-body" style={{marginBottom: 50}}>
            {
              loading 
              ?
              <Container>
                <ReactLoading type='bars' color='#05386B'/>
              </Container>
              :
              <main className="main">
                <Container>
                  <div style={styles.imgbox3}>
                    <img src={guestcourseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                  </div>
                  <span style={{color:'#1E90FF', fontSize:20, fontWeight:'bold'}}>Mã khóa học: {guestcourseinfo.course.code}</span>
                  <h2 style={{marginTop:10, fontWeight:'bold'}}>{guestcourseinfo.course.title}</h2>
                  <p className="lead">{guestcourseinfo.course.intro}</p>
                </Container>  
                <Container fluid>
                  <hr/>
                  <Row>
                    <Col xs="9">
                      <b>Hạn đăng ký - </b>
                      <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course.enrollDeadline}
                      </Moment><br/>
                      <b>Học phí - </b>
                      <NumberFormat thousandSeparator={true} value={guestcourseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                      <b>Thời gian học - </b>
                      {guestcourseinfo.course_detail.studyTime}.<br/>
                      <b>Ngày khai giảng - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course_detail.openingDay}
                      </Moment><br/>
                      <b>Ngày kết thúc - </b>
                      <Moment format="[ngày] DD [thg] MM, YYYY.">
                        {guestcourseinfo.course_detail.endDay}
                      </Moment><br/>
                    </Col>
                    <Col>
                      <LoginModal/>
                    </Col>
                  </Row>

                  <hr/>
                  <Container>
                    <h4 style={{fontWeight:'bold'}}>Giới thiệu nội dung khóa học</h4>
                  </Container>
                  <div dangerouslySetInnerHTML={ { __html: guestcourseinfo.course_detail.info} }></div>

                  <hr/>
                  <Container>
                    <h4 style={{fontWeight:'bold'}}>Lịch học và bài học</h4>
                  </Container>
                  <Table  dark bordered responsive className="table-outline mb-0 d-none d-sm-table">
                    <thead>
                      <tr>
                        <th>Ngày học</th>
                        <th>Giờ học</th>
                        <th>Bài học</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        guestcourseinfo.schedule.events.map(e=>
                          <tr key={e._id}>
                            <td>
                              {this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
                            </td>
                            <td>
                              <Moment format="HH:mm - ">
                                {e.start}
                              </Moment>
                              <Moment format="HH:mm">
                                {e.end}
                              </Moment>
                            </td>
                            <td>
                              {e.text}
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </Container>
              </main>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  courses: state.courses,  
  success: state.success
});
export default connect(mapStateToProps, { getCourseInfo, getGuestCourseInfo, clearSuccess })(CourseInfo); 
