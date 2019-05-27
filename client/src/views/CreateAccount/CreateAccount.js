import React, { Component } from 'react';
import { Label, FormGroup ,Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { createUser, clearSuccess, clearErrors } from '../../actions/authActions';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';

class CreateAccount extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
      role: '',
      isShowSuccess: false, 
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, isLoading: false });
    }

    if (nextProps.success.mes === "Tạo tài khoản thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess();
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role
    };
    this.setState({isLoading: true});
    this.props.clearErrors();
    this.props.createUser(newUser);
  }
  
  hideAlertSuccess(){
    this.setState({
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
      role: '',
      isShowSuccess: false
    })
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="animated fadeIn">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.onSubmit}>
                    <h1>Tạo tài khoản</h1>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Họ và Tên" autoComplete="username" name="name" value={this.state.name} onChange={this.onChange} />
                    </InputGroup>
                    {errors.name && <Alert color="danger">{errors.name}</Alert>}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" autoComplete="email" name="email" value={this.state.email} onChange={this.onChange}/>
                    </InputGroup>
                    {errors.email && <Alert color="danger">{errors.email}</Alert>}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Mật khẩu" autoComplete="new-password" name="password" value={this.state.password} onChange={this.onChange}/>
                    </InputGroup>
                    {errors.password && <Alert color="danger">{errors.password}</Alert>}
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Xác nhận lại mật khẩu" autoComplete="new-password" name="password2" value={this.state.password2} onChange={this.onChange}/>
                    </InputGroup>                
                    {errors.password2 && <Alert color="danger">{errors.password2}</Alert>}
                    <Label style={{fontWeight:'bold'}}>Chức danh</Label>
                    <InputGroup className="mb-3">
                      <Col md="1"></Col>
                      <Col md="10">
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio1" name="role" value="ministry" onChange={this.onChange}/>
                          <Label className="form-check-label" check htmlFor="inline-radio1">Giáo vụ</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio2" name="role" value="advisor" onChange={this.onChange}/>
                          <Label className="form-check-label" check htmlFor="inline-radio2">Cố vấn đào tạo</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input" type="radio" id="inline-radio3" name="role" value="teacher" onChange={this.onChange}/>
                          <Label className="form-check-label" check htmlFor="inline-radio3">Giáo viên</Label>
                        </FormGroup>
                      </Col>
                    </InputGroup>
                    {errors.role && <Alert color="danger">{errors.role}</Alert>}
                    <Button color="success" onClick={this.onSubmit} block>Tạo Tài Khoản</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Tạo tài khoản thành công"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success

});

export default connect(mapStateToProps, { createUser, clearSuccess, clearErrors })(CreateAccount);