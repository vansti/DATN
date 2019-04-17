import React, { Component } from 'react';
import {Card, Table, CardBody,  CardHeader} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions';
import ModalEnroll from '../../components/ModalEnroll';
import Moment from 'react-moment'; 
import ReactLoading from 'react-loading';

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
    this.jumpcourse = this.jumpcourse.bind(this);
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  jumpcourse(courseId){
    this.props.history.push('/courses/' + courseId)
  }

  render() {
    const {currentcourses} = this.props.courses

    var CourseListTable = <ReactLoading type='bars' color='#05386B' height={100} width={50}/>

    if(currentcourses !== null){

      if(currentcourses.length === 0)
      {
        CourseListTable = <h3>Hiện không có khóa học nào</h3>
      }
      else{
        CourseListTable=
        <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
          <thead className="thead-light">
            <tr>
              <th className="text-center">Hình khóa học</th>
              <th>Tên khóa học</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {
              currentcourses.map(course=>
              <tr key={course._id} onClick={this.jumpcourse.bind(this, course._id)} className="changeCursor">
                <td>
                  <div className="text-center">
                    <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                  </div>
                </td>
                <td>
                  {course.title}
                </td>
                <td>
                  <Moment format="DD/MM/YYYY">
                    {course.created}
                  </Moment>
                </td>
              </tr>
              )
            }
          </tbody>
        </Table>
      }
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-book"></i>Danh sách khóa học
          </CardHeader>
          <CardBody>
            <ModalEnroll/>
            <br/>
            {CourseListTable}
          </CardBody>
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