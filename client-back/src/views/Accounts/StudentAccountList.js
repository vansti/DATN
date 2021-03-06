import React, { Component, Fragment } from 'react';
import { Card, CardBody, Table, Button, CardHeader, Input, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { connect } from 'react-redux';
import { getStudentAccounts, deleteAccount, clearSuccess, clearErrors } from '../../actions/accountActions';
import ReactLoading from 'react-loading';
import isEmptyObj from '../../validation/is-empty';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from 'react-moment'; 

let prev  = 0;
let last  = 0;

class StudentAccountList extends Component {
  constructor() {
    super();
    this.state = {
      intialAccounts: [],
      accounts: [],
      loading: true,
      currentPage: 1,
      accountsPerPage: 10,
      isShowSuccess: false,
      isShowError: false,
      isLoading: false
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLastClick = this.handleLastClick.bind(this);
    this.handleFirstClick = this.handleFirstClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  handleLastClick(event) {
    event.preventDefault();
    this.setState({
      currentPage:last
    });
  }

  handleFirstClick(event) {
    event.preventDefault();
    this.setState({
      currentPage:1
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts) {
      const { student_accounts, loading } = nextProps.accounts;
      this.setState({ 
        intialAccounts: student_accounts,
        accounts: student_accounts, 
        loading 
      });
    }

    if (nextProps.success.mes === "Xóa tài khoản thành công") {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess();
    }

    if (!isEmptyObj(nextProps.errors)) {
      if(nextProps.errors.fail === 'Tài khoản này đang ở trong khóa học không thể xóa')
      {
        this.setState({ isShowError: true, isLoading: false });
        this.props.clearErrors();
      }

    }
  }

  componentDidMount = () => {
    this.props.getStudentAccounts();
  }

  handleClickDelete(accountId){
    this.setState({isLoading: true})
    this.props.deleteAccount(accountId)
  } 

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialAccounts));
    updatedList = updatedList.filter((acc)=>
      acc.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
      acc.code.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({ accounts: updatedList });
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getAccounts();
  }

  hideAlertError(){
    this.setState({
      isShowError: false
    })
  }

  render() {
    const { accounts, loading, currentPage, accountsPerPage } = this.state;

    // Logic for displaying current courses
    let indexOfLastTodo = currentPage * accountsPerPage;
    let indexOfFirstTodo = indexOfLastTodo - accountsPerPage;
    let currentaccounts = accounts.slice(indexOfFirstTodo, indexOfLastTodo);
    prev  = currentPage > 0 ? (currentPage -1) :0;
    last = Math.ceil(accounts.length/accountsPerPage);

    // Logic for displaying page numbers
    let pageNumbers = [];
    for (let i = 1; i <=last; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <b>Danh sách tài khoản</b>
          </CardHeader>
          <CardBody>
            {
              loading
              ? 
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-search"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="text" name="search" value={this.state.search} onChange={this.onSearch} placeholder="Mã hoặc Tên tài khoản . . ." spellCheck='false'/>
                </InputGroup>

                <Table bordered responsive size="sm" style={{marginTop: 20}}>
                  <thead className="thead-light">
                    <tr>
                      <th>Hình đại diện</th>
                      <th>Mã số</th>
                      <th>Họ và Tên</th>
                      <th>Ngày tạo tài khoản</th>
                      <th>Xóa tài khoản</th>
                      <th>Chỉnh sửa tài khoản</th>
                      <th>Khóa học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentaccounts.map(elem =>
                        <tr key={elem._id}>
                          <th>                      
                            <div className="avatar">
                              <img src={elem.photo} className="img-avatar" alt="" />
                            </div>
                          </th>
                          <td>{elem.code}</td>
                          <td>{elem.name}</td>
                          <td>
                            <Moment format="HH:mm [ngày] DD [thg] MM, YYYY.">
                              {elem.created}
                            </Moment>
                          </td>
                          <td>
                            <Button color="danger" onClick={this.handleClickDelete.bind(this, elem._id)} > Xóa </Button>
                          </td>
                          <td>
                            <Button color="success" onClick={()=>this.props.history.push(`/student-accounts/edit/${elem._id}`)} > Chỉnh sửa </Button>
                          </td>
                          <td>
                            <Button color="primary" onClick={()=>this.props.history.push(`/student-accounts/out-course/${elem._id}`)} > Khóa học </Button>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
                <br/>
                <nav>
                  <Pagination>
                    <PaginationItem>
                      { 
                        prev === 0 
                        ? <PaginationLink previous tag="button" disabled />
                        : <PaginationLink previous tag="button" onClick={this.handleFirstClick} id={prev} href={prev} />
                      }
                    </PaginationItem>
                    <PaginationItem>
                      { 
                        prev === 0 
                        ? <PaginationLink disabled>Trước</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={prev} href={prev}>Trước</PaginationLink>
                      }
                    </PaginationItem>
                      {
                        pageNumbers.map((number,i) =>
                          <PaginationItem key= {i} active = {pageNumbers[currentPage-1] === (number) ? true : false} >
                            <PaginationLink onClick={this.handleClick} href={number} key={number} id={number}>
                              {number}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }

                    <PaginationItem>
                      {
                        currentPage === last 
                        ? <PaginationLink disabled>Sau</PaginationLink> 
                        : <PaginationLink onClick={this.handleClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}>Sau</PaginationLink>
                      }
                    </PaginationItem>

                    <PaginationItem>
                      {
                        currentPage === last 
                        ? <PaginationLink next tag="button" disabled />
                        : <PaginationLink next tag="button" onClick={this.handleLastClick} id={pageNumbers[currentPage]} href={pageNumbers[currentPage]}/>
                      }
                    </PaginationItem>
                  </Pagination>
                </nav>
              </Fragment>
            }
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Xóa thành công"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <SweetAlert
          	warning
          	confirmBtnText="OK"
          	confirmBtnBsStyle="warning"
          	title="Tài khoản này đang trong khóa học nên không thể xóa"
            show={this.state.isShowError}
            onConfirm={this.hideAlertError.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  success: state.success,
  errors: state.errors  
});
export default connect(mapStateToProps, { getStudentAccounts, deleteAccount, clearSuccess, clearErrors })(StudentAccountList); 