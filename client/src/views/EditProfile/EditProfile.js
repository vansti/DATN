import React, { Component } from 'react';
import {Alert, Card, CardBody, CardFooter, CardHeader, Col, Row, Fade, Button, Collapse, Form, FormGroup, InputGroupAddon, Label, InputGroup, InputGroupText, Input} from 'reactstrap';
import defaultAvatar from '../../assets/img/defaultavatar.png';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editProfile, getCurrentProfile } from '../../actions/profileActions';
import SweetAlert from 'react-bootstrap-sweetalert';

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

  handleChangePhoto = e =>{
    let file = e.target.files[0]
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        photo: reader.result
      });
    }
    reader.readAsDataURL(file)
  }
  
  componentDidMount = () => {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile
      this.setState({name: profile.name, email: profile.email, phone: profile.phone, photo: profile.photo})
    }

    // if (nextProps.success) {
    //   this.setState({isShowSuccess: true})
    // }
  }

  onSubmit = e => {
    e.preventDefault();

    const profileData = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      photo: this.state.photo
    };

    this.props.editProfile(profileData, this.props.history);
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
  }

  render() {
    const { errors } = this.state;
    console.log(this.state.photo.length)
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
                    <Form className="form-horizontal" onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label htmlFor="prependedInput">Email</Label>
                        <div className="controls">
                          <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText><i className="fa fa-envelope"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input id="prependedInput" size="16" type="text" value={this.state.email} onChange={this.handleChange('email')}/>
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
                            <Input id="prependedInput" size="16" type="text" value={this.state.name} onChange={this.handleChange('name')}/>
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
                            <Input id="prependedInput" size="16" type="text" value={this.state.phone} onChange={this.handleChange('phone')}/>
                          </InputGroup>
                          {errors.phone && <Alert color="danger">{errors.phone}</Alert>}
                        </div>
                      </FormGroup>
                      <hr/>
                      <Label htmlFor="prependedInput">Hình đại diện</Label>
                      <br/>

                      <div className="preview-image">
                      {
                        this.state.photo.length === undefined ?
                        <img src={defaultAvatar} alt="avatar" style={styles.bigAvatar}/>
                        :
                        <img src={this.state.photo} alt="avatar" style={styles.bigAvatar}/>
                      }
                      </div>

                      <br/>
                      <Input style={styles.input} accept="image/*" onChange={this.handleChangePhoto} type="file" />
                      <br/>
                      
                      <div className="form-actions">
                        <Button color="danger" className="btn-pill float-right" ><i className="fa fa-lock"></i> Thay đồi mật khẩu</Button>
                      </div>

                    </Form>
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
      </div>
    )
  }
}

EditProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
});
export default connect(mapStateToProps, { editProfile,getCurrentProfile})(EditProfile); 
