import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getEventSchedule } from '../../actions/scheduleActions';
import isEmptyObj from '../../validation/is-empty';
import { 
  Alert, 
  Modal, 
  ModalBody,
  Card,
  CardHeader,
  CardBody,
  Jumbotron,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button
} from 'reactstrap';
import ReactLoading from 'react-loading';
import NoImg from '../../assets/img/NoImg.png';
import ExerciseList from './Exercise/ExerciseList';
import Moment from 'react-moment'; 
import 'moment/locale/vi';
var moment = require('moment');

class Lesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accordion: [],
      loading: true,
      date: '',
      text: '',
      content: '',
      files: [],
      exercises: [],
      quizzes: []
    };
  }

  componentDidMount(){
    this.props.getEventSchedule(this.props.match.params.id, this.props.match.params.lessonId)
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    
    const { event, loading } = nextProps.schedule
    if(!isEmptyObj(event))
    {
      var { date, text, content, files, exercises, quizzes } = event

      var accordion = [];
      exercises.map(()=>accordion.push(false))

      this.setState({ 
        date,
        text,
        content,
        files,
        exercises,
        accordion,
        quizzes,
        loading 
      });
    }
    this.setState({ 
      loading
    });

  }

  jumpToQuizLesson = quizId => {
    this.props.history.push(`/courses/${this.props.match.params.id}/lesson/${this.props.match.params.lessonId}/${quizId}`);
  }

  render() {
    const { 
      content, 
      date, 
      text, 
      loading,
      files,
      exercises,
      quizzes 
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Modal isOpen={loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <Alert color="dark" style={{textAlign: 'center',fontWeight: 'bold'}}>
          Bài học {this.capitalizeFirstLetter(moment(date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
          <br/>
          <span style={{fontFamily:'Baloo Bhai, cursive', fontSize: 20 }}>
            {text}
          </span>
        </Alert>
        <Card>
          <CardBody>
            <Label style={{fontWeight:'bold'}}>
              Nội dung bài học
            </Label>
            <Jumbotron>
              {
                !isEmptyObj(content)
                ?
                <div dangerouslySetInnerHTML={ { __html: content} }></div>
                :
                <b>Chưa cập nhật nội dung bài học</b>
              }
            </Jumbotron>

            <Label style={{fontWeight:'bold'}}>
              Tài liệu học
            </Label>
            <ListGroup style={{marginTop:10}}>
            {
              files.length === 0
              ?
              <ListGroupItem>Chưa có tài liệu</ListGroupItem>
              :
              <Fragment>
              {
                files.map(file=>
                  <ListGroupItem key={file.id} action tag="a" href={file.url}>
                    {
                      file.thumbnail
                      ?
                      <img src={file.thumbnail} alt=""/> 
                      :
                      <img src={NoImg} style={{width:47}} alt=""/> 
                    }  
                    <span style={{marginLeft:10}}>{file.name}</span>
                  </ListGroupItem>
                )
              }
              </Fragment>
            }
            </ListGroup>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <b>Bài tập</b>
          </CardHeader>
          <CardBody>
            <ExerciseList exercises={exercises} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <b>Bài trắc nghiệm</b>
          </CardHeader>
          <CardBody>
          {
            quizzes.map((quiz,index) => 
              <Card className="mb-0" key={index} style={{marginTop:10}}>
                <CardHeader style={{backgroundColor: 'lightblue'}}>
                  <Row>
                    <Col xs="10">
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.jumpToQuizLesson(quiz._id)}>
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{quiz.title}</h5>
                      </Button>
                      <small>  
                        <Moment format="Đã đăng vào HH:mm ngày DD/MM/YYYY">
                          {quiz.created}
                        </Moment>
                      </small>
                    </Col>
                    <Col>
                      <small>                  
                        Hạn
                        <Moment format=" HH:mm ngày DD/MM/YYYY">
                          {quiz.deadline}
                        </Moment>
                      </small>
                    </Col>
                  </Row>
                </CardHeader>
              </Card>
            )
          }
          </CardBody>
        </Card>
      </div>
    )
  }
}

Lesson.propTypes = {
};

const mapStateToProps = state => ({
  schedule: state.schedule
});

export default withRouter(connect(mapStateToProps, { getEventSchedule })(Lesson));  