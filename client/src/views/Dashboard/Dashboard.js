import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/img/e-icon.png'
import { Button, Container, Row, Col } from 'reactstrap';
import { getCurrentProfile } from '../../actions/profileActions';

class Dashboard extends Component {

  componentDidMount = () => {
    this.props.getCurrentProfile();
  }

  handleMycourse = () =>{
    this.props.history.push(`/courses`);
  }

  handleAllcourse = () =>{
    this.props.history.push(`/course-info`);
  }
  
  render() {
    const { name, role } = this.props.auth.user

    var Content = null ;

    switch (role.toString()) {
      case 'manager': 
        Content = 
          <div style={{ marginTop:30 }}>
            <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Tạo tài khoản
              </span>
            </Button>
            <Button color="secondary" size="lg" block onClick={()=> this.props.history.push(`/school-info`)}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Thông tin trung tâm
              </span>
            </Button>
          </div>
        break;

      case 'student': 
        Content = 
          <div style={{ marginTop:30 }}>
            <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Xem khóa học của bạn
              </span>
            </Button>
          </div>
        break;

      case 'teacher': 
        Content = 
        <div style={{ marginTop:30 }}>
          <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Xem khóa học của bạn
            </span>
          </Button>
        </div>
      break;

      case 'ministry': 
        Content = 
        <div style={{ marginTop:20 }}>
          <Button color="secondary" size="lg" block onClick={()=>this.props.history.push(`/manage-courses`)}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Quản lý khóa học
            </span>
          </Button>
          <Button color="secondary" size="lg" block onClick={()=>this.props.history.push(`/add-schedule`)}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Chỉnh sửa thời khóa biểu
            </span>
          </Button>
        </div>
      break;

      case 'admin': 
        Content = 
        <div style={{ marginTop:30 }}>
          <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
            <span style={{fontFamily:'Baloo Bhai, cursive'}}>
              Xem khóa học của bạn
            </span>
          </Button>
        </div>
      break;
      default: break;
    }

    return (
      <div className="animated fadeIn">
        <span style={{fontFamily:'Lobster, cursive', fontSize:20}}>Xin chào <b>{name},</b></span>
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <div>
                <img src={logo} alt='Logo' height="150" width="150" />
                <div style={{fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold' }}>TRUNG TÂM ĐÀO TẠO</div>
                {
                  Content
                }
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);