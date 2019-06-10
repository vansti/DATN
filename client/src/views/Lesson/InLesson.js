import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {  
  Modal, 
  ModalBody, 
  Button, 
  ListGroup, 
  ListGroupItem, 
  Row, 
  Col, 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Collapse,
  Alert,
  Label,
  Jumbotron
} from 'reactstrap';
import { getLessonIncourse } from '../../actions/lessonActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import ExerciseBox from './Exercise/ExerciseBox';
import NoImg from '../../assets/img/NoImg.png';
import Moment from 'react-moment'; 
import QuizModal from './Quiz/QuizModal';
import ExerciseComments from './Exercise/ExerciseComments';

class InLesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      content: '',
      files: [],
      accordion: [],
      loading: true,
      exercises: [],
      quizzes: []
    };
  }

  componentDidMount(){
    this.props.getLessonIncourse(this.props.match.params.id, this.props.match.params.lessonId)
  }


  componentWillReceiveProps(nextProps) {
    const { lesson_in_course, loading } = nextProps.lesson
    if(!isEmptyObj(lesson_in_course))
    {
      var { text, content, files, exercises, quizzes } = lesson_in_course

      var accordion = [];
      exercises.map(()=>accordion.push(false))

      this.setState({ 
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

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  score(exerciseId){
    this.props.history.push(`/score/${this.props.match.params.id}/${exerciseId}`)
  }

  jumpToQuizDetail(quizId){
    this.props.history.push(`/quiz/quiz-detail/${quizId}`);
  }
  
  render() {
    const { 
      content, 
      files, 
      text, 
      loading,
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

        <Alert color="dark" style={{textAlign: 'center', fontSize: 20}}>
          {text}
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
            <i className="fa fa-file-text" aria-hidden="true"></i>
            <b>Bài tập</b>
          </CardHeader>
          <CardBody>
            <ExerciseBox/>
            {
              exercises.length === 0
              ?
              <ListGroup style={{marginTop:10}}>
                <ListGroupItem>Chưa có bài tập</ListGroupItem>
              </ListGroup>
              :
              exercises.map((exercise,index) => 
                <Card className="mb-0" key={index} style={{marginTop:10}}>
                  <CardHeader style={{backgroundColor: 'lightblue'}}>
                    <Row>
                      <Col xs="10">
                        <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls="collapseOne">
                          <h5 className="m-0 p-0" style={{color: 'black'}}>{exercise.title}</h5>
                        </Button>
                        <small>  
                          <Moment format="Đã đăng vào HH:mm ngày DD/MM/YYYY">
                            {exercise.created}
                          </Moment>
                        </small>
                      </Col>
                    </Row>
                    <small>                  
                      Hạn
                      <Moment format=" HH:mm ngày DD/MM/YYYY">
                        {exercise.deadline}
                      </Moment>
                    </small>
                    <br/>
                    {
                      exercise.password
                      ?
                      <small>  
                        Mật khẩu: {exercise.password}
                      </small>
                      :
                      null
                    }
                  </CardHeader>
                  <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne">
                    <CardBody>
                      {
                        exercise.text.split('\n').map((itemChild, key) => {
                          return <span key={key}>{itemChild}<br/></span>
                        })
                      }
                      <br/>
                      <ListGroup>
                        {
                          exercise.attachFiles.map(file=>
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
                      </ListGroup>
                      <br/>
                      <Button block color="success" onClick={this.score.bind(this, exercise._id)} >Chấm điểm</Button>
                    </CardBody>
                    <CardFooter>
                      <ExerciseComments exercise={exercise}/>
                    </CardFooter>  
                  </Collapse>
                </Card>
              )
            }
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-question-circle" aria-hidden="true"></i>
            <b>Quiz</b>
          </CardHeader>
          <CardBody>
            <QuizModal courseId={this.props.match.params.id} eventId={this.props.match.params.lessonId}/>
            {
              quizzes.length === 0
              ?
              <ListGroup style={{marginTop:10}}>
                <ListGroupItem>Chưa có bài trắc nghiệm</ListGroupItem>
              </ListGroup>
              :
              <Fragment>
              {
                quizzes.map((quiz,index) => 
                  <Card className="mb-0" key={index} style={{marginTop:10}}>
                    <CardHeader style={{backgroundColor: 'lightblue'}}>
                      <Button block color="link" className="text-left m-0 p-0" onClick={this.jumpToQuizDetail.bind(this, quiz.quizId._id)}>
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{quiz.quizId.title}</h5>
                      </Button>
                      <small>                  
                        Thời gian bắt đầu làm
                        <Moment format=" HH:mm ngày DD/MM/YYYY">
                          {quiz.startTime}
                        </Moment>
                      </small>
                      <br/>
                      <small>                  
                        Hạn chót làm bài
                        <Moment format=" HH:mm ngày DD/MM/YYYY">
                          {quiz.deadline}
                        </Moment>
                      </small>
                      <br/>
                      {
                        quiz.password
                        ?
                        <small>  
                          Mật khẩu: {quiz.password}
                        </small>
                        :
                        null
                      }
                    </CardHeader>
                  </Card>
                )
              }
              </Fragment>
            }
          </CardBody>
        </Card>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  lesson: state.lesson
});

export default withRouter(connect(mapStateToProps, { getLessonIncourse })(InLesson));  