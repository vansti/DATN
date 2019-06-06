import React, { Component } from 'react';
import { Card, CardBody, Table, Button, CardHeader, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { connect } from 'react-redux';
import { getApproveListStudent, clearSuccess } from '../../actions/userActions';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';


class ApproveStudent extends Component {
  constructor() {
    super();
    this.state = {
      approve_list: {
        enrollStudents: [],
        maxStudent: ''
      },
      courseId: null,
      loading: true,
      isLoading: false,
      info: null,
      modal: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { approve_list, loading } = nextProps.users
      this.setState({ 
        approve_list, 
        loading 
      });
    }

    if (nextProps.success === "Duyệt thành công") {
      this.setState({isLoading: false})
      this.props.clearSuccess();
    }
  }

  componentDidMount = () => {
    this.props.getApproveListStudent(this.props.match.params.courseId);
  }

  handleClickDetail(listId){
    this.setState({
      info: this.state.approve_list.enrollStudents.find(elem => elem._id === listId),
      modal: true
    })
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const { approve_list, loading, info } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách học viên đã ghi danh</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                {
                  approve_list.isFull === true
                  ?
                  null
                  :
                  <div style={{marginBottom: 10}}>
                    <Button color='primary' onClick={()=>this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}/add-student`)}>
                      Thêm học viên mới vào khóa học
                    </Button>
                    <Button style={{marginLeft: 20}} color='primary' onClick={()=>this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}/add-joined-student`)}>
                      Thêm học viên cũ vào khóa học
                    </Button>
                  </div>
                }

                <b>Số lượng học viên:</b> {approve_list.enrollStudents.length} / {approve_list.maxStudent}
                <br/><br/>
                {
                  approve_list.enrollStudents.length === 0
                  ? <h2> không có học viên</h2>
                  :
                  <Table bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Hình đại diện</th>
                        <th>Email</th>
                        <th>Họ và Tên</th>
                        <th>Thời gian ghi danh</th>
                        <th>Phương thức thanh toán</th>
                        <th>Thông tin thanh toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        approve_list.enrollStudents.map((elem, index) =>
                        {
                          return (
                            <tr key={elem._id}>
                            <th>                      
                              <div className="avatar">
                                <img src={elem.student.photo} className="img-avatar" alt="" />
                              </div>
                            </th>
                            <td>{elem.student.email}</td>
                            <td>{elem.student.name}</td>
                            <td>
                              <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                                {elem.enrollDate}
                              </Moment>
                            </td>
                            <td>{elem.paymentMethod}</td>
                            <td style={{textAlign:'center'}}><Button color="danger" onClick={this.handleClickDetail.bind(this, elem._id)}> Xem </Button></td>
                          </tr>
                          )
                        }
                        )
                      }
                    </tbody>
                  </Table>
                }
              </div>
            }

          </CardBody>
        </Card>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Thông tin thanh toán</ModalHeader>
          <ModalBody>
            {
              info
              ?
              <div>
                <b>Phương thức thanh toán: </b> {info.paymentMethod}<br/>
                <b>Tên người thanh toán: </b> {info.paymentDetail.recipient_name}<br/>
                <b>Mail người thanh toán: </b> {info.paymentDetail.email}<br/>
                <b>Địa chỉ: </b> {info.paymentDetail.line1}<br/>
                <b>Thành phố: </b> {info.paymentDetail.city}<br/>
              </div>
              :
              null
            }
          </ModalBody>
        </Modal>
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

const mapStateToProps = state => ({
  users: state.users,
  success: state.success
});
export default connect(mapStateToProps, { getApproveListStudent, clearSuccess })(ApproveStudent); 