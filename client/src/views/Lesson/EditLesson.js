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
  CardBody,
  CardFooter
} from 'reactstrap';
import { getEventSchedule } from '../../actions/scheduleActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import config from '../../config';
// import PostInCourse from '../../components/PostInCourse';

import 'moment/locale/vi';
var moment = require('moment');

class EditLesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      date: '',
      text: '',
      content: '',
      files: []
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

    const { event, loading } = nextProps.schedule
    if(!isEmptyObj(event))
    {
      var { date, text, content, files } = event
      this.setState({ 
        date,
        text,
        content,
        files,
        loading 
      });
    }
    this.setState({ 
      loading
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
          url: result.info.secure_url
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

  }

  render() {
    const { 
      content, 
      date, 
      text, 
      loading,
      files 
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
                          <Col xs="10">
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
            {/* <PostInCourse/> */}
          </CardBody>
        </Card>
      </div>
    )
  }
}

EditLesson.propTypes = {
};

const mapStateToProps = state => ({
  schedule: state.schedule
});

export default withRouter(connect(mapStateToProps, { getEventSchedule })(EditLesson));  