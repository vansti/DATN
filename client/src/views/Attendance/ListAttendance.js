import React, { Component } from 'react';
import {  Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

class ListAttendance extends Component {
 
  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            List Attendance
          </Col>
        </Row>
      </div>
    )
  }
}

ListAttendance.propTypes = {

};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { })(ListAttendance);  