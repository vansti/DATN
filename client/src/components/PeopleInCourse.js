import React, { Component } from 'react';
import {  Row, Col, Container, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import isEmptyObj from '../validation/is-empty';

class PeopleInCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: {
        students:[],
        teachers:[]
      },
      loading: true
    };
    this.handleToSudentInfo = this.handleToSudentInfo.bind(this);
  }

  handleToSudentInfo(studentId){
    this.props.history.push('/student-info/' + studentId)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users)) {
      const {users, loading} = nextProps.users
      this.setState({
        users,
        loading
      })
    }
  }

  render() {
    const { students, teachers } = this.state.users
    const { loading } = this.state
    const { role } = this.props.auth.user

    return (
      <Container>
        <Row>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B' />
            :
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <h3>Giáo viên</h3>
              <Table responsive hover>
                <tbody>
                  {
                    teachers.length === 0
                    ?
                    <tr><td></td><td>Chưa có giáo viên tham gia</td></tr>
                    :
                    teachers.map(user =>
                      <tr key={user._id}>
                        <td>                      
                          <div className="avatar">
                            <img src={user.photo} className="img-avatar" alt="" />
                          </div>
                        </td>
                        <td>
                          <div>{user.name}</div>
                          <div className="small text-muted">
                            {user.email}
                          </div>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </Table>
              <br/>
              <br/>
              <h3>Học viên</h3>
              {
                role === 'student'
                ?
                <Table responsive hover>
                  <tbody>
                    {                    
                      students.length === 0
                      ?
                      <tr><td></td><td>Chưa có học viên</td></tr>
                      :
                      students.map(user =>
                        <tr key={user._id}>
                          <td>                      
                            <div className="avatar">
                              <img src={user.photo} className="img-avatar" alt="" />
                            </div>
                          </td>
                          <td>
                            <div>{user.name}</div>
                            <div className="small text-muted">
                              {user.email}
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
                :
                <Table responsive hover>
                  <tbody>
                    {                    
                      students.length === 0
                      ?
                      <tr><td></td><td>Chưa có học viên</td></tr>
                      :
                      students.map(user =>
                        <tr key={user._id} onClick={this.handleToSudentInfo.bind(this, user._id)} className="changeCursor">
                          <td>                      
                            <div className="avatar">
                              <img src={user.photo} className="img-avatar" alt="" />
                            </div>
                          </td>
                          <td>
                            <div>{user.name}</div>
                            <div className="small text-muted">
                              {user.email}
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
              }
            </Col>
          }
        </Row>
      </Container>
    )
  }
}

PeopleInCourse.propTypes = {
  users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { })(PeopleInCourse));  