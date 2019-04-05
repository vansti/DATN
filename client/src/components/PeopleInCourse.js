import React, { Component } from 'react';
import {  Row, Col, Container, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';

class PeopleInCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
    this.handleToSudentInfo = this.handleToSudentInfo.bind(this);
  }

  handleToSudentInfo(studentId){
    this.props.history.push('/student-info/' + studentId)
  }

  render() {
    const {users} = this.props.users;

    var StudentList = <tr><td></td><td><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td></tr>;
    if(users !== null)
    {
      if(users.students.length === 0)
      {
        StudentList = <tr><td></td><td>Chưa có học viên ghi danh</td></tr>
      }
      else{
        StudentList = users.students.map((user, index) =>
        <tr key={user._id} onClick={this.handleToSudentInfo.bind(this, user._id)} className="changeCursor">
          <th>                      
            <div className="avatar">
              <img src={user.photo} className="img-avatar" alt="" />
            </div>
          </th>
          <td>{user.name}</td>
        </tr>
        )
      }
    }

    var TeacherList = <tr><td></td><td><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td></tr>;
    if(users !== null)
    {
      if(users.teachers.length === 0)
      {
        TeacherList = <tr><td></td><td>Chưa có giáo viên ghi danh</td></tr>
      }
      else{
        TeacherList = users.teachers.map((user, index) =>
        <tr key={user._id}>
          <th>                      
            <div className="avatar">
              <img src={user.photo} className="img-avatar" alt="" />
            </div>
          </th>
          <td>{user.name}</td>
        </tr>
        )
      }
    }

    return (
      <Container>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <h3>Giáo viên</h3>
            <Table responsive hover>
              <tbody>
                {TeacherList}
              </tbody>
            </Table>
            <br/>
            <br/>
            <h3>Học viên</h3>
            <Table responsive hover>
              <tbody>
                {StudentList}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }
}

PeopleInCourse.propTypes = {
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users
});

export default withRouter(connect(mapStateToProps, { })(PeopleInCourse));  