import React, { Component } from 'react';
import {Card, CardBody, Table, Button, CardHeader, Modal, ModalBody} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getApproveList, approveStudent, clearSuccess } from '../../actions/userActions';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';


class ApproveStudent extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
    this.handleClickApprove = this.handleClickApprove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success === "Duyệt thành công") {
      this.setState({isLoading: false})
      this.props.clearSuccess();
    }
  }

  componentDidMount = () => {
    this.props.getApproveList(this.props.match.params.courseId);
  }

  handleClickApprove(studentId){
    this.setState({isLoading: true})
    this.props.approveStudent(this.props.match.params.courseId, studentId)
  } 

  render() {
    const {approve_list} = this.props.users;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách học viên ghi danh</b>
          </CardHeader>
          <CardBody>
            {
              approve_list === null
              ? <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
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
                        <th>Phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        approve_list.enrollStudents.map((elem, index) =>
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
                            <td><Button color="danger" onClick={this.handleClickApprove.bind(this, elem.student._id)}> Duyệt </Button></td>
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
        <Card>
          <CardHeader>
            <b>Danh sách học viên đã duyệt</b>
          </CardHeader>
          <CardBody>
            {
              approve_list === null
              ? <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                {
                  approve_list.students.length === 0
                  ? <h2> không có học viên</h2>
                  :
                  <Table bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Hình đại diện</th>
                        <th>Email</th>
                        <th>Họ và Tên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        approve_list.students.map((elem, index) =>
                          <tr key={elem._id}>
                            <th>                      
                              <div className="avatar">
                                <img src={elem.photo} className="img-avatar" alt="" />
                              </div>
                            </th>
                            <td>{elem.email}</td>
                            <td>{elem.name}</td>
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

ApproveStudent.propTypes = {
  getApproveList: PropTypes.func.isRequired,
  approveStudent: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  success: state.success
});
export default connect(mapStateToProps, { getApproveList, approveStudent, clearSuccess })(ApproveStudent); 