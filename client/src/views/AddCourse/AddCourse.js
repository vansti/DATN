import React, { Component } from 'react';
import {Alert, Card, CardBody, CardFooter, CardHeader, Col, Row, Fade, Button, Collapse, Form, FormGroup, InputGroupAddon, Label, InputGroup, InputGroupText, Input} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { addCourse } from '../../actions/courseActions';

const styles = {
  bigAvatar: {
    width: 100,
    height: 100,
    margin: 'auto',
    borderRadius:50
  },
  input: {
    fontSize: 10
  }
}

class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      title:'',
      courseCode:'',
      coursePhoto: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isShowSuccess: false,
      errors:{}
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
  }

  handleChangePhoto = e =>{
    let file = e.target.files[0]
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        coursePhoto: reader.result
      });
    }
    reader.readAsDataURL(file)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }


    if (nextProps.success.data === "Thêm khóa học thành công") {
      this.setState({isShowSuccess: true})
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const courseData = {
      title: this.state.title,
      courseCode: this.state.courseCode,
      coursePhoto: this.state.coursePhoto,
    };

    console.log(courseData)
    this.props.addCourse(courseData, this.props.history);
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      title:'',
      courseCode:'',
      coursePhoto: '',
    })
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa fa-edit"></i>Thêm khóa học mới
                  <div className="card-header-actions">
                    <Button color="link" className="card-header-action btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></Button>
                    <Button color="link" className="card-header-action btn-close" onClick={this.toggleFade}><i className="icon-close"></i></Button>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form className="form-horizontal" onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label htmlFor="prependedInput">Tên khóa học</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-book"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input size="16" type="text" value={this.state.title} onChange={this.handleChange('title')}/>
                          </InputGroup>
                          {errors.title && <Alert color="danger">{errors.title}</Alert>}
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="prependedInput">Mã khóa học </Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-barcode"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input size="16" type="text" value={this.state.courseCode} onChange={this.handleChange('courseCode')}/>
                          </InputGroup>
                          {errors.courseCode && <Alert color="danger">{errors.courseCode}</Alert>}
                        </div>
                      </FormGroup>
                      <hr/>
                      <Label htmlFor="prependedInput">Hình đại diện khóa học</Label>
                      <br/>
                      <div className="preview-image">
                      {
                        this.state.coursePhoto === ''
                        ?
                        <img src='https://res.cloudinary.com/dk9jsd8vf/image/upload/v1551871672/defaultcourse.jpg' alt="avatar" style={styles.bigAvatar}/>
                        :
                        <img src={this.state.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                      }
                      </div>

                      <br/>
                      <Input style={styles.input} accept="image/*" onChange={this.handleChangePhoto} type="file" />
                      <br/>

                    </Form>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" color="primary" onClick={this.onSubmit}>Thêm</Button>
                  </CardFooter>
                </Collapse>
              </Card>
            </Fade>
          </Col>
        </Row>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm khóa học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
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
export default connect(mapStateToProps, { addCourse })(AddCourse); 
