import React, { Component } from 'react';
import { Card, CardBody, Form, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Modal, Alert, ModalBody, Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactLoading from 'react-loading';
import { addJoinedStudent, clearSuccess, clearErrors, searchStudent } from '../../actions/userActions'

class AddJoinedStudent extends Component {
  constructor() {
    super();
    this.state = {
      isShowSuccess: false,
      isLoading: false,
      search: '',
      errors: {},
      recipient_name: '',
      email: '',
      line1: '',
      city: '',
      loading: false,
      search_student: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success.mes === 'Thêm học viên thành công') {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess()
    }

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false, loading: false });
    }

    
    const { search_student } = nextProps.users;
    if(!isEmptyObj(search_student))
      this.setState({ search_student, loading: false });
    
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    if(isEmptyObj(this.state.search_student))
    {
      let errors = {
        city: 'Hãy tìm kiếm học viên'
      }
      this.setState({ errors })
    }else{

      const newUser = {
        courseId: this.props.match.params.courseId,
        studentId: this.state.search_student._id,
        recipient_name: this.state.recipient_name,
        email: this.state.email,
        line1: this.state.line1,
        city: this.state.city
      };
  
      // console.log(newUser)
      this.setState({ isLoading: true });
      this.props.addJoinedStudent(newUser);
      this.props.clearErrors();
    }

  }
  
  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.history.push(`/manage-courses/approve/student/${this.props.match.params.courseId}`);
  }

  onSearch = () =>{
    const userData = {
      email: this.state.search
    }
    this.setState({ loading: true })
    this.props.clearErrors();
    this.props.searchStudent(userData)
  }

  render() {
    const { errors, loading, search_student } = this.state;
    return (
      <div className="animated fadeIn">
        <Card className="mx-4">
          <CardBody className="p-4">
            <Form onSubmit={this.onSubmit}>

              <h3>Tìm kiếm thông tin học viên</h3>

              <Row>
                <Col xs='10'>
                  <InputGroup className="mb-2">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name="search" value={this.state.search} onChange={this.onChange} placeholder="Email học viên . . ."/>
                  </InputGroup>
                </Col>
                <Col>
                  <Button color="primary" onClick={this.onSearch} block>
                    {
                      loading === false
                      ?
                      'Tìm kiếm'
                      :
                      <div>
                        <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                      </div>
                    }
                  </Button>
                </Col>
              </Row>
              {
                !isEmptyObj(search_student)
                ?
                <Table bordered responsive size="sm">
                  <thead>
                    <tr className="thead-light">
                      <th>Hình đại diện</th>
                      <th>Email</th>
                      <th>Họ và Tên</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>                      
                        <div className="avatar">
                          <img src={search_student.photo} className="img-avatar" alt="" />
                        </div>
                      </th>
                      <td>{search_student.email}</td>
                      <td>{search_student.name}</td>
                    </tr>
                  </tbody>
                </Table>
                :
                <div>
                  {errors.search && <Alert color="danger">{errors.search}</Alert>}
                </div>
              }
              <h3>Thông tin người thanh toán</h3>
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Họ và Tên người thanh toán" name="recipient_name" value={this.state.recipient_name} onChange={this.onChange} />
              </InputGroup>
              {errors.recipient_name && <Alert color="danger">{errors.recipient_name}</Alert>}

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>@</InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Email người thanh toán" name="email" value={this.state.email} onChange={this.onChange} />
              </InputGroup>
              {errors.email2 && <Alert color="danger">{errors.email2}</Alert>}

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-address-card" aria-hidden="true"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Địa chỉ" name="line1" value={this.state.line1} onChange={this.onChange} />
              </InputGroup>
              {errors.line1 && <Alert color="danger">{errors.line1}</Alert>}
              
              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fa fa-home" aria-hidden="true"></i>                
                  </InputGroupText>
                </InputGroupAddon>
                <Input type="text" placeholder="Thành phố" name="city" value={this.state.city} onChange={this.onChange} />
              </InputGroup>
              {errors.city && <Alert color="danger">{errors.city}</Alert>}

              <Button color="success" onClick={this.onSubmit} block>Thêm học viên</Button>
            </Form>
          </CardBody>
        </Card>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Thêm học viên thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}
            onCancel={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success,
  users: state.users
});
export default connect(mapStateToProps, { addJoinedStudent, clearSuccess, clearErrors, searchStudent })(AddJoinedStudent); 