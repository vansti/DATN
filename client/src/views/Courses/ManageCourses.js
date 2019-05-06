import React, { Component, Fragment } from 'react';
import {    
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalBody,
  Input
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getManageCourses, joinCourse, clearSuccess } from '../../actions/courseActions'; 
import ReactLoading from 'react-loading';
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

let prev  = 0;
let last  = 0;

class ManageCourses extends Component {
  constructor() {
    super();
    this.state = {
      managecourses: [],
      loading: true,
      currentPage: 1,
      coursesPerPage: 5,
      isShowSuccess: false,
      isLoading: false,
      titleSuccess: '',
      intialManagecourses: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.handleClickApprove = this.handleClickApprove.bind(this);
    this.handleJoinCourse = this.handleJoinCourse.bind(this);
    this.handleEditCourse = this.handleEditCourse.bind(this);
  }

  componentDidMount=()=>{
    this.props.getManageCourses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { managecourses, loading } = nextProps.courses
      this.setState({ 
        intialManagecourses: managecourses,
        managecourses, 
        loading 
      });
    }

    if (nextProps.success === "Tham gia khóa học thành công" || nextProps.success === "Đã tham gia vào khóa học này") {

      this.setState({
        isShowSuccess: true, 
        isLoading: false,
        titleSuccess: nextProps.success
      })

    }
  }
  
  handleClick(event) {
    event.preventDefault();
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  handleLastClick(event) {
    event.preventDefault();
    this.setState({
      currentPage:last
    });
  }

  handleFirstClick(event) {
    event.preventDefault();
    this.setState({
      currentPage:1
    });
  }

  handleEditCourse(courseId){
    this.props.history.push('/manage-courses/edit-course/' + courseId)
  } 

  handleClickApprove(courseId){
    this.props.history.push('/manage-courses/approve/' + courseId)
  } 

  handleJoinCourse(courseId){
    this.props.joinCourse(courseId);
    this.setState({isLoading: true});
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      isLoading: false,
      titleSuccess: ''
    })
    this.props.clearSuccess();
  }

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
    updatedList = updatedList.filter((course)=>
      course.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({ managecourses: updatedList });
  }

  render() {
    let { managecourses, currentPage, coursesPerPage, loading } = this.state;
    const { role } = this.props.auth.user

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * coursesPerPage;
    let indexOfFirstTodo = indexOfLastTodo - coursesPerPage;
    let currentcourses = managecourses.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(managecourses.length/coursesPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-wrench"></i><b>Quản lý khóa học</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
                <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Tên khóa học . . ."/>
                <Table style={{marginTop:20}} responsive className="mb-0 d-none d-sm-table">
                  <tbody>
                    {
                      currentcourses.map(course=>
                        <tr key={course._id}>
                          <td>
                            <div className="text-center">
                              <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                            </div>
                          </td>
                          <td>
                            {course.title}
                          </td>
                          {
                            role === 'teacher'
                            ?
                            <Fragment>
                              <td>
                                <Button onClick={this.handleJoinCourse.bind(this, course._id)} className="btn-pill" color="secondary">
                                  Tham gia
                                </Button>
                              </td>
                            </Fragment>
                            :
                            <Fragment>
                            <td>
                                <Button onClick={this.handleEditCourse.bind(this, course._id)} className="btn-pill" color="secondary">
                                  Chỉnh sửa
                                </Button>
                              </td>
                              <td>
                                <Button onClick={this.handleClickApprove.bind(this, course._id)} className="btn-pill" color="secondary">
                                  Phê duyệt
                                </Button>
                              </td>
                              <td>
                                <Button onClick={this.handleJoinCourse.bind(this, course._id)} className="btn-pill" color="secondary">
                                  Tham gia
                                </Button>
                              </td>
                            </Fragment>
                          }

                        </tr>
                      )
                    }
                  </tbody>
                </Table>
                <br/>
                <nav>
                  <Pagination>
                    <PaginationItem>
                      { 
                        prev === 0 
                        ? <PaginationLink previous tag="button" disabled />
                        : <PaginationLink previous tag="button" onClick={this.handleFirstClick} id={prev} href={prev} />
                      }
                    </PaginationItem>
                    <PaginationItem>
                      { 
                        prev === 0 
                        ? <PaginationLink disabled>Trước</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={prev} href={prev}>Trước</PaginationLink>
                      }
                    </PaginationItem>
                      {
                        pageNumbers.map((number,i) =>
                          <PaginationItem key= {i} active = {pageNumbers[currentPage-1] === (number) ? true : false} >
                            <PaginationLink onClick={this.handleClick} href={number} key={number} id={number}>
                              {number}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }

                    <PaginationItem>
                      {
                        currentPage === last 
                        ? <PaginationLink disabled>Sau</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}>Sau</PaginationLink>
                      }
                    </PaginationItem>

                    <PaginationItem>
                      {
                        currentPage === last 
                        ? <PaginationLink next tag="button" disabled />
                        : <PaginationLink next tag="button" onClick={this.handleLastClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}/>
                      }
                    </PaginationItem>
                  </Pagination>
                </nav>
              </Fragment>
            }
          </CardBody>
        </Card>
        <SweetAlert
          	confirmBtnText="OK"
          	title={this.state.titleSuccess}
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
    );
  }
}

ManageCourses.propTypes = {
  courses: PropTypes.object.isRequired,
  getManageCourses: PropTypes.func.isRequired,
  joinCourse: PropTypes.func.isRequired,
  clearSuccess: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,
  success: state.success,
  auth: state.auth
});
export default connect(mapStateToProps, { getManageCourses, joinCourse, clearSuccess })(ManageCourses); 