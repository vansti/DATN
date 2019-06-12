import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getLessonIncourse } from '../../actions/lessonActions';
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
  Button,
  FormGroup, 
  Input, 
  Col
} from 'reactstrap';
import ReactLoading from 'react-loading';
import NoImg from '../../assets/img/NoImg.png';
import ExerciseList from './Exercise/ExerciseList';
import Moment from 'react-moment'; 
import SweetAlert from 'react-bootstrap-sweetalert';

class Lesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accordion: [],
      loading: true,
      text: '',
      content: '',
      files: [],
      exercises: [],
      quizzes: [],
      quizSelected: '',
      password: '',
      isShowFail: false,
      isShowFailstartTime: false,
      isShowCheckPassword: false
    };
  }

  componentDidMount(){
    this.props.getLessonIncourse(this.props.match.params.id, this.props.match.params.lessonId)
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    
    const { lesson_in_course, loading } = nextProps.lesson
    if(!isEmptyObj(lesson_in_course))
    {
      var { text, content, files, exercises, quizzes, _id } = lesson_in_course
      if(this.props.match.params.lessonId === _id)
      {
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
    }
    this.setState({ 
      loading
    });

  }

  jumpToQuizLesson(quizId, quizDeadline, quizStartTime){
    var now = new Date();
    var deadline = new Date(quizDeadline);
    var startTime = new Date(quizStartTime);
    if(startTime.getTime() <= now.getTime())
    {
      if(deadline.getTime() >= now.getTime())
      {
        this.setState({
          isShowCheckPassword: true,
          quizSelected: quizId
        })
      }else{
        this.setState({
          isShowFail: true
        })
      }
    }else{
      this.setState({
        isShowFailstartTime: true
      })
    }

  }

  jumpToQuizDetail(quizId){
    this.props.history.push(`/quiz/quiz-detail/${quizId}`);
  }

  hideAlertCheckPassword = () => {
    this.setState({
      isShowCheckPassword: false
    })
    this.props.history.push(`/courses/${this.props.match.params.id}/lesson/${this.props.match.params.lessonId}/${this.state.quizSelected}`, { password: this.state.password });
  }
  
  hideAlertFail = () =>{
    this.setState({
      isShowFail: false
    })
  }

  hideAlertFailstartTime=()=>{
    this.setState({
      isShowFailstartTime: false
    })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { 
      content, 
      text, 
      loading,
      files,
      exercises,
      quizzes 
    } = this.state;
    const { role } = this.props.auth.user;

    return (
      <div className="animated fadeIn">
        <Modal isOpen={loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>

        <Alert color="dark" style={{textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
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
            <ExerciseList exercises={exercises} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <i className="fa fa-question-circle" aria-hidden="true"></i>
            <b>Bài trắc nghiệm</b>
          </CardHeader>
          <CardBody>
          {
            quizzes.length === 0
            ?
            <ListGroupItem>Chưa có bài trắc nghiệm</ListGroupItem>
            :
            <Fragment>
            {
              quizzes.map((quiz,index) => 
                <Card className="mb-0" key={index} style={{marginTop:10}}>
                  <CardHeader style={{backgroundColor: 'lightblue'}}>
                    {
                      role === 'student'
                      ?
                      <Button block color="link" className="text-left m-0 p-0" onClick={this.jumpToQuizLesson.bind(this, quiz.quizId._id, quiz.deadline, quiz.startTime)}>
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{quiz.quizId.title}</h5>
                      </Button>
                      :
                      <Button block color="link" className="text-left m-0 p-0" onClick={this.jumpToQuizDetail.bind(this, quiz.quizId._id)}>
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{quiz.quizId.title}</h5>
                      </Button>
                    }
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
                  </CardHeader>
                </Card>
              )
            }
            </Fragment>
          }
          </CardBody>
        </Card>
        <SweetAlert
          	danger
          	confirmBtnText="OK"
          	confirmBtnBsStyle="danger"
          	title="Đã hết hạn làm trắc nghiệm!"
            show={this.state.isShowFail}
            onConfirm={this.hideAlertFail}>
        </SweetAlert>
        <SweetAlert
          	warning
          	confirmBtnText="OK"
          	confirmBtnBsStyle="warning"
          	title="Chưa tới thời gian làm trắc nghiệm!"
            show={this.state.isShowFailstartTime}
            onConfirm={this.hideAlertFailstartTime}>
        </SweetAlert>
        <SweetAlert
          	confirmBtnText="OK"
          	confirmBtnBsStyle="primary"
          	title="Mời bạn nhập mật khẩu!"
            show={this.state.isShowCheckPassword}
            onConfirm={this.hideAlertCheckPassword}>
            <FormGroup row className="justify-content-md-center">
              <Col md="6">
                <Input type="text" name="password" value={this.state.password} onChange={this.onChange} placeholder="Mật khẩu..." />
              </Col>
            </FormGroup>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  lesson: state.lesson,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { getLessonIncourse })(Lesson));  