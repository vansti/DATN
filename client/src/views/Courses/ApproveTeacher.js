import React, { Component } from 'react';
import {Input, Card, CardBody, Table, Button, CardHeader, Modal, ModalBody} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getApproveListTeacher, approveTeacher, clearSuccess } from '../../actions/userActions';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';


class ApproveTeacher extends Component {
  constructor() {
    super();
    this.state = {
      approve_list_teacher: {
        teacherInCourse: [],
        teachers: []
      },
      courseId: null,
      loading: true,
      isLoading: false,
      intialTeacher: []
    };
    this.handleClickApprove = this.handleClickApprove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      const { approve_list_teacher, loading } = nextProps.users;
      this.setState({ 
        intialTeacher: approve_list_teacher ? approve_list_teacher.teachers : [],
        approve_list_teacher, 
        loading 
      });
    }

    if (nextProps.success === "Duyệt thành công") {
      this.setState({isLoading: false})
      this.props.clearSuccess();
    }
  }

  componentDidMount = () => {
    this.props.getApproveListTeacher(this.props.match.params.courseId);
  }

  handleClickApprove(teacherId){
    this.setState({isLoading: true})
    this.props.approveTeacher(this.props.match.params.courseId, teacherId)
  } 

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialTeacher));
    updatedList = updatedList.filter((teacher)=>
      teacher.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({approve_list_teacher: {...this.state.approve_list_teacher, teachers: updatedList}});
  }
  
  render() {
    const { approve_list_teacher, loading } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách giáo viên</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên giáo viên . . ."/>
                {
                  approve_list_teacher.teachers.length === 0
                  ? 
                  <Table bordered striped responsive size="sm">

                    <h2> Không có giáo viên</h2>
                  </Table>
                  :
                  <Table bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Hình đại diện</th>
                        <th>Email</th>
                        <th>Họ và Tên</th>
                        <th>Thời gian làm việc</th>
                        <th>Phê duyệt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        approve_list_teacher.teachers.map((elem, index) =>
                          <tr key={elem._id}>
                            <th>                      
                              <div className="avatar">
                                <img src={elem.photo} className="img-avatar" alt="" />
                              </div>
                            </th>
                            <td>{elem.email}</td>
                            <td>{elem.name}</td>
                            <td>
                              <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                                {elem.enrollDate}
                              </Moment>
                            </td>
                            <td><Button color="danger" onClick={this.handleClickApprove.bind(this, elem._id)}> Duyệt </Button></td>
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
            <b>Danh sách giáo viên trong khóa</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <div className="animated fadeIn">
                {
                  approve_list_teacher.teacherInCourse.length === 0
                  ? <h2> không có giáo viên</h2>
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
                        approve_list_teacher.teacherInCourse.map((elem, index) =>
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

ApproveTeacher.propTypes = {
  getApproveListTeacher: PropTypes.func.isRequired,
  approveTeacher: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  success: state.success
});
export default connect(mapStateToProps, { getApproveListTeacher, approveTeacher, clearSuccess })(ApproveTeacher); 