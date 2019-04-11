import React, { Component } from 'react';
import {    
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Card,
  CardBody,
  CardHeader,
  Button
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAdminCourses } from '../../actions/courseActions'; 
//import ReactLoading from 'react-loading';

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

class AdminCourses extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      currentPage: 1,
      coursesPerPage: 5,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
    this.handleClickApprove = this.handleClickApprove.bind(this);
  }

  componentDidMount=()=>{
    this.props.getAdminCourses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      this.setState({ courses: nextProps.courses.admincourses});
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

  handleClickApprove(courseId){
    this.props.history.push('/admin-courses/approve/' + courseId)
  } 

  render() {
    let { courses, currentPage, coursesPerPage } = this.state;

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * coursesPerPage;
    let indexOfFirstTodo = indexOfLastTodo - coursesPerPage;
    let currentcourses = courses.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(courses.length/coursesPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-list"></i><b>Danh sách khóa học</b>
          </CardHeader>
          <CardBody>
            <Table responsive className="mb-0 d-none d-sm-table">
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
                      <td>
                        <Button className="btn-pill" color="secondary">
                          Chỉnh sửa
                        </Button>
                      </td>
                      <td>
                        <Button onClick={this.handleClickApprove.bind(this, course._id)} className="btn-pill" color="secondary">
                          Phê duyệt
                        </Button>
                      </td>
                      <td>
                        <Button className="btn-pill" color="secondary">
                          Xóa
                        </Button>
                      </td>
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
          </CardBody>
        </Card>
      </div>
    );
  }
}

AdminCourses.propTypes = {
  courses: PropTypes.object.isRequired,
  getAdminCourses: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getAdminCourses })(AdminCourses); 