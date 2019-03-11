import React, { Component } from 'react';
import {  Row, Col, Container } from 'reactstrap';
import { connect } from 'react-redux';


class PostInCourse extends Component {
 
  render() {

    return (
      <Container>
        <Row>
          <Col>
            Bài tập
          </Col>
        </Row>
      </Container>
    )
  }
}

PostInCourse.propTypes = {

};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, { })(PostInCourse);  