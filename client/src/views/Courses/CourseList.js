import React, { Component, Fragment } from 'react';
import {Card, Table, CardBody, CardHeader} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurentCourse } from '../../actions/courseActions'; 
import ReactLoading from 'react-loading';

const styles = {
  bigAvatar: {
    height: 60,
    width: 60,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class CourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentcourses: [], 
      loading: true
    };
    this.handleClickCourse = this.handleClickCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { currentcourses, loading } = nextProps.courses
      this.setState({ 
        currentcourses, 
        loading 
      });
    }
  }

  componentDidMount = () => {
    this.props.getCurentCourse();
  }

  handleClickCourse(courseId){
    this.props.history.push('/courses/' + courseId)
  } 

  render() {
    const { currentcourses, loading } = this.state

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-book"></i>Khóa học của tôi
          </CardHeader>
          <CardBody>
            <br/>
            {
              loading
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
              {
                currentcourses.length === 0
                ?
                <h3>Bạn hiện không có khóa học nào</h3>
                :
                <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                  <tbody>
                    {
                      currentcourses.map(course=>
                      <tr key={course._id} className="changeCursor" onClick={this.handleClickCourse.bind(this, course._id)}>
                        <td>
                          <div className="text-center">
                            <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                          </div>
                        </td>
                        <td>
                          <b>{course.title}</b><br/>
                          <span style={{color:'#1E90FF', fontWeight:'bold'}}>Mã khóa học: {course.code}</span>
                        </td>
                      </tr>
                      )
                    }
                  </tbody>
                </Table>
              }
              </Fragment>
            }
          </CardBody>
        </Card>
      </div>
    )
  }
}

CourseList.propTypes = {
  getCurentCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getCurentCourse })(CourseList); 