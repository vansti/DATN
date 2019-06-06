import React, { Component } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button, Container } from 'reactstrap';
import Moment from 'react-moment'; 
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { getAllCourse } from '../actions/courseActions';

const styles = {
  imgbox3: {
    position: 'relative',
    height: 150
  },
  bigAvatar: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      allcourses: []
    };
  }

  componentDidMount = () => {
    this.props.getAllCourse();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.courses) {
      const { allcourses, loading } = nextProps.courses
      this.setState({
        allcourses,
        loading
      })
    }
  }

  handleDetail(courseId){
    this.props.history.push(`/course-info/${courseId}`);
  }

  render() {
    const { 
      loading, 
      allcourses
    } = this.state

    return (
      <div className="animated fadeIn">
        <Container>
          <h5 style={{fontSize:25, fontWeight:'bold'}}>Tất cả khóa học hiện có</h5>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B'/>
            :
            <Row style={{marginTop:70}}>
              {
                allcourses.map(course =>
                <Col xs="12" sm="6" md="4" key={course._id}>
                  <Card>
                    <CardHeader>
                      <div style={styles.imgbox3}>
                        <img src={course.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                      </div>
          
                      <h5 style={{marginTop:10, fontWeight:'bold'}}>{course.title}</h5>

                    </CardHeader>
                    <CardBody>
                      <b><i className="fa fa-clock-o" aria-hidden="true"></i>&ensp;&ensp;Hạn đăng ký - </b>
                      <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                        {course.enrollDeadline}
                      </Moment>
                      <hr/>
                      <p className='max-lines'> {course.intro} </p>
                      <Button outline color="primary" onClick={this.handleDetail.bind(this, course._id)}><b>Xem chi tiết</b></Button>
                    </CardBody>
                  </Card>
                </Col>
                )
              }
            </Row>
          }
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  courses: state.courses  
});

export default connect(mapStateToProps, { getAllCourse })(Confirm);
