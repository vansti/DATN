import React, { Component } from 'react';
import { Label, FormGroup ,Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../../actions/authActions';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
      role: ''
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
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

    this.props.registerUser(newUser, this.props.history);


  }
  

  render() {
    const { errors } = this.state;

    return (
      <div className="animated fadeIn">
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="9" lg="7" xl="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form onSubmit={this.onSubmit}>
                      <h1>Đăng ký</h1>
                      <p className="text-muted">Tạo tài khoản nếu bạn là học viên hoặc giáo viên</p>
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
                      <InputGroup className="mb-3">
                        <Col md="3">
                          <Label>Bạn là ai? </Label>
                        </Col>
                        <Col md="9">
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="inline-radio1" name="role" value="student" onChange={this.onChange}/>
                            <Label className="form-check-label" check htmlFor="inline-radio1">Học viên</Label>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="inline-radio2" name="role" value="teacher" onChange={this.onChange}/>
                            <Label className="form-check-label" check htmlFor="inline-radio2">Giáo viên</Label>
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
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
