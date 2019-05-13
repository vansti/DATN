import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CKEditor from 'ckeditor4-react';
import { 
  FormGroup, 
  Label, 
  Alert, 
  Modal, 
  ModalBody, 
  Input, 
  Button, 
  ListGroup, 
  ListGroupItem, 
  Row, 
  Col, 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Collapse
} from 'reactstrap';
import { getEventSchedule, editEvent, clearSuccess } from '../../actions/scheduleActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import config from '../../config';
import SweetAlert from 'react-bootstrap-sweetalert';
import ExerciseBox from './Exercise/ExerciseBox';
import NoImg from '../../assets/img/NoImg.png';
import Moment from 'react-moment'; 
import QuizModal from './Quiz/QuizModal';

import 'moment/locale/vi';
var moment = require('moment');

class EditLesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accordion: [],
      isShowSuccess: false,
      isLoading: false,
      loading: true,
      date: '',
      text: '',
      content: '',
      files: [],
      exercises: [],
      quizzes: []
    };
    this.onEditorChange = this.onEditorChange.bind( this );
  }

  onEditorChange( evt ) {
    this.setState({
      content: evt.editor.getData()
    });
  }

  componentDidMount(){
    this.props.getEventSchedule(this.props.match.params.id, this.props.match.params.lessonId)
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Thay đổi nội dung bài học thành công') {
      this.setState({isShowSuccess: true, isLoading: false})
    }
    
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

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
  }

  showWidget =()=>{
    let widget = window.cloudinary.createUploadWidget({
      cloudName: config.CLOUD_NAME,
      uploadPreset: config.UPLOAD_PERSET
    },(err, result)=>
    {
      if(result.event === 'success'){
        const file = {
          id: result.info.public_id,
          name: result.info.original_filename,
          url: result.info.secure_url,
          thumbnail: result.info.thumbnail_url
        } 
        this.setState(prevState => ({
          files: [...prevState.files, file]
        }))
      }
    })
    widget.open()
  }

  delete(file){
    const files = this.state.files.filter(i => i.id !== file.id)
    this.setState({files})
  }

  submitChange=()=>{
    const eventData ={
      text: this.state.text,
      content: this.state.content,
      files: this.state.files
    }
    this.props.editEvent(this.props.match.params.id, this.props.match.params.lessonId, eventData)
    this.setState({isLoading: true});
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      isLoading: false
    })
    this.props.clearSuccess();
    this.props.getEventSchedule(this.props.match.params.id, this.props.match.params.lessonId)
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
        </Alert>
        <Card>
          <CardBody>
            <FormGroup>
              <Label style={{fontWeight:'bold'}}>
                Tiêu đề bài học
              </Label>
              <Input type="text" value={text} onChange={this.handleChange('text')}/>
            </FormGroup>
            <FormGroup>
              <Label style={{fontWeight:'bold'}}>
                Nội dung bài học
              </Label>
              <CKEditor data={content} onChange={this.onEditorChange} />
            </FormGroup>
            <FormGroup>
              <Label style={{fontWeight:'bold'}}>
                Tài liệu học
              </Label>
              <br/>
              <Button color="danger" onClick={this.showWidget}>Đính kèm tài liệu</Button>
              <ListGroup style={{marginTop:10}}>
                {
                  files.length === 0
                  ?
                  <ListGroupItem>Chưa có tài liệu</ListGroupItem>
                  :
                  <Fragment>
                  {
                    files.map(file=>
                      <ListGroupItem key={file.id}>
                        <Row style={{alignContent: 'center'}}>
                          <Col xs="11">
                            {
                              file.thumbnail
                              ?
                              <img src={file.thumbnail} alt=""/> 
                              :
                              <img src={NoImg} style={{width:47}} alt=""/> 
                            }  
                            <a href={file.url} style={{marginLeft:10}}> {file.name} </a>
                          </Col>
                          <Col >
                            <Button color="danger" onClick={this.delete.bind(this, file)}><i className="fa fa-trash-o"></i></Button>
                          </Col>
                        </Row>
                      </ListGroupItem>
                    )
                  }
                  </Fragment>
                }
              </ListGroup>

            </FormGroup>
          </CardBody>
          <CardFooter>
            <Button color="primary" onClick={this.submitChange}>Lưu thay đổi</Button>
          </CardFooter>
        </Card>
        <Card>
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
                      <Col >
                        <small>                  
                          Hạn
                          <Moment format=" HH:mm ngày DD/MM/YYYY">
                            {exercise.deadline}
                          </Moment>
                        </small>
                      </Col>
                    </Row>
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
                    </CardBody>
                  </Collapse>
                </Card>
              )
            }
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <QuizModal courseId={this.props.match.params.id} eventId={this.props.match.params.lessonId}/>
            {
              quizzes.map((quiz,index) => 
                <Card className="mb-0" key={index} style={{marginTop:10}}>
                  <CardHeader style={{backgroundColor: 'lightblue'}}>
                    <Row>
                      <Col xs="10">
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{quiz.title}</h5>
                        <small>  
                          <Moment format="Đã đăng vào HH:mm ngày DD/MM/YYYY">
                            {quiz.created}
                          </Moment>
                        </small>
                      </Col>
                      <Col >
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

        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chỉnh sửa bài học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang lưu thay đổi</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

EditLesson.propTypes = {
};

const mapStateToProps = state => ({
  schedule: state.schedule,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { getEventSchedule, editEvent, clearSuccess })(EditLesson));  