import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Modal, ModalBody, Alert, Table } from 'reactstrap';
import { getCourseInfo, enrollCourse, unenrollCourse, clearSuccess } from '../../actions/courseActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import 'moment/locale/vi';

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
      courseId: null,
      courseinfo: [],
      loading: true,
      titleSucess: '',
      isShowSuccess: false,
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.props.getCourseInfo(this.props.match.params.id);
  }

  handleEnroll = () =>{
    this.props.enrollCourse(this.props.match.params.id);
    this.setState({isLoading: true});
  }

  handleUnEnroll = () =>{
    this.props.unenrollCourse(this.props.match.params.id);
    this.setState({isLoading: true});
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      titleSucess: ''
    })
    this.props.clearSuccess();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { courseinfo, loading } = nextProps.courses
      this.setState({
        courseinfo,
        loading
      })
    }

    if (nextProps.success.data) {
      this.setState({
        titleSucess: nextProps.success.data,
        isShowSuccess: true,
        isLoading: false
      })
    }
  }

  render() {
    const { courseinfo, loading } = this.state
    const { role } = this.props.auth.user
    return (
      <div className="animated fadeIn">
        {
          loading
          ?
          <Container>
            <ReactLoading type='bars' color='#05386B'/>
          </Container>
          :
          <Fragment>
            <Container>
              <div style={styles.imgbox3}>
                <img src={ courseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
              </div>
              <h2 style={{marginTop:10, fontWeight:'bold'}}>{ courseinfo.course.title}</h2>
              <p className="lead">{ courseinfo.course.intro}</p>
            </Container>  
            <Container fluid>
              <hr/>
              <Row>
                <Col xs="9">
                  <b>Hạn đăng ký - </b>
                  <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                    { courseinfo.course.enrollDeadline}
                  </Moment><br/>
                  <b>Học phí - </b>
                  <NumberFormat thousandSeparator={true} value={ courseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                  <b>Thời gian học - </b>
                  { courseinfo.course_detail.studyTime}.<br/>
                  <b>Ngày khai giảng - </b>
                  <Moment format="[ngày] DD [thg] MM, YYYY.">
                    { courseinfo.course_detail.openingDay}
                  </Moment><br/>
                  <b>Ngày kết thúc - </b>
                  <Moment format="[ngày] DD [thg] MM, YYYY.">
                    { courseinfo.course_detail.endDay}
                  </Moment><br/>
                </Col>
                <Col>
                  {
                    role === 'student'
                    ?
                    <Fragment>
                      {
                        courseinfo.isEnroll === false
                        ?
                        <Fragment>
                          {
                            courseinfo.isApprove === true
                            ?
                            <Alert color='danger' style={{textAlign: 'center', fontWeight: 'bold'}}>Đã tham gia vào khóa học</Alert>
                            :
                            <Button color="danger" onClick={this.handleEnroll} className="btn-pill" size="lg" block>
                              <i className="fa fa-pencil-square-o"></i>&nbsp;Ghi danh
                            </Button>
                          }
                        </Fragment>
                        :
                        <Button color="danger" onClick={this.handleUnEnroll} className="btn-pill" size="lg" block>
                          <i className="fa fa-times"></i>&nbsp;Hủy ghi danh
                        </Button>
                      }
                    </Fragment>
                    :
                    null
                  }
                </Col>
              </Row>

              <hr/>
              <Container>
                <h4 style={{fontWeight:'bold'}}>Giới thiệu nội dung khóa học</h4>
              </Container>
              <div dangerouslySetInnerHTML={ { __html:  courseinfo.course_detail.info} }></div>

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
            <br/>
          </Fragment>
        }
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title={this.state.titleSucess}
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
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

CourseInfo.propTypes = {
  getCourseInfo: PropTypes.func.isRequired,
  enrollCourse: PropTypes.func.isRequired,
  unenrollCourse: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,  
  success: state.success,
  auth: state.auth
});
export default connect(mapStateToProps, { getCourseInfo, enrollCourse, unenrollCourse, clearSuccess })(CourseInfo); 
