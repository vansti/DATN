import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CardBody, CardHeader, Card, Jumbotron, Media, Row, Col, Button, Modal, ModalBody, Alert } from 'reactstrap';
import { getCourseInfo, enrollCourse, unenrollCourse, clearSuccess } from '../../actions/courseActions';
import Moment from 'react-moment'; 
import NumberFormat from 'react-number-format';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';

const styles = {
  bigAvatar: {
    height: 70,
    width: 70,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
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
    console.log(courseinfo)
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b><i className="fa fa-info-circle"></i>&nbsp;Thông tin khóa học</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Jumbotron>
                <Media>
                  <Media left>
                    <img src={courseinfo.course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                  </Media>
                  <Media body>
                    <h4 className="display-4">{courseinfo.course.title}</h4>
                  </Media>
                </Media>
                <p className="lead">{courseinfo.course.intro}</p>
                <Row>
                  <Col xs="9">
                    <b><i className="fa fa-hourglass"></i>&ensp;&ensp;Hạn đăng ký - </b>
                    <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                      {courseinfo.course.enrollDeadline}
                    </Moment><br/>
                    <b><i className="fa fa-usd" style={{fontSize: "1.50em"}}></i>&ensp;&ensp;Học phí - </b>
                    <NumberFormat thousandSeparator={true} value={courseinfo.course_detail.fee} displayType={'text'}/> VND.<br/>
                    <b><i className="fa fa-calendar" style={{fontSize: "0.90em"}}></i>&ensp;&ensp;Thời gian học - </b>
                    {courseinfo.course_detail.studyTime}.<br/>
                    <b><i className="fa fa-clock-o"></i>&ensp;&ensp;Ngày khai giảng - </b>
                    <Moment format="[ngày] DD [thg] MM, YYYY.">
                      {courseinfo.course_detail.openingDay}
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
                      <Fragment>
                      </Fragment>
                    }

                  </Col>
                </Row>

                <hr/>
                <div dangerouslySetInnerHTML={ { __html: courseinfo.course_detail.info} }></div>
              </Jumbotron>
            }
          </CardBody>
        </Card>
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
