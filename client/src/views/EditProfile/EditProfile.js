import React, { Component } from 'react';
import {Modal,ModalBody,Alert, Card, CardBody, CardFooter, CardHeader, Col, Row, Fade, Button, Collapse, Form, FormGroup, InputGroupAddon, Label, InputGroup, InputGroupText, Input} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editProfile, getCurrentProfile } from '../../actions/profileActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import ModalChangePasword from '../../components/ModalChangePassword';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty'
import ReactDropzone from "react-dropzone";

const styles = {
  bigAvatar: {
    width: 75,
    height: 75,
    margin: 'auto',
    borderRadius:50
  },
  input: {
    fontSize: 10
  }
}
class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      name:'',
      email:'',
      photo: '',
      phone: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isShowSuccess: false,
      errors:{},
      file_avatar: null,
      imagePreviewUrl: '',
      isLoading: false
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleChange = name => event => {
    const value = name === 'photo'
      ? event.target.files[0]
      : event.target.value
    this.setState({ [name]: value })
  }
  
  componentDidMount = () => {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile
      this.setState({name: profile.name, email: profile.email, phone: profile.phone, photo: profile.photo})
    }

    if (nextProps.success.data === "Thay đổi thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
    }

  }

  onSubmit = e => {
    e.preventDefault();
    const profileData = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      photo: this.state.photo,
    };

    this.props.editProfile(profileData, this.props.history);
    document.getElementById("editform").reset();
    this.setState({isLoading: true})
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  onDrop = (files) => {
    let file = files[0]
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        photo: reader.result
      });
    }
    reader.readAsDataURL(file)
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
                  <i className="fa fa-edit"></i>Chỉnh sửa thông tin cá nhân
                  <div className="card-header-actions">
                    <Button color="link" className="card-header-action btn-minimize" data-target="#collapseExample" onClick={this.toggle}><i className="icon-arrow-up"></i></Button>
                    <Button color="link" className="card-header-action btn-close" onClick={this.toggleFade}><i className="icon-close"></i></Button>
                  </div>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form className="form-horizontal" id="editform" onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label htmlFor="prependedInput">Email</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-envelope"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input size="16" type="text" value={this.state.email} onChange={this.handleChange('email')}/>
                          </InputGroup>
                          {errors.email && <Alert color="danger">{errors.email}</Alert>}
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="prependedInput">Họ và Tên</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="icon-user"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input size="16" type="text" value={this.state.name} onChange={this.handleChange('name')}/>
                          </InputGroup>
                          {errors.name && <Alert color="danger">{errors.name}</Alert>}
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="prependedInput">Số điện thoại</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="icon-phone"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input size="16" type="text" value={this.state.phone} onChange={this.handleChange('phone')}/>
                          </InputGroup>
                          {errors.phone && <Alert color="danger">{errors.phone}</Alert>}
                        </div>
                      </FormGroup>
                      <hr/>
                      <Label htmlFor="prependedInput">Hình đại diện</Label>
                      <br/>

                      <div className="preview-image">
                        <img src={this.state.photo} alt="avatar" style={styles.bigAvatar}/>
                      </div>

                      <br/>
                      <ReactDropzone
                        accept="image/*"
                        onDrop={this.onDrop}
                      >
                        Thả avatar của bạn vào đây!
                      </ReactDropzone>
                      <br/>

                    </Form>
                    <div >
                      <ModalChangePasword />
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button type="submit" color="primary" onClick={this.onSubmit}>Lưu thay đổi</Button>
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
          	title="Thay đổi thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
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

EditProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  success: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
  success: state.success
});
export default connect(mapStateToProps, { editProfile,getCurrentProfile})(EditProfile); 
