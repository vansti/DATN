import React, { Component } from 'react';
import {Card, Table, CardBody,  CardHeader, CardFooter} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions';
import ModalEnroll from '../../components/ModalEnroll';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

const styles = {
  bigAvatar: {
    height: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}


class CourseList extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }


  render() {
    var list = '';
    if(this.props.courses.currentcourses === null)
    {
      list = <tr><td></td><td></td><td ><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td><td></td></tr>
    }
    else{
      if(this.props.courses.currentcourses.length === 0)
      {
        list = <tr><td></td><td></td><td >Bạn hiện không có khóa học nào</td><td></td></tr>
      }
      else{
        list = this.props.courses.currentcourses.map(course=>
                        <tr key={course._id}>
                          <td className="text-center">
                            <div>
                              <Link to={`/courses/${course._id}`}>
                              <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <Link to={`/courses/${course._id}`}>{course.title}</Link>
                          </td>
                          <td>
                            <div>{course.mainteacher}</div>
                          </td>
                          <td>
                            <Moment format="DD/MM/YYYY">
                              {course.created}
                            </Moment>
                          </td>

                        </tr>
                      )
      }
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            Danh sách khóa học
          </CardHeader>
          <CardBody>
            <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th className="text-center"><i className="fa fa-book"></i></th>
                  <th>Tên khóa học</th>
                  <th>Giáo viên chính</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {list}
              </tbody>
            </Table>
          </CardBody>
          <CardFooter>
           <ModalEnroll/>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

CourseList.propTypes = {
  getCurentCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getCurentCourse })(CourseList); 
