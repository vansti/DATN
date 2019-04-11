import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllCourse } from '../../actions/courseActions';
import { Row, Col, Card, CardBody, CardHeader, Button } from 'reactstrap';
import Moment from 'react-moment'; 

const styles = {
  bigAvatar: {
    height: 100,
    width: 100,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class AllCourses extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    this.handleDetail = this.handleDetail.bind(this);
  }

  componentDidMount = () => {
    this.props.getAllCourse();
  }

  handleDetail(courseId){
    this.props.history.push(`/course-info/${courseId}`);
  }

  render() {
    const {allcourses} = this.props.courses
    return (
      <div className="animated fadeIn">
        <Row>
          {
            allcourses.map(course =>
            <Col xs="12" sm="6" md="4" key={course._id}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs="6">
                      <img src={course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                    </Col>
                    <Col>               
                      <h5>{course.title}</h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <b><i className="fa fa-clock-o" aria-hidden="true"></i>&ensp;&ensp;Hạn đăng ký - </b>
                  <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                    {course.enrollDeadline}
                  </Moment>
                  <hr/>
                  <p> {course.intro} </p>
                  <Button block color="ghost-primary" onClick={this.handleDetail.bind(this, course._id)}>Xem chi tiết</Button>
                </CardBody>
              </Card>
            </Col>
            )
          }
        </Row>
      </div>
    )
  }
}

AllCourses.propTypes = {
  getAllCourse : PropTypes.func.isRequired,
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses
});
export default connect(mapStateToProps, { getAllCourse })(AllCourses); 
