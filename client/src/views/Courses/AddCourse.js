import React, { Component } from 'react';
import {Modal, ModalBody, Alert, Card, CardBody, CardHeader, Col, Row, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText, InputGroupAddon} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import PointColumnsForm from '../../components/PointsColumn/Add/index'
import { addCourse, clearErrors, clearSuccess } from '../../actions/courseActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import ReactDropzone from "react-dropzone";
import CKEditor from 'ckeditor4-react';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const styles = {
  bigAvatar: {
    height: 200,
    width: 200,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
}

class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title:'',
      intro: '',
      coursePhoto: '',
      enrollDeadline: null,
      studyTime: '',
      openingDay: null,
      fee: '',
      info: '',
      file: null,
      isShowSuccess: false,
      errors:{},
      isLoading: false,
      invalidImg: false,
    };
    this.onEditorChange = this.onEditorChange.bind( this );
  }

  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
  }

  onDrop = (files) => {
    if(files[0] === undefined)
    {
      this.setState({
        invalidImg: true
      })
    }else{
      let file = files[0]
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          coursePhoto: reader.result,
          invalidImg: false
        });
      }
      reader.readAsDataURL(file)
      this.setState({
        file: files[0]
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});


    if (nextProps.success.data === "Thêm khóa học thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }
  }

  onSubmit = e => {
    e.preventDefault();
    let formInputs = document.getElementsByClassName('form-control');
    let pointColumns = formInputs.splice(3, formInputs.length);
    if(pointColumns.length <=0){
      alert("Hãy thêm ít nhất 1 cột điểm");
      return;
    }else{
      let total = 0;
      for(let i = 0; i < pointColumns.length; i++){
        total += pointColumns[i];
      }
      if(total !== 100){
        alert("Tổng phải bằng 100%");
        return;
      }
    }
    const courseData = {
      title: this.state.title,
      intro: this.state.intro,
      enrollDeadline: this.state.enrollDeadline,
      studyTime: this.state.studyTime,
      openingDay: this.state.openingDay,
      fee: this.state.fee,
      info: this.state.info,
      pointColumns: pointColumns
    };
    this.props.clearErrors();
    this.props.addCourse(courseData, this.state.file);
    this.setState({isLoading: true});
  }

  hideAlertSuccess(){
    this.setState({
      title:'',
      intro: '',
      coursePhoto: '',
      enrollDeadline: null,
      studyTime: '',
      openingDay: null,
      fee: '',
      info: '',
      file: null,
      isShowSuccess: false,
      errors:{},
      isLoading: false,
      invalidImg: false,
    })
    this.props.clearSuccess();
    this.props.clearErrors();
  }

  onEditorChange( evt ) {
    this.setState( {
      info: evt.editor.getData()
    });
  }

  onChangeDeadline = enrollDeadline => this.setState({ enrollDeadline })

  onChangeOpeningDay = openingDay => this.setState({ openingDay })

  render() {
    let form = (<PointColumnsForm onSubmit={this.submit}/>);
    const { errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Form className="form-horizontal" id="add-course-form" onSubmit={this.onSubmit}>
          <Card>
            <CardHeader>
              <i className="fa fa-list-alt" aria-hidden="true"></i>Tóm tắt khóa học
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Tên khóa học</Label>
                <Input type="text" value={this.state.title} onChange={this.handleChange('title')}/>
                {errors.title && <Alert color="danger">{errors.title}</Alert>}
              </FormGroup>
              <FormGroup>
                <Label>Giới thiệu ngắn về khóa học</Label>
                <Input rows="3" type="textarea" value={this.state.intro} onChange={this.handleChange('intro')}/>
                {errors.intro && <Alert color="danger">{errors.intro}</Alert>}
              </FormGroup>
              <FormGroup>{form}</FormGroup>
              <FormGroup>
                <Label>Hình đại diện khóa học</Label>
                <Row>
                  <Col xs="4">
                    <div className="preview-image">
                      {
                        this.state.coursePhoto === ''
                        ?
                        <img src='https://res.cloudinary.com/dk9jsd8vf/image/upload/v1552047406/1.png' alt="avatar" style={styles.bigAvatar}/>
                        :
                        <img src={this.state.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                      }
                    </div>
                  </Col>
                  <Col>
                    <ReactDropzone accept="image/*" onDrop={this.onDrop} >
                      Thả hình vào đây!
                    </ReactDropzone>
                  </Col>
                </Row>
                {
                  this.state.invalidImg === true
                  ? <div> <br/> <Alert color="danger">Hình ảnh không hợp lệ</Alert> </div> 
                  : null
                }
              </FormGroup>
              <FormGroup>
                <Label>Hạn chót ghi danh</Label> <br/>
                <DateTimePicker value={this.state.enrollDeadline} onChange={this.onChangeDeadline} />
                {errors.enrollDeadline && <Alert color="danger">{errors.intro}</Alert>}
              </FormGroup>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <i className="fa fa-info-circle" aria-hidden="true"></i>Chi tiết khóa học
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Thời gian học</Label>
                <Input type="text" value={this.state.studyTime} onChange={this.handleChange('studyTime')}/>
                {errors.studyTime && <Alert color="danger">{errors.studyTime}</Alert>}
              </FormGroup>
              <FormGroup>
                <Label>Ngày khai giảng</Label> <br/>
                <DatePicker
                  selected={this.state.openingDay}
                  onChange={this.onChangeOpeningDay}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input />}
                />
              </FormGroup>
              <FormGroup>
                <Label>Học phí</Label>
                <InputGroup>
                  <Input type="number" value={this.state.fee} onChange={this.handleChange('fee')}/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>VND</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {errors.fee && <Alert color="danger">{errors.fee}</Alert>}
              </FormGroup>
              <Label>Giới thiệu nội dung khóa học</Label>
              <CKEditor data={this.state.info} onChange={this.onEditorChange} />
            </CardBody>
          </Card>
        </Form>

        <Button type="submit" style={{marginBottom:20}} color="primary" onClick={this.onSubmit}>Thêm</Button>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm khóa học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang thêm khóa học</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

AddCourse.propTypes = {
  addCourse: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { addCourse, clearErrors, clearSuccess })(AddCourse); 
