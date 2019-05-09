import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/img/e-icon.png'
import { Button } from 'reactstrap';

class Dashboard extends Component {
  
  handleMycourse = () =>{
    this.props.history.push(`/courses`);
  }

  handleAllcourse = () =>{
    this.props.history.push(`/course-info`);
  }
  
  render() {
    const { name } = this.props.auth.user

    return (
      <div className="animated fadeIn">
        <span style={{fontFamily:'Lobster, cursive', fontSize:20}}>Xin chào <b><u>{name},</u></b></span>
        <div className="centered" style={{marginTop: 20}}>
          <img src={logo} alt='Logo' height="150" width="150" />
          <div style={{fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold', marginLeft: -130 }}>HỆ THỐNG QUẢN LÝ HỌC VIÊN</div>
          <div style={{marginLeft: -70, marginRight: 70, marginTop:30 }}>
            <Button color="secondary" size="lg" block onClick={this.handleAllcourse}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Xem khóa học hiện có
              </span>
            </Button>
            <Button color="secondary" size="lg" block onClick={this.handleMycourse}>
              <span style={{fontFamily:'Baloo Bhai, cursive'}}>
                Xem khóa học của bạn
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {  })(Dashboard);