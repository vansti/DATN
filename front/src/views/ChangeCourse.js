import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { Container, Table, Button, Card, CardBody, Modal, ModalBody } from 'reactstrap';
import { getAllCourse } from '../actions/courseActions';
import { repNotifyMail, clearSuccess } from '../actions/userActions';
import SweetAlert from 'react-bootstrap-sweetalert';

const styles = {
  bigAvatar: {
    height: 60,
    width: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class ChangeCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      allcourses: [],
      isShowSuccess: false
    };
  }

  componentDidMount() {
    this.props.getAllCourse();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { allcourses, loading } = nextProps.courses
      this.setState({
        allcourses: allcourses.filter(course => course._id !== this.props.match.params.courseId),
        loading
      })
    }

    if (nextProps.success.mes === 'Đã phản hồi mail thành công') {
      this.setState({ isLoading: false, isShowSuccess: true })
      this.props.clearSuccess()
    }
  }

  handleClickChange(courseId, courseCode){
    const repData = {
      replyMail: {
        chosen: `Chuyển sang lớp "${courseCode}"`,
        changeCourseId: courseId
      }
    }

    this.props.repNotifyMail(this.props.match.params.userId, this.props.match.params.courseId, repData)
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  render() {
    const {       
      loading, 
      allcourses 
    } = this.state;

    return (
      <div className="animated fadeIn">
        <Container>
          <h5 style={{fontSize:25, fontWeight:'bold'}}>Danh sách khóa học hiện có</h5>
          <Card>
            <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div>
                {
                  allcourses.length === 0
                  ?
                  <h2>Không có khóa học để có thể chuyển</h2>
                  :
                  <Table style={{marginTop:20}} responsive className="mb-0 d-none d-sm-table">
                    <tbody>
                      {
                        allcourses.map(course=>
                          <tr key={course._id}>
                            <td>
                              <div className="text-center">
                                <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                              </div>
                            </td>
                            <td>
                              <b>{course.title}</b><br/>
                              <span style={{color:'#1E90FF', fontWeight:'bold'}}>Mã khóa học: {course.code}</span>
                            </td>
                            <td>
                              <Button onClick={()=>window.open(`/course-info/${course._id}`)} className="btn-pill" color="secondary">
                                Xem chi tiết
                              </Button>
                            </td>
                            <td>
                              <Button onClick={this.handleClickChange.bind(this, course._id, course.code)}  className="btn-pill" color="secondary">
                                Chuyển sang khóa học này
                              </Button>
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                }
              </div>
            }
            </CardBody>
          </Card>
        </Container>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title='Yêu cầu chuyển lớp của bạn đã được gửi'
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  success: state.success,
  courses: state.courses  
});

export default connect(mapStateToProps, { getAllCourse, repNotifyMail, clearSuccess })(ChangeCourse);
